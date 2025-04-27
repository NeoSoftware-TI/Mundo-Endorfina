import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { pool } from '../config/database';

// --------------------------------------------------------------------------------- LOGIN
export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    return;
  }

  try {
    // Realiza um JOIN para buscar os dados da tabela login e a pessoa vinculada
    const [rows]: any = await pool.query(
      `SELECT login.id_login, login.senha, login.tipo, pessoas.id_pessoa 
       FROM login JOIN pessoas ON login.id_login = pessoas.id_login 
       WHERE login.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
      return;
    }

    const user = rows[0];

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      res.status(401).json({ erro: 'Senha incorreta.' });
      return;
    }

    // Gera o token JWT com o id da pessoa
    const token = jwt.sign(
      { id: user.id_pessoa, tipo: user.tipo },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (error: any) {
    console.error("Erro no login:", error.message); // Adicione isso
    res.status(500).json({ erro: "Erro no servidor.", detalhe: error.message });
  }
};

// --------------------------------------------------------------------------------- Registro para Cliente
export const registerCController = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    if (!nome) {
        res.status(422).json({ msg: "O Nome é Obrigatório!" });
        return;
    }
    if (!email) {
        res.status(422).json({ msg: "O Email é Obrigatório!" });
        return;
    }
    if (!telefone) {
        res.status(422).json({ msg: "O Telefone é Obrigatório!" });
        return;
    }
    if (!senha) {
        res.status(422).json({ msg: "A Senha é Obrigatória!" });
        return;
    }
    if (senha !== confirmsenha) {
        res.status(422).json({ msg: "As Senhas não são Iguais!" });
        return;
    }

    try {
        // Verifica se o email já existe na tabela "pessoas"
        const [data]: any = await pool.query("SELECT email FROM pessoas WHERE email = ?", [email]);
        if (data.length > 0) {
            res.status(500).json({ msg: "Este email já está sendo usado!" });
            return;
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 8);

        // Inicia a transação
        await pool.query("START TRANSACTION");

        // Insere os dados na tabela "login"
        const [loginResult]: any = await pool.query(
            "INSERT INTO login (email, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Cliente']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        const [pessoaResult] = await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
        );

        const id_pessoa = (pessoaResult as any).insertId;

        // Inserir na tabela cliente
        await pool.query(
            "INSERT INTO cliente (id_login, id_pessoa, nome, email, telefone) VALUES (?, ?, ?, ?, ?)",
            [id_login, id_pessoa, nome, email, telefone]
        );

        // Confirma a transação
        await pool.query("COMMIT");

        res.status(200).json({ msg: "Cadastrado com Sucesso" });
    } catch (error: any) {
        // Em caso de erro, faz rollback da transação
        await pool.query("ROLLBACK");
        console.error("Erro no registro:", error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!", error: error.message });
    }
};

// --------------------------------------------------------------------------------- Registro para Sub-Admin
export const registerSController = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    if (!nome) {
        res.status(422).json({ msg: "O Nome é Obrigatório!" });
        return;
    }
    if (!email) {
        res.status(422).json({ msg: "O Email é Obrigatório!" });
        return;
    }
    if (!telefone) {
        res.status(422).json({ msg: "O Telefone é Obrigatório!" });
        return;
    }
    if (!senha) {
        res.status(422).json({ msg: "A Senha é Obrigatória!" });
        return;
    }
    if (senha !== confirmsenha) {
        res.status(422).json({ msg: "As Senhas não são Iguais!" });
        return;
    }

    try {
        // Verifica se o email já existe na tabela "pessoas"
        const [data]: any = await pool.query("SELECT email FROM pessoas WHERE email = ?", [email]);
        if (data.length > 0) {
            res.status(500).json({ msg: "Este email já está sendo usado!" });
            return;
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 8);

        // Inicia a transação
        await pool.query("START TRANSACTION");

        // Insere os dados na tabela "login"
        const [loginResult]: any = await pool.query(
            "INSERT INTO login (email, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Sub-Admin']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        const [pessoaResult] = await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
        );

        const id_pessoa = (pessoaResult as any).insertId;

        // Inserir na tabela sub_admin
        await pool.query(
            "INSERT INTO sub_admin (id_login, nome, email, telefone) VALUES (?, ?, ?, ?)",
            [id_login, nome, email, telefone]
        );
        // Confirma a transação
        await pool.query("COMMIT");

        res.status(200).json({ msg: "Cadastrado com Sucesso" });
    } catch (error: any) {
        // Em caso de erro, faz rollback da transação
        await pool.query("ROLLBACK");
        console.error("Erro no registro:", error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!", error: error.message });
    }
};

// --------------------------------------------------------------------------------- Registro para Admin
export const registerAController = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    if (!nome) {
        res.status(422).json({ msg: "O Nome é Obrigatório!" });
        return;
    }
    if (!email) {
        res.status(422).json({ msg: "O Email é Obrigatório!" });
        return;
    }
    if (!telefone) {
        res.status(422).json({ msg: "O Telefone é Obrigatório!" });
        return;
    }
    if (!senha) {
        res.status(422).json({ msg: "A Senha é Obrigatória!" });
        return;
    }
    if (senha !== confirmsenha) {
        res.status(422).json({ msg: "As Senhas não são Iguais!" });
        return;
    }

    try {
        // Verifica se o email já existe na tabela "pessoas"
        const [data]: any = await pool.query("SELECT email FROM pessoas WHERE email = ?", [email]);
        if (data.length > 0) {
            res.status(500).json({ msg: "Este email já está sendo usado!" });
            return;
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 8);

        // Inicia a transação
        await pool.query("START TRANSACTION");

        // Insere os dados na tabela "login"
        const [loginResult]: any = await pool.query(
            "INSERT INTO login (email, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Admin']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        const [pessoaResult] = await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
        );

        const id_pessoa = (pessoaResult as any).insertId;

        // Inserir na tabela admin
        await pool.query(
            "INSERT INTO admin (id_login, nome, email, telefone) VALUES (?, ?, ?, ?)",
            [id_login, nome, email, telefone]
        );

        // Confirma a transação
        await pool.query("COMMIT");

        res.status(200).json({ msg: "Cadastrado com Sucesso" });
    } catch (error: any) {
        // Em caso de erro, faz rollback da transação
        await pool.query("ROLLBACK");
        console.error("Erro no registro:", error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!", error: error.message });
    }
};

// --------------------------------------------------------------------------------- DELETE

export const deletePessoa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Buscar dados completos da pessoa, login e cliente
    const [pessoaResult]: any = await pool.query(
      `SELECT 
        p.id_pessoa, p.nome, p.email, p.telefone, p.senha, 
        l.id_login, l.tipo,
        c.id_cliente
      FROM pessoas p
      LEFT JOIN login l ON p.id_login = l.id_login
      LEFT JOIN cliente c ON p.id_pessoa = c.id_pessoa
      WHERE p.id_pessoa = ?`,
      [id]
    );

    if (pessoaResult.length === 0) {
      res.status(404).json({ error: "Pessoa não encontrada." });
      return;
    }

    const pessoa = pessoaResult[0];

    // Inserir na tabela excluidos
    await pool.query(
      `INSERT INTO excluidos 
        (id_login, id_cliente, id_pessoa, nome, email, telefone, senha, tipo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pessoa.id_login,
        pessoa.id_cliente,
        pessoa.id_pessoa,
        pessoa.nome,
        pessoa.email,
        pessoa.telefone,
        pessoa.senha,
        pessoa.tipo,
      ]
    );

    // Excluir de tabelas dependentes primeiro
    await pool.query("DELETE FROM cliente WHERE id_pessoa = ?", [id]);
    await pool.query("DELETE FROM login WHERE id_login = ?", [pessoa.id_login]);
    await pool.query("DELETE FROM pessoas WHERE id_pessoa = ?", [id]);

    res.status(200).json({ message: "Pessoa excluída com sucesso e registrada em 'excluidos'." });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir pessoa." });
  }
};

