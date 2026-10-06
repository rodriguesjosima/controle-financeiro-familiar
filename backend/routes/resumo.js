import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query;
    const db = getDatabase();
    let query = 'SELECT * FROM categorias WHERE 1 = 1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    query += ' ORDER BY nome';
    const categorias = await db.all(query, params);
    return res.json(categorias);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, tipo, cor, icone } = req.body;
    const db = getDatabase();

    if (!nome || !tipo) {
      return res.status(400).json({ erro: 'Nome e tipo da categoria são obrigatórios.' });
    }

    await db.run(
      'INSERT INTO categorias (nome, tipo, cor, icone) VALUES (?, ?, ?, ?)',
      [nome, tipo, cor || '#999', icone || '🧾']
    );

    return res.status(201).json({ mensagem: 'Categoria criada com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
