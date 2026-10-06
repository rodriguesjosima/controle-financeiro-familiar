import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db;

export async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, '../data/financeiro.db'),
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

  // Tabela de Usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      ativo BOOLEAN DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Categorias
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
      cor TEXT,
      icone TEXT
    )
  `);

  // Tabela de Lançamentos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      categoria_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
      descricao TEXT NOT NULL,
      valor DECIMAL(10, 2) NOT NULL,
      data_lancamento DATE NOT NULL,
      data_pagamento DATE,
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'pago')),
      notas TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
  `);

  // Tabela de Recorrências
  await db.exec(`
    CREATE TABLE IF NOT EXISTS recorrencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      categoria_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
      descricao TEXT NOT NULL,
      valor DECIMAL(10, 2) NOT NULL,
      frequencia TEXT NOT NULL CHECK(frequencia IN ('diaria', 'semanal', 'mensal', 'trimestral', 'anual')),
      dia_mes INTEGER,
      data_inicio DATE NOT NULL,
      data_fim DATE,
      ativa BOOLEAN DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
  `);

  // Inserir categorias padrão
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Alimentação', 'despesa', '#FF6B6B']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Moradia', 'despesa', '#4ECDC4']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Saúde', 'despesa', '#45B7D1']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Transporte', 'despesa', '#FFA07A']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Educação', 'despesa', '#98D8C8']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Lazer', 'despesa', '#F7DC6F']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Utilidades', 'despesa', '#BB8FCE']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Salário', 'receita', '#52C41A']);
  await db.run('INSERT OR IGNORE INTO categorias (nome, tipo, cor) VALUES (?, ?, ?)', ['Outras Receitas', 'receita', '#1890FF']);

  console.log('Banco de dados inicializado com sucesso!');
  return db;
}

export function getDatabase() {
  return db;
}
