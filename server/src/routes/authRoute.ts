import { Hono } from 'hono';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRoute = new Hono();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/me', authMiddleware, getMe);

export default authRoute;
