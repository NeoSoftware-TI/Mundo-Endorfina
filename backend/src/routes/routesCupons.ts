import express from 'express';
import { createcupom, vercupom } from "../controllers/cupomController";
import { deletecupom, updatecupom } from "../controllers/cupomController";

const router = express.Router();

router.post("/criar", createcupom);
router.get("/ver", vercupom);
router.put('/cupomupdate', updatecupom);
router.delete('/cupomdelete', deletecupom);


export default router;