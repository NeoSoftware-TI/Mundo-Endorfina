import cors from 'cors';
import express from 'express';
import bodyParser from "body-parser";
import metasRoutes from './routes/routesMetas';
import loginRoutes from './routes/routesLogin';
import dashboardSubAdminRoutes from './routes/dashboardSubAdminRoutes';
import dashboardUsuarioRoutes from './routes/dashboardUsuarioRoutes';
import publicacoesRoutes from './routes/routesPublicacoes';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.get('/', (req, res) => {
    res.send('API funcionando corretamente!');
});

// Rotas
app.use('/metas', metasRoutes);
app.use('/subadmin', dashboardSubAdminRoutes);
app.use('/usuario', dashboardUsuarioRoutes);
app.use('/login', loginRoutes);
app.use('/publicacao', publicacoesRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));