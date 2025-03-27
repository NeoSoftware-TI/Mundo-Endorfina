import { Router } from 'express';
import { dashboardUsuario } from '../controllers/dashboardUsuarioController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/dashboard', verifyToken, (req, res) => {
    dashboardUsuario(req, res).catch((error) => {
        console.error('Erro inesperado no dashboard:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    });
});

export default router;