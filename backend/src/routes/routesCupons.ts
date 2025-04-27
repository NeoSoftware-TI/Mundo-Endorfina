import express from 'express';
import { createcupom, vercupom } from "../controllers/cupomController";
import { deletecupom, updatecupom } from "../controllers/cupomController";
import { resgatarCupom } from "../controllers/cupomController";

const router = express.Router();

router.post("/criar", createcupom);
router.get("/ver", vercupom);
router.put('/cupomupdate/:id', updatecupom);
router.delete('/cupomdelete/:id', deletecupom);
router.post('/resgatar/:id_pessoa/:id_cupom',resgatarCupom);

export default router;