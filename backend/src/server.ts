import cors from 'cors';
import express from 'express';
import bodyParser from "body-parser";
import postRoutes from './routes/routesPost';  
import loginRoutes from './routes/routesLogin';
//import dashboardSubAdminRoutes from './routes/dashboardSubAdminRoutes';
//import dashboardUsuarioRoutes from './routes/dashboardUsuarioRoutes';
import publicacoesRoutes from './routes/routesPublicacoes';
//import permissaoRoutes from './routes/routesPermissao';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.get('/', (req, res) => {
    res.send('API funcionando corretamente!');
});

// Rotas
app.use('/post', postRoutes);
//app.use('/subadmin', dashboardSubAdminRoutes);
//app.use('/usuario', dashboardUsuarioRoutes);
app.use('/api', loginRoutes);
app.use('/publicacao', publicacoesRoutes);
//app.use('/permissao', permissaoRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));