import { Response } from 'express';
import { CustomRequest } from '../types/customTypes';
import prisma from '../src/prismaClient';

// Visualizar Metas Criadas
export const visualizarMetas = async (req: CustomRequest, res: Response) => {
    try {
        const metas = await prisma.metas.findMany();
        res.status(200).json(metas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar metas.' });
    }
};

// Verificar Cupons
export const verificarCupons = async (req: CustomRequest, res: Response) => {
    try {
        const cupons = await prisma.cupons.findMany();
        res.status(200).json(cupons);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cupons.' });
    }
};

// Histórico de Metas dos Usuários
export const historicoMetasUsuarios = async (req: CustomRequest, res: Response) => {
    try {
        const historico = await prisma.historicoMetas.findMany({
            include: { usuario: true }
        });
        res.status(200).json(historico);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico de metas.' });
    }
};

// Feed de Todos os Usuários
export const visualizarFeed = async (req: CustomRequest, res: Response) => {
    try {
        const feed = await prisma.postagens.findMany();
        res.status(200).json(feed);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feed de usuários.' });
    }
};