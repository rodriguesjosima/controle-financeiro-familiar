import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '../data');
const dbPath = path.join(dbDir, 'financeiro.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

export async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
      cor TEXT,
      icone TEXT
    )
  `);

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

  const categoriasPadrao = [
    ['Alimentação', 'despesa', '#ff6b6b', '🍽️'],
    ['Moradia', 'despesa', '#4ecdc4', '🏠'],
    ['Saúde', 'despesa', '#45b7d1', '⚕️'],
    ['Transporte', 'despesa', '#f7a072', '🚗'],
    ['Educação', 'despesa', '#98d8c8', '📚'],
    ['Lazer', 'despesa', '#f4d35e', '🎉'],
    ['Utilidades', 'despesa', '#b892ff', '💡'],
    ['Salário', 'receita', '#52c41a', '💰'],
    ['Outras Receitas', 'receita', '#1890ff', '📈']
  ];

  for (const [nome, tipo, cor, icone] of categoriasPadrao) {
    await db.run(
      `INSERT OR IGNORE INTO categorias (nome, tipo, cor, icone) VALUES (?, ?, ?, ?)`,
      [nome, tipo, cor, icone]
    );
  }

  console.log('Banco de dados inicializado em:', dbPath);
  return db;
}

export function getDatabase() {
  return db;
}
