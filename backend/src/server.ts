import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import postRoutes from './routes/routesPost';  
import loginRoutes from './routes/routesLogin';
import rankingRoutes from './routes/routesRanking';
import cuponsRoutes from './routes/routesCupons';

dotenv.config();
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
app.use('/cupom', cuponsRoutes);
app.use('/api', loginRoutes);
app.use('/rank', rankingRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));