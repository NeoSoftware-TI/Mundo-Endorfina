import { Router } from 'express';
import { 
    visualizarMetas, 
    verificarCupons, 
    historicoMetasUsuarios,
    visualizarFeed
} from '../controllers/dashboardSubAdminController';
import { verifyToken, isSubAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/metas', verifyToken, isSubAdmin, visualizarMetas);
router.get('/cupons', verifyToken, isSubAdmin, verificarCupons);
router.get('/historico-metas', verifyToken, isSubAdmin, historicoMetasUsuarios);
router.get('/feed', verifyToken, isSubAdmin, visualizarFeed);

export default router;
