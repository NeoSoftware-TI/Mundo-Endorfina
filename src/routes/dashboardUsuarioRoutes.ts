import { Router } from 'express';
import { dashboardUsuario } from '../controllers/dashboardUsuarioController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/dashboard', verifyToken, dashboardUsuario);

export default router;