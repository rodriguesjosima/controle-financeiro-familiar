# Controle Financeiro Familiar

Aplicação web para controle de finanças da família com suporte para 2+ usuários.

## 🚀 Funcionalidades

- ✅ Cadastro de receitas e despesas
- ✅ Controle de pagamentos (pago/pendente)
- ✅ Lançamentos recorrentes para próximos meses
- ✅ Categorias pré-definidas
- ✅ Dashboard com resumo mensal
- ✅ Acesso para 2 usuários
- ✅ Banco de dados SQLite

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn

## 🔧 Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/rodriguesjosima/controle-financeiro-familiar.git
cd controle-financeiro-familiar
```

### 2. Instalar dependências
```bash
npm run install-all
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 4. Iniciar a aplicação
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── server.js
│   ├── database.js
│   └── routes/
│       ├── usuarios.js
│       ├── lancamentos.js
│       ├── recorrencias.js
│       └── categorias.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── data/
│   └── financeiro.db (criado após primeira execução)
└── package.json
```

## 🔌 API Endpoints

### Usuários
- `POST /api/usuarios/registrar` - Registrar novo usuário
- `POST /api/usuarios/login` - Fazer login
- `GET /api/usuarios` - Listar usuários

### Lançamentos
- `POST /api/lancamentos` - Criar lançamento
- `GET /api/lancamentos` - Listar lançamentos
- `PUT /api/lancamentos/:id` - Atualizar lançamento
- `DELETE /api/lancamentos/:id` - Deletar lançamento

### Recorrências
- `POST /api/recorrencias` - Criar recorrência
- `GET /api/recorrencias` - Listar recorrências
- `PUT /api/recorrencias/:id` - Atualizar recorrência
- `DELETE /api/recorrencias/:id` - Deletar recorrência

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria

## 💾 Banco de Dados

O banco SQLite é criado automaticamente na primeira execução em `data/financeiro.db`

### Tabelas
- **usuarios** - Dados dos usuários
- **lancamentos** - Receitas e despesas
- **recorrencias** - Lançamentos recorrentes
- **categorias** - Categorias de lançamentos

## 🚀 Deploy

### Vercel (Frontend + Backend)
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create seu-app-name
git push heroku main
```

## 📝 Licença

MIT
