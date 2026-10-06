const state = {
  usuarios: [],
  usuarioAtual: null,
  filtroMes: new Date().toISOString().slice(0, 7),
  categorias: []
};

const els = {
  usuarioSelect: document.getElementById('usuarioSelect'),
  mesFiltro: document.getElementById('mesFiltro'),
  receitasTotal: document.getElementById('receitasTotal'),
  despesasTotal: document.getElementById('despesasTotal'),
  pendentesTotal: document.getElementById('pendentesTotal'),
  saldoTotal: document.getElementById('saldoTotal'),
  categoriaList: document.getElementById('categoriaList'),
  resumoLista: document.getElementById('resumoLista'),
  lancamentosTable: document.getElementById('lancamentosTable'),
  recorrenciasList: document.getElementById('recorrenciasList'),
  usuariosList: document.getElementById('usuariosList'),
  categoriaSelect: document.getElementById('categoriaSelect'),
  categoriaRecorrencia: document.getElementById('categoriaRecorrencia'),
  modalUsuario: document.getElementById('modalUsuario'),
  novoNome: document.getElementById('novoNome'),
  novoEmail: document.getElementById('novoEmail'),
  novaSenha: document.getElementById('novaSenha')
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

function toMonthParts(value) {
  const [year, month] = value.split('-');
  return { year: Number(year), month: Number(month) };
}

function getCurrentMonthFilter() {
  if (!els.mesFiltro.value) {
    els.mesFiltro.value = state.filtroMes;
  }
  return els.mesFiltro.value;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    const errorMessage = contentType.includes('application/json')
      ? (await response.json()).erro || 'Erro ao processar a requisição.'
      : 'Erro ao processar a requisição.';
    throw new Error(errorMessage);
  }

  return contentType.includes('application/json') ? response.json() : response.text();
}

