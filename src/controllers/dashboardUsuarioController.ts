import { Response } from 'express';
import { CustomRequest } from '../types/customTypes';
import prisma from '../prismaClient';

// Dashboard do Usuário
export const dashboardUsuario = async (req: CustomRequest, res: Response) => {
    const { id } = req.user!;

    try {
        const usuario = await prisma.usuarios.findUnique({
            where: { id },
            include: {
                corridas: true,
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const dadosCorrida = usuario.corridas.map((corrida) => ({
            tempo: corrida.tempo,
            caloriasPerdidas: corrida.calorias,
            kmPercorridos: corrida.km,
            fotoCorrida: corrida.foto
        }));

        res.status(200).json(dadosCorrida);
    } catch (error) {
        
        res.status(500).json({ error: 'Erro ao buscar informações do dashboard.' });
    }
};