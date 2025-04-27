import { Request, Response } from 'express';
import { pool } from '../config/database';

// //////////////////////////////////////////////////////////////////////////////////////// CRIA CUPOM
export const createcupom = async (req: Request, res: Response): Promise<void> => {
  const {
    titulo,
    marca,
    pontos,
    validade,
    link,
    disponivel,
  } = req.body;

  if (!titulo && !pontos) {
    res.status(422).json({ msg: "O Cupom precisa de um Titulo e Pontos!" });
    return;
  }
  if (marca == null) {
    res.status(422).json({ msg: "A Marca é obrigatória!" });
    return;
  }
  if (!link) {
    res.status(422).json({ msg: "Qual o link?" });
    return;
  }
  if (!disponivel) {
    res.status(422).json({ msg: "Se está disponivel ou não!" });
    return;
  }
  if (!validade) {
    res.status(422).json({ msg: "A Validade é obrigatório!" });
    return;
  }

  try {
    await pool.query(
      `INSERT INTO cupons
         (titulo, marca, pontos, validade, link, disponivel)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        marca,
        pontos,
        validade,
        link,
        disponivel,
      ]
    );

    res.status(200).json({ msg: "Cupom enviado com sucesso" });
  } catch (error) {
    console.error("Erro no createPost:", error);
    res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
  }
};

// //////////////////////////////////////////////////////////////////////////////////////// VER CUPOM
export const vercupom = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM cupons");

    const formatted = rows.map((r: any) => ({
      id: r.id_cupom,
      titulo: r.titulo,
      marca: r.marca,
      pontos: r.pontos,
      validade: r.validade,
      link: r.link,
      disponivel: r.disponivel,
    }));
    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Erro ao buscar Clientes:", error);
    res.status(500).json({ error: "Erro ao buscar Clientes" });
  }
};

// --------------------------------------------------------------------------------- DELETE

export const deletecupom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [result]: any = await pool.query(
      "DELETE FROM cupons WHERE id_cupom = ?",
      [id]
    );

    res.status(200).json({ message: "Cupom excluído com sucesso." });

  } catch (error: any) {
    console.error("Erro ao excluir cupom:", error);
    res.status(500).json({ error: "Erro ao excluir cupom." });
  }
};

// --------------------------------------------------------------------------------- UPDATE

export const updatecupom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titulo, marca, pontos, validade, resgates, disponivel } = req.body;

  if (!titulo || !marca || pontos === undefined || !validade || !disponivel) {
    res
      .status(400)
      .json({ error: "Os campos titulo, marca, pontos, validade e disponivel são obrigatórios." });
    return;
  }

  try {
    const [result]: any = await pool.query(
      `UPDATE cupons 
         SET titulo    = ?, 
             marca     = ?, 
             pontos    = ?, 
             validade  = ?,
             resgates  = ?, 
             disponivel= ?
       WHERE id_cupom = ?`,
      [titulo, marca, pontos, validade, resgates, disponivel, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Cupom não encontrado." });
      return;
    }

    res.status(200).json({ message: "Cupom atualizado com sucesso!" });

  } catch (error: any) {
    console.error("Erro ao atualizar cupom:", error);
    res.status(500).json({ error: "Erro interno ao atualizar cupom." });
  }
};

// --------------------------------------------------------------------------------- RESGATE

export const resgatarCupom = async (req: Request, res: Response): Promise<void> => {
  const { id_pessoa, id_cupom } = req.params;

  try {
    // 1) Tenta debitar os pontos do usuário apenas se ele tiver saldo suficiente
    const [result]: any = await pool.query(
      `UPDATE pessoas
         JOIN cupons ON cupons.id_cupom = ?
         SET pessoas.pontos = pessoas.pontos - cupons.pontos
       WHERE pessoas.id_pessoa    = ?
         AND pessoas.pontos >= cupons.pontos`,
      [id_cupom, id_pessoa]
    );

    // Se não afetou nenhuma linha, ou cupom inválido ou saldo insuficiente
    if (result.affectedRows === 0) {
      const [[userRow]]: any = await pool.query(
        "SELECT pontos FROM pessoas WHERE id_pessoa = ?",
        [id_pessoa]
      );

      if (!userRow) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        res.status(400).json({ error: "Saldo insuficiente para resgatar esse cupom." });
      }
    }

    // 2) Deleta o cupom que acabou de ser resgatado
    await pool.query(
      "DELETE FROM cupons WHERE id_cupom = ?",
      [id_cupom]
    );

    // 3) Busca o novo saldo do usuário
    const [[updated]]: any = await pool.query(
      "SELECT pontos FROM pessoas WHERE id_pessoa = ?",
      [id_pessoa]
    );

    res
      .status(200)
      .json({ message: "Cupom resgatado com sucesso!", pontosRestantes: updated.pontos });
  } catch (error: any) {
    console.error("Erro ao resgatar cupom:", error);
    res.status(500).json({ error: "Erro interno ao resgatar cupom." });
  }
};