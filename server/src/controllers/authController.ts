import { Context } from 'hono';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../libs/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'habitduel_super_secret_key_2026';

// Register User (Perintah pendaftaran asli ke Supabase Database)
export const register = async (c: Context) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ success: false, message: 'Email dan password wajib diisi' }, 400);
    }

    if (password.length < 6) {
      return c.json({ success: false, message: 'Password minimal 6 karakter' }, 400);
    }

    // Cek apakah user sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return c.json({ success: false, message: 'Email sudah terdaftar. Silakan login.' }, 400);
    }

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database PostgreSQL via Prisma
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
      },
    });

    // Buat JWT Token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return c.json(
      {
        success: true,
        message: 'Registrasi berhasil',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      },
      201
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return c.json({ success: false, message: 'Gagal melakukan registrasi', error: error.message }, 500);
  }
};

// Login User (Verifikasi autentikasi asli dengan password hashed di Database)
export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ success: false, message: 'Email dan password wajib diisi' }, 400);
    }

    // Cari user berdasarkan email di Supabase Database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Jika user TIDAK ditemukan di database
    if (!user) {
      return c.json({ success: false, message: 'Email atau password salah' }, 401);
    }

    // Verifikasi password asli dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return c.json({ success: false, message: 'Email atau password salah' }, 401);
    }

    // Buat JWT Token asli
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return c.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ success: false, message: 'Gagal melakukan login', error: error.message }, 500);
  }
};

// Get Current User (Me)
export const getMe = async (c: Context) => {
  try {
    const authUser = c.get('user' as any);
    if (!authUser) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user) {
      return c.json({ success: false, message: 'User tidak ditemukan' }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    return c.json({ success: false, message: 'Gagal mengambil data user', error: error.message }, 500);
  }
};
