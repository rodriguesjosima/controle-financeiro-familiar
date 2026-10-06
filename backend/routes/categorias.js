import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes, data_inicio, data_fim, ativa } = req.body;
    const db = getDatabase();

    if (!usuario_id || !categoria_id || !tipo || !descricao || !valor || !frequencia || !data_inicio) {
      return res.status(400).json({ erro: 'Dados da recorrência incompletos.' });
    }

    await db.run(
      `INSERT INTO recorrencias (usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes, data_inicio, data_fim, ativa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, categoria_id, tipo, descricao, valor, frequencia, dia_mes || null, data_inicio, data_fim || null, ativa !== undefined ? ativa : 1]
    );

    return res.status(201).json({ mensagem: 'Recorrência criada com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { usuario_id, ativa } = req.query;
    const db = getDatabase();
    let query = `SELECT r.*, c.nome AS categoria, c.icone AS categoria_icone
                 FROM recorrencias r
                 JOIN categorias c ON r.categoria_id = c.id
                 WHERE 1 = 1`;
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
    return res.json(recorrencias);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, frequencia, dia_mes, data_fim, ativa } = req.body;
    const db = getDatabase();

    await db.run(
      `UPDATE recorrencias SET descricao = ?, valor = ?, frequencia = ?, dia_mes = ?, data_fim = ?, ativa = ? WHERE id = ?`,
      [descricao, valor, frequencia, dia_mes, data_fim || null, ativa, id]
    );

    return res.json({ mensagem: 'Recorrência atualizada com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    await db.run('DELETE FROM recorrencias WHERE id = ?', [id]);
    return res.json({ mensagem: 'Recorrência removida com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