async function loadUsuarios() {
  try {
    const usuarios = await fetchJson('/api/usuarios');
    state.usuarios = usuarios;

    els.usuarioSelect.innerHTML = usuarios.map(
      (usuario) => `<option value="${usuario.id}">${usuario.nome}</option>`
    ).join('') || '<option value="">Nenhum usuário</option>';

    if (usuarios.length) {
      const selected = Number(localStorage.getItem('usuarioAtual') || usuarios[0].id);
      const usuarioAtivo = usuarios.find((u) => u.id === selected) || usuarios[0];
      state.usuarioAtual = usuarioAtivo.id;
      els.usuarioSelect.value = String(usuarioAtivo.id);
      localStorage.setItem('usuarioAtual', String(usuarioAtivo.id));
    } else {
      state.usuarioAtual = null;
      els.usuarioSelect.innerHTML = '<option value="">Nenhum usuário</option>';
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function loadCategorias() {
  try {
    const categorias = await fetchJson('/api/categorias');
    state.categorias = categorias;

    const options = categorias.map(
      (categoria) => `<option value="${categoria.id}">${categoria.icone || '🧾'} ${categoria.nome}</option>`
    ).join('');

    els.categoriaSelect.innerHTML = options;
    els.categoriaRecorrencia.innerHTML = options;
  } catch (error) {
    console.error(error);
  }
}

async function loadResumo() {
  if (!state.usuarioAtual) {
    els.receitasTotal.textContent = formatCurrency(0);
    els.despesasTotal.textContent = formatCurrency(0);
    els.pendentesTotal.textContent = formatCurrency(0);
    els.saldoTotal.textContent = formatCurrency(0);
    els.categoriaList.innerHTML = '<p>Nenhuma despesa registrada.</p>';
    els.resumoLista.innerHTML = '<li><strong>Receitas:</strong> R$ 0,00</li><li><strong>Despesas:</strong> R$ 0,00</li><li><strong>Pendentes:</strong> R$ 0,00</li><li><strong>Saldo:</strong> R$ 0,00</li>';
    return;
  }

  const { year, month } = toMonthParts(getCurrentMonthFilter());
  try {
    const dados = await fetchJson(`/api/resumo?usuario_id=${state.usuarioAtual}&mes=${month}&ano=${year}`);

    els.receitasTotal.textContent = formatCurrency(dados.receitas || 0);
    els.despesasTotal.textContent = formatCurrency(dados.despesas || 0);
    els.pendentesTotal.textContent = formatCurrency(dados.pendentes || 0);
    els.saldoTotal.textContent = formatCurrency(dados.saldo || 0);

    els.categoriaList.innerHTML = (dados.porCategoria || []).map((categoria) => `
      <div class="category-item">
        <div>
          <span>${categoria.icone || '🧾'} ${categoria.nome}</span>
        </div>
        <strong>${formatCurrency(categoria.total)}</strong>
      </div>
    `).join('') || '<p>Nenhuma despesa registrada.</p>';

    els.resumoLista.innerHTML = `
      <li><strong>Receitas:</strong> ${formatCurrency(dados.receitas || 0)}</li>
      <li><strong>Despesas:</strong> ${formatCurrency(dados.despesas || 0)}</li>
      <li><strong>Pendentes:</strong> ${formatCurrency(dados.pendentes || 0)}</li>
      <li><strong>Saldo:</strong> ${formatCurrency(dados.saldo || 0)}</li>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function loadLancamentos() {
  if (!state.usuarioAtual) {
    els.lancamentosTable.innerHTML = '<p>Cadastre um usuário para começar.</p>';
    return;
  }

  const { year, month } = toMonthParts(getCurrentMonthFilter());
  try {
    const lancamentos = await fetchJson(`/api/lancamentos?usuario_id=${state.usuarioAtual}&mes=${month}&ano=${year}`);

    const rows = (lancamentos || []).map((lancamento) => `
      <tr>
        <td>${lancamento.categoria_icone || '🧾'} ${lancamento.categoria}</td>
        <td>${lancamento.descricao}</td>
        <td>${lancamento.tipo === 'receita' ? 'Receita' : 'Despesa'}</td>
        <td>${formatCurrency(lancamento.valor)}</td>
        <td>${new Date(lancamento.data_lancamento).toLocaleDateString('pt-BR')}</td>
        <td><span class="badge ${lancamento.status}">${lancamento.status}</span></td>
        <td>
          <button class="status-btn" data-action="toggleStatus" data-id="${lancamento.id}">Marcar ${lancamento.status === 'pago' ? 'pendente' : 'pago'}</button>
          <button class="delete-btn" data-action="deleteLancamento" data-id="${lancamento.id}">Excluir</button>
        </td>
      </tr>
    `).join('');

    els.lancamentosTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="7">Nenhum lançamento encontrado.</td></tr>'}</tbody>
      </table>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function loadRecorrencias() {
  if (!state.usuarioAtual) {
    els.recorrenciasList.innerHTML = '<p>Cadastre um usuário para criar recorrências.</p>';
    return;
  }

  try {
    const recorrencias = await fetchJson(`/api/recorrencias?usuario_id=${state.usuarioAtual}&ativa=true`);

    els.recorrenciasList.innerHTML = (recorrencias || []).map((item) => `
      <div class="recorrencia-item">
        <div>
          <strong>${item.categoria_icone || '🧾'} ${item.descricao}</strong>
          <div>${item.frequencia} · ${formatCurrency(item.valor)}</div>
        </div>
        <button class="delete-btn" data-action="deleteRecorrencia" data-id="${item.id}">Excluir</button>
      </div>
    `).join('') || '<p>Nenhuma recorrência ativa.</p>';
  } catch (error) {
    console.error(error);
  }
}

async function loadUsuariosLista() {
  try {
    const usuarios = await fetchJson('/api/usuarios');
    els.usuariosList.innerHTML = usuarios.map((usuario) => `
      <div class="user-row">
        <strong>${usuario.nome}</strong>
        <span>${usuario.email}</span>
      </div>
    `).join('') || '<p>Nenhum usuário cadastrado.</p>';
  } catch (error) {
    console.error(error);
  }
}

async function criarUsuario(nome, email, senha) {
  const response = await fetchJson('/api/usuarios/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  return response;
}

async function createLancamento(formData) {
  const payload = {
    usuario_id: Number(state.usuarioAtual),
    categoria_id: Number(formData.get('categoria_id')),
    tipo: formData.get('tipo'),
    descricao: formData.get('descricao'),
    valor: Number(formData.get('valor')),
    data_lancamento: formData.get('data_lancamento'),
    status: formData.get('status'),
    notas: formData.get('notas')
  };

  return fetchJson('/api/lancamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function createRecorrencia(formData) {
  const payload = {
    usuario_id: Number(state.usuarioAtual),
    categoria_id: Number(formData.get('categoria_id')),
    tipo: formData.get('tipo'),
    descricao: formData.get('descricao'),
    valor: Number(formData.get('valor')),
    frequencia: formData.get('frequencia'),
    dia_mes: Number(formData.get('dia_mes')),
    data_inicio: formData.get('data_inicio'),
    ativa: true
  };

  return fetchJson('/api/recorrencias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function toggleLancamentoStatus(id) {
  const lista = await fetchJson(`/api/lancamentos?usuario_id=${state.usuarioAtual}`);
  const item = lista.find((entry) => Number(entry.id) === Number(id));

  if (!item) {
    return;
  }

  const proximoStatus = item.status === 'pago' ? 'pendente' : 'pago';

  await fetchJson(`/api/lancamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      descricao: item.descricao,
      valor: item.valor,
      status: proximoStatus,
      data_pagamento: proximoStatus === 'pago' ? item.data_lancamento : null,
      notas: item.notas || '',
      categoria_id: item.categoria_id,
      tipo: item.tipo
    })
  });
}

