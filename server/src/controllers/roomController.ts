import { Context } from 'hono';
import { prisma } from '../libs/prisma.js';

// Helper to generate unique 6-char Invite Code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new Habit Room
export const createRoom = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const { name, habitTitle, habitDescription, targetDaysPerWeek, dailyDeadlineHours, startDate, endDate } = await c.req.json();

    if (!name || !habitTitle) {
      return c.json({ success: false, message: 'Nama room dan judul habit wajib diisi' }, 400);
    }

    const inviteCode = generateInviteCode();

    // Create room & add creator as first member
    const room = await prisma.room.create({
      data: {
        name,
        habitTitle,
        habitDescription: habitDescription || '',
        inviteCode,
        targetDaysPerWeek: Number(targetDaysPerWeek) || 7,
        dailyDeadlineHours: Number(dailyDeadlineHours) || 22,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdById: authUser.id,
        members: {
          create: {
            userId: authUser.id,
            currentStreak: 0,
            highestStreak: 0,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return c.json({ success: true, message: 'Room berhasil dibuat', room }, 201);
  } catch (error: any) {
    console.error('Create room error:', error);
    return c.json({ success: false, message: 'Gagal membuat room', error: error.message }, 500);
  }
};

// Join Room via Invite Code
export const joinRoom = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const { inviteCode } = await c.req.json();

    if (!inviteCode) {
      return c.json({ success: false, message: 'Kode invite wajib diisi' }, 400);
    }

    const room = await prisma.room.findUnique({
      where: { inviteCode: inviteCode.toUpperCase().trim() },
    });

    if (!room) {
      return c.json({ success: false, message: 'Room dengan kode invite tersebut tidak ditemukan' }, 404);
    }

    // Check if already a member
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: authUser.id,
        },
      },
    });

    if (existingMember) {
      return c.json({ success: true, message: 'Anda sudah bergabung di room ini', room });
    }

    // Join room
    await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: authUser.id,
        currentStreak: 0,
        highestStreak: 0,
      },
    });

    return c.json({ success: true, message: 'Berhasil bergabung ke room', room });
  } catch (error: any) {
    console.error('Join room error:', error);
    return c.json({ success: false, message: 'Gagal bergabung ke room', error: error.message }, 500);
  }
};

// Get User's Active Rooms
export const getUserRooms = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const members = await prisma.roomMember.findMany({
      where: { userId: authUser.id },
      include: {
        room: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
            checkIns: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    const rooms = members.map((m) => m.room);

    return c.json({ success: true, rooms });
  } catch (error: any) {
    console.error('Get user rooms error:', error);
    return c.json({ success: false, message: 'Gagal mengambil data room', error: error.message }, 500);
  }
};

// Get Single Room Detail
export const getRoomDetail = async (c: Context) => {
  try {
    const roomId = c.req.param('id');

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        checkIns: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!room) {
      return c.json({ success: false, message: 'Room tidak ditemukan' }, 404);
    }

    return c.json({ success: true, room });
  } catch (error: any) {
    console.error('Get room detail error:', error);
    return c.json({ success: false, message: 'Gagal mengambil detail room', error: error.message }, 500);
  }
};
