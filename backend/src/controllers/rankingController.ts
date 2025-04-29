import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getRanking = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        id_login,
        id_pessoa,
        nome,
        km_percorridos,
        foto_url,
        pontos
       FROM pessoas
       ORDER BY km_percorridos DESC
       LIMIT 10`
    );
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ msg: "Erro ao buscar ranking." });
  }
};