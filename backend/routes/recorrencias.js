import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Criar recorrência
router.post('/', async (req, res) => {
  try {
    const { usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes, data_inicio, data_fim } = req.body;
    const db = getDatabase();

    await db.run(
      `INSERT INTO recorrencias (usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes, data_inicio, data_fim)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes, data_inicio, data_fim || null]
    );

    res.status(201).json({ mensagem: 'Recorrência criada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Listar recorrências
router.get('/', async (req, res) => {
  try {
    const { usuario_id, ativa } = req.query;
    const db = getDatabase();
    let query = 'SELECT r.*, c.nome as categoria FROM recorrencias r JOIN categorias c ON r.categoria_id = c.id WHERE 1=1';
    const params = [];

    if (usuario_id) {
      query += ' AND r.usuario_id = ?';
      params.push(usuario_id);
    }

    if (ativa !== undefined) {
      query += ' AND r.ativa = ?';
      params.push(ativa === 'true' ? 1 : 0);
    }

    query += ' ORDER BY r.data_inicio DESC';

    const recorrencias = await db.all(query, params);
    res.json(recorrencias);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Atualizar recorrência
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, frequencia, dia_mes, data_fim, ativa } = req.body;
    const db = getDatabase();

    await db.run(
      `UPDATE recorrencias SET descricao = ?, valor = ?, frequencia = ?, dia_mes = ?, data_fim = ?, ativa = ?
       WHERE id = ?`,
      [descricao, valor, frequencia, dia_mes, data_fim, ativa, id]
    );

    res.json({ mensagem: 'Recorrência atualizada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Deletar recorrência
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    await db.run('DELETE FROM recorrencias WHERE id = ?', [id]);
    res.json({ mensagem: 'Recorrência deletada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

export default router;
