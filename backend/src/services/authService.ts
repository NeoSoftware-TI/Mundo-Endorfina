import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

export const autenticarUsuario = async (email: string, senha: string): Promise<string> => {
    // Realiza um JOIN entre as tabelas login e pessoas para verificar o e-mail
    const [rows]: any = await pool.query(
      `SELECT l.id_login, l.senha, l.tipo 
       FROM login l
       JOIN pessoas p ON l.id_login = p.id_login
       WHERE p.email = ?`,
      [email]
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