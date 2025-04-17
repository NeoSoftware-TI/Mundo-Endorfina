import express from 'express';
import { createPost, getPostpessoal, getPostall, getPostpublic } from "../controllers/postController";

const router = express.Router();

router.post("/criar", createPost);
router.get("/verpessoal/:id", getPostpessoal);
router.get("/vertodos/:id", getPostall);
router.get("/verpublic", getPostpublic);

export default router;