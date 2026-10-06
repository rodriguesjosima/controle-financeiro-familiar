import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';
import usuariosRouter from './routes/usuarios.js';
import lancamentosRouter from './routes/lancamentos.js';
import recorrenciasRouter from './routes/recorrencias.js';
import categoriasRouter from './routes/categorias.js';
import resumoRouter from './routes/resumo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

await initializeDatabase();

app.use('/api/usuarios', usuariosRouter);
app.use('/api/lancamentos', lancamentosRouter);
app.use('/api/recorrencias', recorrenciasRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/resumo', resumoRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando' });
});

const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
