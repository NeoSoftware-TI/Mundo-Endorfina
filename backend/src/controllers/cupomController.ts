import { Request, Response } from 'express';
import { pool } from '../config/database';

// //////////////////////////////////////////////////////////////////////////////////////// CRIA CUPOM
export const createcupom = async (req: Request, res: Response): Promise<void> => {
  const {
    titulo,
    marca,
    pontos,
    validade,
    resgates,
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
  if (!resgates) {
    res.status(422).json({ msg: "Quantos resgates pode ter?" });
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
         (titulo, marca, pontos, validade, resgates, disponivel)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        marca,
        pontos,
        validade,
        resgates,
        disponivel,
      ]
    );

    res.status(200).json({ msg: "Post enviado com sucesso" });
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
      id: r.id_cliente,
      titulo: r.titulo,
      marca: r.marca,
      pontos: r.pontos,
      validade: r.validade,
      resgates: r.resgates,
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
      "DELETE FROM cupons WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Cupom não encontrado." });
      return;
    }

    res.status(200).json({ message: "Cupom excluído com sucesso." });

  } catch (error: any) {
    console.error("Erro ao excluir cupom:", error);
    res.status(500).json({ error: "Erro ao excluir cupom." });
  }
};

// --------------------------------------------------------------------------------- UPDATE

export const updatecupom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    res.status(400).json({ error: 'Os campos nome, email e telefone são obrigatórios.' });
    return;
  }

  try {
    // Buscar id_login correspondente à pessoa
    const [pessoaResult]: any = await pool.query(
      "SELECT id_login FROM pessoas WHERE id_pessoa = ?",
      [id]
    );

    if (pessoaResult.length === 0) {
      res.status(404).json({ error: "Pessoa não encontrada." });
      return;
    }

    const id_login = pessoaResult[0].id_login;

    // Atualiza a tabela pessoas
    await pool.query(
      "UPDATE pessoas SET nome = ?, email = ?, telefone = ? WHERE id_pessoa = ?",
      [nome, email, telefone, id]
    );

    // Atualiza a tabela cliente (se existir)
    await pool.query(
      "UPDATE cliente SET nome = ?, email = ?, telefone = ? WHERE id_pessoa = ?",
      [nome, email, telefone, id]
    );

    // Atualiza a tabela login (se existir)
    if (id_login) {
      await pool.query(
        "UPDATE login SET email = ? WHERE id_login = ?",
        [email, id_login]
      );
    }

    res.status(200).json({ message: "Pessoa, login e cliente atualizados com sucesso!" });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar dados." });
  }
};