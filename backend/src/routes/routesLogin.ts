import express from 'express';
import { loginController } from '../controllers/loginControllers';
import { registerCController } from '../controllers/loginControllers';
import { registerSController } from '../controllers/loginControllers';
import { registerAController } from '../controllers/loginControllers';
import { updatePessoa } from '../controllers/loginControllers';
import { deletePessoa } from '../controllers/loginControllers';
import { getClientes } from "../controllers/loginControllers";
import { getSubadmin } from "../controllers/loginControllers";
import { getAdmin } from "../controllers/loginControllers";
import { getPessoas } from "../controllers/loginControllers";

const router = express.Router();

// Rota para login
router.post('/login', loginController);
router.post('/registerCliente', registerCController);
router.post('/registerSub-Admin', registerSController);
router.post('/registerAdmin', registerAController);
router.put('/pessoasupdate/:id', updatePessoa);
router.delete('/pessoasdelete/:id', deletePessoa);
router.get("/clientes", getClientes);
router.get("/subadmin", getSubadmin);
router.get("/admin", getAdmin);
router.get("/pessoas", getPessoas);

export default router;