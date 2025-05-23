"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routesMetas_1 = __importDefault(require("./routes/routesMetas"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('API funcionando corretamente!');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
app.use('/metas', routesMetas_1.default);
