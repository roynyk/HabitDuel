import { Hono } from 'hono';
import { createRoom, joinRoom, getUserRooms, getRoomDetail } from '../controllers/roomController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const roomRoute = new Hono();

roomRoute.use('*', authMiddleware);

roomRoute.post('/', createRoom);
roomRoute.post('/join', joinRoom);
roomRoute.get('/', getUserRooms);
roomRoute.get('/:id', getRoomDetail);

export default roomRoute;
