import { Context } from 'hono';
import { prisma } from '../libs/prisma.js';
import { uploadImageToSupabaseStorage } from '../libs/supabase.js';

// Check-In Daily Proof Upload (Strict 1x Per Hari & Evaluasi Resets)
export const checkInProof = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const roomId = c.req.param('id');
    if (!roomId) {
      return c.json({ success: false, message: 'ID Room tidak valid' }, 400);
    }

    // CEK KETAT: Pengguna hanya boleh check-in 1 kali sehari
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingCheckInToday = await prisma.checkInProof.findFirst({
      where: {
        roomId,
        userId: authUser.id,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (existingCheckInToday) {
      return c.json(
        {
          success: false,
          message: 'Anda sudah melakukan check-in untuk hari ini! Silakan kembali lagi besok 🔥',
        },
        400
      );
    }

    let rawPhotoUrl = '';
    let note = '';

    const contentType = c.req.header('content-type') || '';
    if (contentType.includes('application/json')) {
      const jsonBody = await c.req.json();
      rawPhotoUrl = jsonBody.photoUrl || jsonBody.photo || '';
      note = jsonBody.note || '';
    } else {
      const formBody = await c.req.parseBody();
      rawPhotoUrl = (formBody['photoUrl'] as string) || (formBody['photo'] as string) || '';
      note = (formBody['note'] as string) || '';
    }

    if (!rawPhotoUrl) {
      return c.json({ success: false, message: 'Foto bukti wajib dilampirkan' }, 400);
    }

    // Unggah foto fisik langsung ke Supabase Storage Bucket 'proofs'
    const publicPhotoUrl = await uploadImageToSupabaseStorage(
      rawPhotoUrl,
      `proof-${authUser.id.substring(0, 5)}`
    );

    // Verify or auto-create room membership for user
    let member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: authUser.id,
        },
      },
    });

    if (!member) {
      member = await prisma.roomMember.create({
        data: {
          roomId,
          userId: authUser.id,
          currentStreak: 0,
          highestStreak: 0,
        },
      });
    }

    // Cek kapan check-in terakhir dilakukan oleh user ini di room ini
    const lastCheckIn = await prisma.checkInProof.findFirst({
      where: {
        roomId,
        userId: authUser.id,
      },
      orderBy: { createdAt: 'desc' },
    });

    let newStreak = 1;
    if (lastCheckIn) {
      const now = new Date();
      const lastDate = new Date(lastCheckIn.createdAt);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Jika check-in kemarin/hari ini -> streak bertambah. Jika terlewat > 1 hari -> reset ke 1
      if (diffDays <= 1) {
        newStreak = member.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Simpan data check-in dengan URL publik Supabase Storage permanen
    const proof = await prisma.checkInProof.create({
      data: {
        roomId,
        userId: authUser.id,
        photoUrl: publicPhotoUrl,
        note,
        status: 'APPROVED',
      },
      include: {
        user: true,
      },
    });

    // Update streak member
    const updatedMember = await prisma.roomMember.update({
      where: {
        id: member.id,
      },
      data: {
        currentStreak: newStreak,
        highestStreak: Math.max(member.highestStreak, newStreak),
      },
    });

    return c.json(
      {
        success: true,
        message: 'Bukti aktivitas berhasil tersimpan! Streak bertambah! 🔥',
        proof,
        streak: updatedMember.currentStreak,
      },
      201
    );
  } catch (error: any) {
    console.error('Check-in error:', error);
    return c.json({ success: false, message: 'Gagal melakukan check-in', error: error.message }, 500);
  }
};

// Get Feed Proofs for a Room
export const getRoomProofs = async (c: Context) => {
  try {
    const roomId = c.req.param('id');
    if (!roomId) {
      return c.json({ success: false, message: 'ID Room tidak valid' }, 400);
    }

    const proofs = await prisma.checkInProof.findMany({
      where: { roomId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return c.json({ success: true, proofs });
  } catch (error: any) {
    console.error('Get room proofs error:', error);
    return c.json({ success: false, message: 'Gagal mengambil data bukti', error: error.message }, 500);
  }
};

// Edit Proof Note & Photo
export const updateProof = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const proofId = c.req.param('id');
    if (!proofId) {
      return c.json({ success: false, message: 'ID Proof tidak valid' }, 400);
    }

    const { note, photoUrl } = await c.req.json();

    const existingProof = await prisma.checkInProof.findUnique({
      where: { id: proofId },
    });

    if (!existingProof) {
      return c.json({ success: false, message: 'Bukti tidak ditemukan' }, 404);
    }

    if (existingProof.userId !== authUser.id) {
      return c.json({ success: false, message: 'Anda tidak memiliki akses untuk mengubah postingan ini' }, 403);
    }

    let finalPhotoUrl = existingProof.photoUrl;

    // Jika pengguna mengunggah foto baru (base64)
    if (photoUrl && photoUrl.startsWith('data:image/')) {
      finalPhotoUrl = await uploadImageToSupabaseStorage(
        photoUrl,
        `proof-${authUser.id.substring(0, 5)}`
      );
    }

    const updatedProof = await prisma.checkInProof.update({
      where: { id: proofId },
      data: {
        note: note !== undefined ? note : existingProof.note,
        photoUrl: finalPhotoUrl,
      },
      include: {
        user: true,
      },
    });

    return c.json({
      success: true,
      message: 'Postingan bukti berhasil diperbarui! ✨',
      proof: updatedProof,
    });
  } catch (error: any) {
    console.error('Update proof error:', error);
    return c.json({ success: false, message: 'Gagal memperbarui postingan', error: error.message }, 500);
  }
};
