import { Hono } from 'hono';
import { checkInProof, getRoomProofs, updateProof } from '../controllers/proofController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const proofRoute = new Hono();

proofRoute.use('*', authMiddleware);

proofRoute.post('/rooms/:id/checkin', checkInProof);
proofRoute.get('/rooms/:id/proofs', getRoomProofs);
proofRoute.put('/proofs/:id', updateProof);

export default proofRoute;
