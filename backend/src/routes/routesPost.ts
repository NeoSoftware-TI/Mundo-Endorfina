import express from 'express';
import multer from "multer";

import { createPost, getPostpessoal, getPostall, getPostpublic, deletePost, updatedislikePost, updatelikePost } from "../controllers/postController";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");           // pasta de saída
    },
    filename: (req, file, cb) => {
      // ex: foto_corrida-1634234234.jpg
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split(".").pop();
      cb(null, `${file.fieldname}-${unique}.${ext}`);
    },
  });
  const upload = multer({ storage });

  router.post(
    "/criar",
    upload.fields([
      { name: "foto_corrida", maxCount: 1 },
      { name: "foto_smartwatch", maxCount: 1 },
    ]),
    createPost
  );
router.get("/verpessoal/:id", getPostpessoal);
router.get("/vertodos/:id", getPostall);
router.get("/verpublic", getPostpublic);
router.delete("/deletar/:id", deletePost);
router.put("/updatedislike/:id", updatedislikePost);
router.put("/updatelike/:id", updatelikePost);

export default router;