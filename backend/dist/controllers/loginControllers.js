"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const authService_1 = require("../services/authService");
const loginController = async (req, res) => {
    const { usuario, senha } = req.body;
    try {
        const token = await (0, authService_1.autenticarUsuario)(usuario, senha);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }
};
exports.loginController = loginController;
