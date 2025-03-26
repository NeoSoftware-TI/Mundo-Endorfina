"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';
// ---------------------- Middleware de Autenticação ----------------------
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Token não fornecido.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ Corrigido para armazenar em req.user
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
exports.verifyToken = verifyToken;
// ---------------------- Verifica se é Sub-Admin ----------------------
const isSubAdmin = (req, res, next) => {
    if (req.user?.tipo !== 'Sub-Admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas Sub-Admins podem realizar essa ação.' });
    }
    next();
};
exports.isSubAdmin = isSubAdmin;
