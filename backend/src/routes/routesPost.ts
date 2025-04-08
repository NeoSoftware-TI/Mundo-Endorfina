import express from 'express';
import { createPost, getPost } from "../controllers/postController";

const router = express.Router();

router.post("/criar", createPost);
router.get("/ver", getPost);

export default router;