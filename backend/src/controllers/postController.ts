import { Request, Response } from 'express';
import { pool } from '../config/database';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    descricao,
    foto_corrida,
    km_percorridos,
    tempo_corrida,
    local,
    titulo,
    id_pessoa,
  } = req.body;

  if (!descricao && !foto_corrida) {
    res.status(422).json({ msg: "O Post precisa ter um Texto ou Imagem!" });
    return;
  }
  if (km_percorridos == null) {
    res.status(422).json({ msg: "A distância (km_percorridos) é obrigatória!" });
    return;
  }
  if (!tempo_corrida) {
    res.status(422).json({ msg: "O tempo da corrida é obrigatório!" });
    return;
  }
  if (!local) {
    res.status(422).json({ msg: "O local é obrigatório!" });
    return;
  }
  if (!titulo) {
    res.status(422).json({ msg: "O título é obrigatório!" });
    return;
  }
  if (!id_pessoa) {
    res.status(422).json({ msg: "O ID da pessoa (id_pessoa) é obrigatório!" });
    return;
  }

  try {
    await pool.query(
      `INSERT INTO post
         (descricao, foto_corrida, km_percorridos, tempo_corrida, local, titulo, id_pessoa)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        descricao,
        foto_corrida,
        km_percorridos,
        tempo_corrida,
        local,
        titulo,
        id_pessoa,
      ]
    );
    res.status(200).json({ msg: "Post enviado com sucesso" });
  } catch (error) {
    console.error("Erro no createPost:", error);
    res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      "SELECT post.*, pessoas.nome, pessoas.telefone FROM post JOIN pessoas ON pessoas.id_pessoa = post.id_pessoa"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro no getPost:", error);
    res.status(500).json({ msg: "Erro ao buscar posts." });
  }
};
