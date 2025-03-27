import express from 'express';
import { Response, NextFunction } from 'express';
import pool from '../config/database';
import { verifyToken, isSubAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

interface CustomRequest extends express.Request {
    user?: { id: number; tipo: string };
}

// Criar Meta (Somente Sub-Admin)
router.post('/criar', verifyToken, isSubAdmin, async (req: CustomRequest, res: Response): Promise<void> => {
    const { descricao, pontos } = req.body;

    if (!descricao || !pontos) {
        res.status(400).json({ error: 'Descrição e pontos são obrigatórios.' });
        return;
    }

    try {
        const [result]: any = await pool.query(
            'INSERT INTO metas (descricao, pontos, id_subadmin) VALUES (?, ?, ?)',
            [descricao, pontos, req.user?.id]
        );

        res.status(201).json({ message: 'Meta criada com sucesso!', metaId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar meta.', details: error });
    }
});

// Listar todas as Metas
router.get('/listar', async (_req, res): Promise<void> => {
    try {
        const [metas]: any[] = await pool.query('SELECT * FROM metas');
        res.status(200).json(metas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar metas.', details: error });
    }
});

// Atribuir Pontos ao Usuário por Meta Concluída
router.post('/atribuir-pontos', verifyToken, isSubAdmin, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id_usuario, id_meta } = req.body;

    if (!id_usuario || !id_meta) {
        res.status(400).json({ error: 'ID do usuário e ID da meta são obrigatórios.' });
        return;
    }

    try {
        const [metaExistente]: any[] = await pool.query(
            'SELECT * FROM metas WHERE id_meta = ?', [id_meta]
        );

        if (!metaExistente.length) {
            res.status(404).json({ error: 'Meta não encontrada.' });
            return;
        }

        await pool.query(
            'INSERT INTO pontos_usuarios (id_usuario, id_meta) VALUES (?, ?)',
            [id_usuario, id_meta]
        );

        res.status(200).json({ message: 'Pontos atribuídos com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atribuir pontos.', details: error });
    }
});

// Atualizar Meta
router.put('/atualizar/:id', verifyToken, isSubAdmin, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { descricao, pontos } = req.body;

    try {
        const [result]: any = await pool.query(
            'UPDATE metas SET descricao = ?, pontos = ? WHERE id_meta = ?',
            [descricao, pontos, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Meta não encontrada.' });
            return;
        }

        res.status(200).json({ message: 'Meta atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar meta.', details: error });
    }
});

// Deletar Meta
router.delete('/deletar/:id', verifyToken, isSubAdmin, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const [result]: any = await pool.query('DELETE FROM metas WHERE id_meta = ?', [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Meta não encontrada.' });
            return;
        }

        res.status(200).json({ message: 'Meta deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar meta.', details: error });
    }
});

export default router;
