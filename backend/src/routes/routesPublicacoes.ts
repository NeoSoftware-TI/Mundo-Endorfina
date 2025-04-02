import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configuração para salvar as imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../src/uploads')); // Pasta para salvar as Publicações
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint para receber a publicação
router.post('/publicacoes', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: 'Publicação criada com sucesso!', data: req.file });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar publicação.' });
  }
});

export default router;
