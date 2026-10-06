:root {
  --bg: #f5f7fb;
  --panel: #ffffff;
  --primary: #2f6fed;
  --primary-dark: #1d4fc5;
  --success: #1cab7c;
  --danger: #ef4d4d;
  --warning: #f7b267;
  --text: #1b2430;
  --muted: #64748b;
  --line: #e2e8f0;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #eef5ff, #f7f9ff);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: #0f172a;
  color: white;
  padding: 24px 18px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 30px;
}

.brand-badge {
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.08);
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 24px;
}

.brand h1,
.brand small {
  margin: 0;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  border: 0;
  background: transparent;
  color: #dfeafc;
  text-align: left;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item.active,
.nav-item:hover {
  background: rgba(255,255,255,0.08);
}

.user-panel {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-panel label {
  color: #cbd5e1;
  font-size: 0.9rem;
}

.user-panel select,
.user-panel input,
.user-form-row input,
.modal-form input,
.form-card input,
.form-card select,
.form-card textarea,
.user-form-row select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
}

.content {
  flex: 1;
  padding: 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0;
  color: var(--muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}

.topbar h2 {
  margin: 4px 0 0;
  font-size: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.card {
  background: var(--panel);
  border-radius: 18px;
  padding: 18px;
  box-shadow: var(--shadow);
}

.summary-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary-card span {
  color: var(--muted);
  font-weight: 700;
}

.summary-card strong {
  font-size: clamp(1.3rem, 2vw, 2rem);
}

.summary-card.income strong {
  color: var(--success);
}

.summary-card.expense strong {
  color: var(--danger);
}

.summary-card.pending strong {
  color: var(--warning);
}

.summary-card.balance strong {
  color: var(--primary);
}

.charts-grid,
.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.category-list,
.simple-list,
.list-items,
.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item,
.user-row,
.recorrencia-item,
.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.category-item strong,
.user-row strong {
  display: inline-block;
  min-width: 100px;
}

.primary-btn,
.secondary-btn,
.delete-btn,
.status-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
}

.primary-btn {
  background: var(--primary);
  color: white;
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.secondary-btn {
  background: #edf2ff;
  color: var(--primary);
}

.delete-btn {
  background: #fff0f0;
  color: var(--danger);
}

.status-btn {
  background: #eafaf3;
  color: var(--success);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.grid.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-card,
.list-card,
.users-card {
  min-height: 300px;
}

.form-card form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
}

.table-wrapper table {
  width: 100%;
  border-collapse: collapse;
}

.table-wrapper th,
.table-wrapper td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge.pago {
  background: #eafaf3;
  color: var(--success);
}

.badge.pendente {
  background: #fff7e6;
  color: var(--warning);
}

.user-form-row {
  display: grid;
  grid-template-columns: 1.3fr 1.3fr 1fr auto;
  gap: 10px;
  margin-bottom: 20px;
}

.users-list {
  margin-top: 12px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.52);
  display: grid;
  place-items: center;
  z-index: 20;
}

.modal.hidden {
  display: none;
}

.modal-content {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

@media (max-width: 980px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .summary-grid,
  .charts-grid,
  .panel-grid,
  .grid.two-columns,
  .user-form-row {
    grid-template-columns: 1fr;
  }
}
