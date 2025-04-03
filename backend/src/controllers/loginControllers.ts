import { Request, Response } from 'express';
import { autenticarUsuario } from '../services/authService';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

// Login
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

// Registro para Cliente
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
            "INSERT INTO login (usuario, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Cliente']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
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

// Registro para Sub-Admin
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
            "INSERT INTO login (usuario, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Sub-Admin']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
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

// Registro para Admin
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
            "INSERT INTO login (usuario, senha, tipo) VALUES (?, ?, ?)",
            [email, senhaHash, 'Admin']
        );
        const id_login = loginResult.insertId;

        // Insere os dados na tabela "pessoas" vinculando o id_login
        await pool.query(
            "INSERT INTO pessoas SET ?",
            { nome, email, telefone, senha: senhaHash, id_login }
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