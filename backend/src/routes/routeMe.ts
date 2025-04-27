import { Router, Request, Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/me", verifyToken, (req: Request, res: Response) => {
  // req.user já foi injetado pelo verifyToken
  const user = (req as any).user;
  if (!user) {
    // envia 401 e sai da função
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  // envia o id e termina com void return
  res.json({ id: user.id });
  return;
});

export default router;
