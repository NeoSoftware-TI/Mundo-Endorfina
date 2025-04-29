import { Request, Response } from 'express';
import { pool } from '../config/database';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    titulo,
    descricao,
    km_percorridos,
    tempo_corrida,
    local,
    chegada,
    id_pessoa,
  } = req.body;

  // multer coloca os arquivos em req.files
  // tipo: { [fieldname: string]: Express.Multer.File[] }
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const fotoArquivo = files?.foto_corrida?.[0];
  const watchArquivo = files?.foto_smartwatch?.[0];

  // pega o nome do arquivo salvo, ou null
  const foto_corrida = fotoArquivo ? fotoArquivo.filename : null;
  const foto_smartwatch = watchArquivo ? watchArquivo.filename : null;

  // validações (sem foto ou descrição, etc)
  if (!descricao && !foto_corrida) {
    res.status(422).json({ msg: "O Post precisa ter um Texto ou Imagem!" });
    return;
  }

  try {
    await pool.query("START TRANSACTION");

    await pool.query(
      `INSERT INTO post
         (titulo, descricao, km_percorridos, tempo_corrida, local, chegada, id_pessoa, foto_corrida, foto_smartwatch)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descricao,
        km_percorridos,
        tempo_corrida,
        local,
        chegada,
        id_pessoa,
        foto_corrida,
        foto_smartwatch,
      ]
    );

    // atualiza km_percorridos e pontos da pessoa
    await pool.query(
      `UPDATE pessoas 
       SET km_percorridos = IFNULL(km_percorridos, 0) + ?,
           pontos = IFNULL(pontos, 0) + (? * 7)
       WHERE id_pessoa = ?`,
      [km_percorridos, km_percorridos, id_pessoa]
    );

    await pool.query("COMMIT");
    res.status(200).json({ msg: "Post enviado com sucesso" });
  } catch (error: any) {
    await pool.query("ROLLBACK");
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
         post.likes,
         post.dislikes,
         pessoas.id_pessoa,
         pessoas.nome,
         pessoas.foto_url, 
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
         post.likes,
         post.dislikes,
         pessoas.id_pessoa,
         pessoas.nome,
         pessoas.foto_url,  
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
         post.likes,
         post.dislikes,
         pessoas.id_pessoa,
         pessoas.nome,
         pessoas.foto_url,
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
    await pool.query("START TRANSACTION");

    // 1. Recupera apenas km_percorridos e id_pessoa (que já existem)
    const [postRows]: any = await pool.query(
      "SELECT km_percorridos, id_pessoa FROM post WHERE id_post = ?",
      [id]
    );

    if (postRows.length === 0) {
      res.status(404).json({ error: "Post não encontrado." });
      return;
    }

    const { km_percorridos, id_pessoa } = postRows[0];
    const pontos_a_remover = km_percorridos * 7; // Calcula na hora

    // 2. Atualização segura
    await pool.query(
      `UPDATE pessoas 
       SET km_percorridos = GREATEST(km_percorridos - ?, 0),
           pontos = GREATEST(pontos - ?, 0)
       WHERE id_pessoa = ?`,
      [km_percorridos, pontos_a_remover, id_pessoa]
    );

    // 3. Deleta o post
    await pool.query("DELETE FROM post WHERE id_post = ?", [id]);

    await pool.query("COMMIT");
    res.json({ msg: "Post deletado com sucesso." });
  } catch (err: any) {
    await pool.query("ROLLBACK");
    console.error("Erro no deletePost:", err);
    res.status(500).json({ error: "Erro interno ao deletar post." });
  }
};