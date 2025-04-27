import { Request, Response } from 'express';
import { pool } from '../config/database';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    descricao,
    foto_corrida,
    km_percorridos,
    tempo_corrida,
    local,
    chegada,
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
    await pool.query('START TRANSACTION');
    
    await pool.query(
      `INSERT INTO post
         (descricao, foto_corrida, km_percorridos, tempo_corrida, local, chegada, titulo, id_pessoa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        descricao,
        foto_corrida,
        km_percorridos,
        tempo_corrida,
        local,
        chegada,
        titulo,
        id_pessoa,
      ]
    );

    await pool.query(
      `UPDATE pessoas 
       SET km_percorridos = IFNULL(km_percorridos, 0) + ?,
           pontos = IFNULL(pontos, 0) + (? * 1)
       WHERE id_pessoa = ?`,
      [km_percorridos, km_percorridos, id_pessoa]
    );
    
    await pool.query('COMMIT');
    res.status(200).json({ msg: "Post enviado com sucesso" });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Erro no createPost:", error);
    res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
  }
};


// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export const getPostall = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      `SELECT
         post.id_post AS id,
         post.descricao,
         post.foto_corrida,
         post.km_percorridos,
         post.tempo_corrida,
         post.titulo,
         pessoas.id_pessoa,
         pessoas.nome,
         post.data_publicacao,
         post.local
       FROM post
       JOIN pessoas ON post.id_pessoa = pessoas.id_pessoa`,
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro no getPost:", error);
    res.status(500).json({ msg: "Erro ao buscar posts." });
  }
};

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export const getPostpessoal = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      `SELECT
         post.id_post AS id,
         post.descricao,
         post.foto_corrida,
         post.km_percorridos,
         post.tempo_corrida,
         post.titulo,
         pessoas.id_pessoa,
         pessoas.nome,
         post.data_publicacao,
         post.local
       FROM post
       JOIN pessoas ON post.id_pessoa = pessoas.id_pessoa
       WHERE post.id_pessoa = ?`,
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro no getPost:", error);
    res.status(500).json({ msg: "Erro ao buscar posts." });
  }
};

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export const getPostpublic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      `SELECT
         post.id_post AS id,
         post.descricao,
         post.foto_corrida,
         post.km_percorridos,
         post.tempo_corrida,
         post.titulo,
         pessoas.id_pessoa,
         pessoas.nome,
         post.data_publicacao,
         post.local
       FROM post
       JOIN pessoas ON post.id_pessoa = pessoas.id_pessoa`,
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro no getPost:", error);
    res.status(500).json({ msg: "Erro ao buscar posts." });
  }
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| UPDATE

export const updatelikePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // id do post
  try {
    const [result]: any = await pool.query(
      `UPDATE post
         SET likes = IFNULL(likes, 0) + 1
       WHERE id_post = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post não encontrado." });
      return;
    }
    // opcional: retornar o novo total de likes
    const [[row]]: any = await pool.query(
      "SELECT likes FROM post WHERE id_post = ?",
      [id]
    );
    res.json({ likes: row.likes });
  } catch (err: any) {
    console.error("Erro no likePost:", err);
    res.status(500).json({ error: "Erro interno ao registrar like." });
  }
};
export const updatedislikePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // id do post
  try {
    const [result]: any = await pool.query(
      `UPDATE post
         SET dislikes = IFNULL(dislikes, 0) + 1
       WHERE id_post = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post não encontrado." });
      return;
    }
    // opcional: retornar o novo total de dislikes
    const [[row]]: any = await pool.query(
      "SELECT dislikes FROM post WHERE id_post = ?",
      [id]
    );
    res.json({ dislikes: row.dislikes });
  } catch (err: any) {
    console.error("Erro no likePost:", err);
    res.status(500).json({ error: "Erro interno ao registrar like." });
  }
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| DELETE

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query(
      "DELETE FROM post WHERE id_post = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post não encontrado." });
      return;
    }
    res.json({ msg: "Post deletado com sucesso." });
  } catch (err: any) {
    console.error("Erro no deletePost:", err);
    res.status(500).json({ error: "Erro interno ao deletar post." });
  }
};