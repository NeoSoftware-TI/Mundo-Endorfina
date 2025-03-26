import { Request, Response } from 'express';
import { autenticarUsuario } from '../services/authService';

export const loginController = async (req: Request, res: Response) => {
    const { usuario, senha } = req.body;

    try {
        const token = await autenticarUsuario(usuario, senha);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }
};