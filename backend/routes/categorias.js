import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Listar categorias
router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query;
    const db = getDatabase();
    let query = 'SELECT * FROM categorias WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    query += ' ORDER BY nome';

    const categorias = await db.all(query, params);
    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Criar categoria
router.post('/', async (req, res) => {
  try {
    const { nome, tipo, cor, icone } = req.body;
    const db = getDatabase();

    await db.run(
      'INSERT INTO categorias (nome, tipo, cor, icone) VALUES (?, ?, ?, ?)',
      [nome, tipo, cor, icone || null]
    );

    res.status(201).json({ mensagem: 'Categoria criada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

export default router;
