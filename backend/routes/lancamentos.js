import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'familia-financeira-secret';

router.post('/registrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const db = getDatabase();

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await db.run(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      usuario: { id: result.lastID, nome, email }
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const db = getDatabase();

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const usuarios = await db.all('SELECT id, nome, email FROM usuarios WHERE ativo = 1 ORDER BY nome');
    return res.json(usuarios);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
