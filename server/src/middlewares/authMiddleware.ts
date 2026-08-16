import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  id: string;
  email: string;
  name?: string;
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Akses ditolak: Token autentikasi tidak ditemukan' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'habitduel_super_secret_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    c.set('user' as any, decoded);
    await next();
  } catch (error) {
    return c.json({ success: false, message: 'Token autentikasi tidak valid atau sudah kadaluwarsa' }, 401);
  }
});
