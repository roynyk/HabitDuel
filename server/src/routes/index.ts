import { Hono } from 'hono';
import authRoute from './authRoute.js';
import roomRoute from './roomRoute.js';
import proofRoute from './proofRoute.js';

const router = new Hono();

router.route('/auth', authRoute);
router.route('/rooms', roomRoute);
router.route('/proofs', proofRoute);

export default router;
