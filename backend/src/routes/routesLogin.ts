import express from 'express';
import { loginController } from '../controllers/loginControllers';
import { registerCController } from '../controllers/loginControllers';
import { registerSController } from '../controllers/loginControllers';
import { registerAController } from '../controllers/loginControllers';

const router = express.Router();

// Rota para login
router.post('/login', loginController);
router.post('/registerCliente', registerCController);
router.post('/registerSub-Admin', registerSController);
router.post('/registerAdmin', registerAController);

export default router;