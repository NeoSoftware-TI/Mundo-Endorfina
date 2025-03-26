import express from 'express';
import { loginController } from '../controllers/loginControllers';

const router = express.Router();

// Rota para login
router.post('/login', loginController);

export default router;
