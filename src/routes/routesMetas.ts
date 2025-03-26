import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { verifyToken, isSubAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Criar Meta (Somente Sub-Admin)
router.post('/criar', verifyToken, isSubAdmin, async (req: Request, res: Response) => {
    const { descricao, pontos } = req.body;

    if (!descricao || !pontos) {
        return res.status(400).json({ error: 'Descrição e pontos são obrigatórios.' });
    }

    try {
        const [result]: any = await pool.query(
            'INSERT INTO metas (descricao, pontos, id_subadmin) VALUES (?, ?, ?)',
            [descricao, pontos, req.body.usuario.id]
        );

        res.status(201).json({ message: 'Meta criada com sucesso!', metaId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar meta.', details: error });
    }
});

// Listar todas as Metas
router.get('/listar', async (_req, res) => {
    try {
        const [metas]: any[] = await pool.query('SELECT * FROM metas');
        res.status(200).json(metas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar metas.', details: error });
    }
});

// Atribuir Pontos ao Usuário por Meta Concluída
router.post('/atribuir-pontos', verifyToken, isSubAdmin, async (req: Request, res: Response) => {
    const { id_usuario, id_meta } = req.body;

    if (!id_usuario || !id_meta) {
        return res.status(400).json({ error: 'ID do usuário e ID da meta são obrigatórios.' });
    }

    try {
        const [metaExistente]: any[] = await pool.query(
            'SELECT * FROM metas WHERE id_meta = ?', [id_meta]
        );

        if (!metaExistente.length) {
            return res.status(404).json({ error: 'Meta não encontrada.' });
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
router.put('/atualizar/:id', verifyToken, isSubAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descricao, pontos } = req.body;

    try {
        const [result]: any = await pool.query(
            'UPDATE metas SET descricao = ?, pontos = ? WHERE id_meta = ?',
            [descricao, pontos, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meta não encontrada.' });
        }

        res.status(200).json({ message: 'Meta atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar meta.', details: error });
    }
});

// Deletar Meta
router.delete('/deletar/:id', verifyToken, isSubAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [result]: any = await pool.query('DELETE FROM metas WHERE id_meta = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meta não encontrada.' });
        }

        res.status(200).json({ message: 'Meta deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar meta.', details: error });
    }
});

export default router;