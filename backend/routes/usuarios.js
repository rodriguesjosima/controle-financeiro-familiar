import express from 'express';
import { getDatabase } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

// Registrar usuário
router.post('/registrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const db = getDatabase();

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.run(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const db = getDatabase();

    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET, { expiresIn: '7d' });

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const usuarios = await db.all('SELECT id, nome, email, criado_em FROM usuarios WHERE ativo = 1');
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

export default router;
