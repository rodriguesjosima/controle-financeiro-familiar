import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';
import usuariosRouter from './routes/usuarios.js';
import lancamentosRouter from './routes/lancamentos.js';
import recorrenciasRouter from './routes/recorrencias.js';
import categoriasRouter from './routes/categorias.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
await initializeDatabase();

// Rotas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/lancamentos', lancamentosRouter);
app.use('/api/recorrencias', recorrenciasRouter);
app.use('/api/categorias', categoriasRouter);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
