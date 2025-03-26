import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // bcryptjs é mais estável com TypeScript
import metasRoutes from './routes/routesMetas';
import loginRoutes from './routes/routesLogin';
import dashboardSubAdminRoutes from './routes/dashboardSubAdminRoutes';
import dashboardUsuarioRoutes from './routes/dashboardUsuarioRoutes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API funcionando corretamente!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// Rotas
app.use('/metas', metasRoutes);
app.use('/subadmin', dashboardSubAdminRoutes);
app.use('/usuario', dashboardUsuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));