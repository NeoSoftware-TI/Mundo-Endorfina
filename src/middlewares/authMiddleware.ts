import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

interface CustomRequest extends Request {
    user?: { id: number; tipo: string };
}

// Verifica se o token é válido
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(403).json({ error: 'Token não fornecido.' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Token inválido.' });
            return;
        }

        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'tipo' in decoded) {
            req.user = decoded as { id: number; tipo: string };
            next();
        } else {
            res.status(403).json({ error: 'Formato do token inválido.' });
        }
    });
};

// Verifica se o usuário é Sub-Admin
export const isSubAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.tipo !== 'Sub-Admin') {
        res.status(403).json({ error: 'Acesso negado. Apenas Sub-Admins podem realizar essa ação.' });
        return;
    }
    next();
};
