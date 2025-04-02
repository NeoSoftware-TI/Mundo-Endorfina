import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

export const autenticarUsuario = async (usuario: string, senha: string): Promise<string> => {
    const [rows]: any = await pool.query(
        'SELECT * FROM login WHERE usuario = ?',
        [usuario]
    );

    if (rows.length === 0) {
        throw new Error('Credenciais inválidas');
    }

    const user = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
        throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
        { id: user.id_login, tipo: user.tipo },
        process.env.JWT_SECRET || 'TiagomachadoDev',
        { expiresIn: '2h' }
    );

    return token;
};