async function excluirLancamento(id) {
  await fetchJson(`/api/lancamentos/${id}`, { method: 'DELETE' });
}

async function excluirRecorrencia(id) {
  await fetchJson(`/api/recorrencias/${id}`, { method: 'DELETE' });
}

function bindTabs() {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });
}

async function refreshAll() {
  await loadUsuarios();
  await loadCategorias();
  await loadUsuariosLista();
  await loadResumo();
  await loadLancamentos();
  await loadRecorrencias();
}

async function init() {
  bindTabs();
  els.mesFiltro.value = state.filtroMes;

  await refreshAll();

  els.usuarioSelect.addEventListener('change', (event) => {
    state.usuarioAtual = Number(event.target.value);
    localStorage.setItem('usuarioAtual', String(state.usuarioAtual));
    refreshAll();
  });

  els.mesFiltro.addEventListener('change', () => {
    state.filtroMes = els.mesFiltro.value;
    refreshAll();
  });

  document.getElementById('formLancamento').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.usuarioAtual) {
      alert('Cadastre um usuário primeiro.');
      return;
    }

    const form = new FormData(event.target);
    await createLancamento(form);
    event.target.reset();
    refreshAll();
  });

  document.getElementById('formRecorrencia').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.usuarioAtual) {
      alert('Cadastre um usuário primeiro.');
      return;
    }

    const form = new FormData(event.target);
    await createRecorrencia(form);
    event.target.reset();
    refreshAll();
  });

  document.getElementById('registrarUsuarioBtn').addEventListener('click', async () => {
    const nome = els.novoNome.value.trim();
    const email = els.novoEmail.value.trim();
    const senha = els.novaSenha.value.trim();

    if (!nome || !email || !senha) {
      alert('Preencha nome, e-mail e senha.');
      return;
    }

    await criarUsuario(nome, email, senha);
    els.novoNome.value = '';
    els.novoEmail.value = '';
    els.novaSenha.value = '';
    await refreshAll();
  });

  document.getElementById('btnAddUsuario').addEventListener('click', () => {
    els.modalUsuario.classList.remove('hidden');
  });

  document.getElementById('cancelarUsuario').addEventListener('click', () => {
    els.modalUsuario.classList.add('hidden');
  });

  document.getElementById('confirmarUsuario').addEventListener('click', async () => {
    const nome = document.getElementById('modalNome').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const senha = document.getElementById('modalSenha').value.trim();

    if (!nome || !email || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    await criarUsuario(nome, email, senha);
    els.modalUsuario.classList.add('hidden');
    document.getElementById('modalNome').value = '';
    document.getElementById('modalEmail').value = '';
    document.getElementById('modalSenha').value = '';
    await refreshAll();
  });

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'toggleStatus') {
      await toggleLancamentoStatus(id);
      await refreshAll();
    }

    if (action === 'deleteLancamento') {
      await excluirLancamento(id);
      await refreshAll();
    }

    if (action === 'deleteRecorrencia') {
      await excluirRecorrencia(id);
      await refreshAll();
    }
  });
}

init();
