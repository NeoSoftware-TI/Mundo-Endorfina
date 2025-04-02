"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarUsuario = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const autenticarUsuario = async (usuario, senha) => {
    const [rows] = await database_1.pool.query('SELECT * FROM login WHERE usuario = ?', [usuario]);
    if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }
    const user = rows[0];
    const senhaCorreta = await bcryptjs_1.default.compare(senha, user.senha);
    if (!senhaCorreta) {
        throw new Error('Senha inválida');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id_login, tipo: user.tipo }, 'seuSegredoJWT', { expiresIn: '2h' });
    return token;
};
exports.autenticarUsuario = autenticarUsuario;
