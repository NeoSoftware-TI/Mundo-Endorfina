import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

export const autenticarUsuario = async (usuario: string, senha: string): Promise<string> => {
    const [rows]: any = await pool.query(
        'SELECT * FROM login WHERE usuario = ?',
        [usuario]
    );

    if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }

    const user = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign(
        { id: user.id_login, tipo: user.tipo },
        'seuSegredoJWT',
        { expiresIn: '2h' }
    );

    return token;
};