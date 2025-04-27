import express from 'express';
import { createPost, getPostpessoal, getPostall, getPostpublic, deletePost, updatedislikePost, updatelikePost } from "../controllers/postController";

const router = express.Router();

router.post("/criar", createPost);
router.get("/verpessoal/:id", getPostpessoal);
router.get("/vertodos/:id", getPostall);
router.get("/verpublic", getPostpublic);
router.delete("/deletar/:id", deletePost);
router.put("/updatedislike/:id", updatedislikePost);
router.put("/updatelike/:id", updatelikePost);

export default router;