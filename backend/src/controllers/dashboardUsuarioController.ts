import { Response } from 'express';
import { CustomRequest } from '../types/customTypes';
import prisma from '../prismaClient';
import { Corrida } from '@prisma/client';

// Dashboard do Usuário
export const dashboardUsuario = async (req: CustomRequest, res: Response) => {
    // Obtém o id do usuário autenticado
    const { id } = req.user!;

    try {
        // Usa o modelo correto "usuario" (singular) para a consulta
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            include: {
                corridas: true,
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Adiciona tipagem explícita para o parâmetro "corrida"
        const dadosCorrida = usuario.corridas.map((corrida: Corrida) => ({
            tempo: corrida.tempo,
            caloriasPerdidas: corrida.calorias,
            kmPercorridos: corrida.km,
            fotoCorrida: corrida.foto
        }));

        return res.status(200).json(dadosCorrida);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar informações do dashboard.' });
    }
};
