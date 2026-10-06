import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { usuario_id, categoria_id, tipo, descricao, valor, data_lancamento, status, notas } = req.body;
    const db = getDatabase();

    if (!usuario_id || !categoria_id || !tipo || !descricao || !valor || !data_lancamento) {
      return res.status(400).json({ erro: 'Dados obrigatórios faltando.' });
    }

    await db.run(
      `INSERT INTO lancamentos (usuario_id, categoria_id, tipo, descricao, valor, data_lancamento, status, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, categoria_id, tipo, descricao, valor, data_lancamento, status || 'pendente', notas || '']
    );

    return res.status(201).json({ mensagem: 'Lançamento criado com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { usuario_id, mes, ano, status } = req.query;
    const db = getDatabase();
    let query = `SELECT l.*, c.nome AS categoria, c.icone AS categoria_icone
                 FROM lancamentos l
                 JOIN categorias c ON l.categoria_id = c.id
                 WHERE 1 = 1`;
    const params = [];

    if (usuario_id) {
      query += ' AND l.usuario_id = ?';
      params.push(usuario_id);
    }

    if (mes && ano) {
      query += ' AND strftime(\'%m\', l.data_lancamento) = ? AND strftime(\'%Y\', l.data_lancamento) = ?';
      params.push(String(mes).padStart(2, '0'), String(ano));
    }

    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }

    query += ' ORDER BY l.data_lancamento DESC, l.id DESC';

    const lancamentos = await db.all(query, params);
    return res.json(lancamentos);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, status, data_pagamento, notas, categoria_id, tipo } = req.body;
    const db = getDatabase();

    await db.run(
      `UPDATE lancamentos
       SET descricao = ?, valor = ?, status = ?, data_pagamento = ?, notas = ?, categoria_id = ?, tipo = ?, atualizado_em = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [descricao, valor, status, data_pagamento || null, notas || '', categoria_id, tipo, id]
    );

    return res.json({ mensagem: 'Lançamento atualizado com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    await db.run('DELETE FROM lancamentos WHERE id = ?', [id]);
    return res.json({ mensagem: 'Lançamento removido com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
