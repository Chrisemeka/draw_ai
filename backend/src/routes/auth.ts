import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);

export default router;