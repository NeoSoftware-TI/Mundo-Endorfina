"use client";

import axios from "axios";
import { toast } from "sonner";

  // Função para deletar uma pessoa
  export async function handleDelete(id: string) {
    console.log("ID para deletar:", id); // DEBUG
    if (!id) {
      toast.error("ID é obrigatório para deletar!");
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:3001/api/pessoasdelete/${id}`);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error("Erro ao deletar pessoa: " + error.response?.data.error);
    }
  }
  // Função para atualizar uma pessoa
  export async function handleUpdate(id: string, nome: string, email: string, telefone: string) {
    console.log("ID para atualizar:", id); // DEBUG
    if (!id) {
      toast.error("ID é obrigatório para atualizar!");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:3001/api/pessoasupdate/${id}`, {
        nome,
        email,
        telefone,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error("Erro ao atualizar pessoa: " + error.response?.data.error);
    }
  }

    // Função para deletar um cupom
    export async function handleDeletecupom(id: string) {
      console.log("ID para deletar:", id);
      if (!id) {
        toast.error("ID é obrigatório para deletar!");
        return;
      }
      try {
        const response = await axios.delete(`http://localhost:3001/cupom/cupomdelete/${id}`);
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error("Erro ao deletar cupom: " + error.response?.data.error);
      }
    }
    // Função para atualizar um cupom
    export async function handleUpdatecupom(id: string, titulo: string, marca: string, pontos: number, validade: string, resgates: number, disponivel: string) {
      console.log("ID para atualizar:", id);
      if (!id) {
        toast.error("ID é obrigatório para atualizar!");
        return;
      }
      try {
        const response = await axios.put(`http://localhost:3001/cupom/cupomupdate/${id}`, 
        {
          titulo,
          marca,
          pontos,
          validade,
          resgates,
          disponivel,
        });
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error("Erro ao atualizar cupom: " + error.response?.data.error);
      }
    }