// --------------------------------------------------------------------------------- UPDATE

export const updatePessoa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone) {
    res.status(400).json({ error: 'Os campos [Nome], [Email] e [Telefone] são obrigatórios.' });
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


// --------------------------------------------------------------------------------- TABLES

export const getClientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const [rows]: any = await pool.query("SELECT cliente.*, pessoas.pontos FROM cliente JOIN pessoas ON (pessoas.id_pessoa = cliente.id_pessoa)");

      const formatted = rows.map((r: any) => ({
        id: r.id_pessoa,
        nome: r.nome,
        email: r.email,
        telefone: r.telefone,
        pontos: r.pontos,
      }));
      res.status(200).json(formatted);
    } catch (error: any) {
      console.error("Erro ao buscar Clientes:", error);
      res.status(500).json({ error: "Erro ao buscar Clientes" });
    }
  };

  export const getPessoas = async (req: Request, res: Response): Promise<void> => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM pessoas");

      const formatted = rows.map((r: any) => ({
        id: r.id_pessoa,
        nome: r.nome,
        email: r.email,
        telefone: r.telefone,
        pontos: r.pontos,
        status: r.status,
      }));
      res.status(200).json(formatted);
    } catch (error: any) {
      console.error("Erro ao buscar Pessoas:", error);
      res.status(500).json({ error: "Erro ao buscar Pessoas" });
    }
  };

// --------------------------------------------------------------------------------- PONTOS

  export const getPontos = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const [rows]: any = await pool.query(
        "SELECT pontos FROM pessoas WHERE id_pessoa = ?",
        [id]
      );
      if (rows.length === 0) {
        res.status(404).json({ msg: "Cliente não encontrado." });
        return;
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
      res.status(500).json({ msg: "Erro no servidor ao buscar dados do cliente." });
    }
  };