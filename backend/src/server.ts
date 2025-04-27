import cors from 'cors';
import express, { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


import postRoutes from './routes/routesPost';
import loginRoutes from './routes/routesLogin';
import rankingRoutes from './routes/routesRanking';
import cuponsRoutes from './routes/routesCupons';
import meRoutes from "./routes/routeMe";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3002", 
    credentials: true,               
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/post', postRoutes);
app.use('/cupom', cuponsRoutes);
app.use('/api', loginRoutes);
app.use('/rank', rankingRoutes);
app.use('/check', meRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('API funcionando corretamente!');
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));