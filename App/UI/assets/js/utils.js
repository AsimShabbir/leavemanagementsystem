/* ══ Toast ══════════════════════════════════════════════ */
function showToast(message, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
    document.getElementById('toast-container').appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 3500);
}

/* ══ Loading skeleton ═══════════════════════════════════ */
function renderSkeleton(container, rows = 5, cols = 4) {
    container.innerHTML = `
      <div class="table-skeleton">
        ${Array(rows).fill(0).map(() => `
          <div class="skeleton-row">
            ${Array(cols).fill(0).map(() => `<div class="skeleton-cell"></div>`).join('')}
          </div>`).join('')}
      </div>`;
}

/* ══ Page header ════════════════════════════════════════ */
function renderPageHeader(container, title, subtitle, btnLabel, onAdd) {
    const hdr = document.createElement('div');
    hdr.className = 'page-header';
    hdr.innerHTML = `
      <div class="page-header-text">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <button class="btn btn-primary" id="btn-add-new">
        <span class="btn-icon">+</span> ${btnLabel}
      </button>`;
    container.appendChild(hdr);
    hdr.querySelector('#btn-add-new').addEventListener('click', onAdd);
}

/* ══ Search bar ═════════════════════════════════════════ */
function renderSearchBar(container, placeholder, onSearch) {
    const wrap = document.createElement('div');
    wrap.className = 'search-bar-wrap';
    wrap.innerHTML = `
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="tbl-search" placeholder="${placeholder}" autocomplete="off">
      </div>`;
    container.appendChild(wrap);
    wrap.querySelector('#tbl-search').addEventListener('input', e => onSearch(e.target.value));
}

/* ══ Data table ═════════════════════════════════════════ */
function renderTable(container, { columns, rows, onEdit, onDelete }) {
    const existing = container.querySelector('.table-wrap');
    if (existing) existing.remove();

    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';

    if (!rows.length) {
        wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">📂</div><p>No records found</p></div>`;
        container.appendChild(wrap);
        return;
    }

    const tbl = document.createElement('table');
    tbl.className = 'data-table';
    tbl.innerHTML = `
      <thead>
        <tr>${columns.map(c => `<th>${c.label}</th>`).join('')}<th class="col-actions">Actions</th></tr>
      </thead>
      <tbody>
        ${rows.map((row, i) => `
          <tr style="--i:${i}">
            ${columns.map(c => `<td>${c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>`).join('')}
            <td class="col-actions">
              <button class="btn-icon-action btn-edit" data-id="${row.id}" title="Edit">✏️</button>
              <button class="btn-icon-action btn-delete" data-id="${row.id}" title="Delete">🗑️</button>
            </td>
          </tr>`).join('')}
      </tbody>`;
    wrap.appendChild(tbl);
    container.appendChild(wrap);

    wrap.querySelectorAll('.btn-edit').forEach(btn =>
        btn.addEventListener('click', () => onEdit(rows.find(r => r.id == btn.dataset.id)))
    );
    wrap.querySelectorAll('.btn-delete').forEach(btn =>
        btn.addEventListener('click', () => onDelete(rows.find(r => r.id == btn.dataset.id)))
    );
}

/* ══ Modal ══════════════════════════════════════════════ */
function openModal({ title, bodyHTML, onSubmit, submitLabel = 'Save' }) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-submit').textContent = submitLabel;
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('open');

    const closeModal = () => overlay.classList.remove('open');
    document.getElementById('modal-close').onclick = closeModal;
    document.getElementById('modal-cancel').onclick = closeModal;
    overlay.onclick = e => { if (e.target === overlay) closeModal(); };

    document.getElementById('modal-submit').onclick = async () => {
        const btn = document.getElementById('modal-submit');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        try {
            await onSubmit();
            closeModal();
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = submitLabel;
        }
    };
}

/* ══ Confirm dialog ═════════════════════════════════════ */
function openConfirm({ message, onConfirm }) {
    document.getElementById('confirm-message').textContent = message;
    const overlay = document.getElementById('confirm-overlay');
    overlay.classList.add('open');

    const close = () => overlay.classList.remove('open');
    document.getElementById('confirm-cancel').onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };
    document.getElementById('confirm-ok').onclick = async () => {
        document.getElementById('confirm-ok').disabled = true;
        try { await onConfirm(); } finally {
            document.getElementById('confirm-ok').disabled = false;
            close();
        }
    };
}

/* ══ Field helpers ══════════════════════════════════════ */
function val(id)      { return document.getElementById(id)?.value.trim(); }
function checked(id)  { return document.getElementById(id)?.checked; }
function numVal(id)   { return parseFloat(document.getElementById(id)?.value) || 0; }

function badge(text, cls) {
    return `<span class="badge badge-${cls}">${text}</span>`;
}

function boolBadge(v, trueLabel = 'Yes', falseLabel = 'No') {
    return badge(v ? trueLabel : falseLabel, v ? 'success' : 'muted');
}
