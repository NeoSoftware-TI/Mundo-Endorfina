import { Request, Response } from 'express';
import { autenticarUsuario } from '../services/authService';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

// --------------------------------------------------------------------------------- LOGIN
export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        return;
    }

    try {
        const token = await autenticarUsuario(email, senha);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ erro: 'Email ou senha inválidos.' });
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
            "INSERT INTO cliente (id_login, nome, email, telefone) VALUES (?, ?, ?, ?)",
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
      const [result]: any = await pool.query(
        "DELETE FROM pessoas WHERE id_pessoa = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Pessoa não encontrada." });
        return;
      }
  
      res.status(200).json({ message: "Pessoa deletada com sucesso!" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar pessoa." });
    }
  };

// --------------------------------------------------------------------------------- UPDATE

export const updatePessoa = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
  
    if (!nome || !email || !telefone) {
      res.status(400).json({ error: 'Os campos nome, email e telefone são obrigatórios.' });
      return;
    }
  
    try {
      const [result]: any = await pool.query(
        "UPDATE pessoas SET nome = ?, email = ?, telefone = ? WHERE id_pessoa = ?",
        [nome, email, telefone, id]
      );
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Pessoa não encontrada." });
        return;
      }
  
      res.status(200).json({ message: "Pessoa atualizada com sucesso!" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar pessoa." });
    }
  };

// --------------------------------------------------------------------------------- TABLES

export const getClientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM cliente");

      const formatted = rows.map((r: any) => ({
        id: r.id_cliente,
        nome: r.nome,
        email: r.email,
        telefone: r.telefone,
        pontos: r.pontos,
        status: r.status,
      }));
      res.status(200).json(formatted);
    } catch (error: any) {
      console.error("Erro ao buscar Clientes:", error);
      res.status(500).json({ error: "Erro ao buscar Clientes" });
    }
  };

  export const getSubadmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM sub_admin");

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
      console.error("Erro ao buscar Sub-admin:", error);
      res.status(500).json({ error: "Erro ao buscar Sub-admin" });
    }
  };

  export const getAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM admin");

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
      console.error("Erro ao buscar Admin:", error);
      res.status(500).json({ error: "Erro ao buscar Admin" });
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