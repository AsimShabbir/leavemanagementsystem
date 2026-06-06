router.register('companies', async (container) => {
    let data = [];

    const load = async () => {
        renderSkeleton(container);
        try {
            data = await api.get('/companies');
            render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const render = (query = '') => {
        container.innerHTML = '';
        renderPageHeader(container, 'Companies', 'Manage company records', 'Add Company', () => openForm());
        renderSearchBar(container, 'Search companies...', q => render(q));

        const filtered = data.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()));

        renderTable(container, {
            columns: [
                { key: 'name', label: 'Company Name' },
                { key: 'code', label: 'Code', render: v => badge(v, 'violet') },
                { key: 'created_at', label: 'Created', render: v => v ? new Date(v).toLocaleDateString() : '—' }
            ],
            rows: filtered,
            onEdit: openForm,
            onDelete: async (row) => {
                openConfirm({
                    message: `Delete company "${row.name}"? This cannot be undone.`,
                    onConfirm: async () => {
                        await api.delete(`/companies/${row.id}`);
                        showToast('Company deleted');
                        load();
                    }
                });
            }
        });
    };

    const openForm = (row = null) => {
        const html = `
            <div class="form-grid">
                <div class="form-group full">
                    <label class="form-label">Company Name <span class="req">*</span></label>
                    <input type="text" id="f-name" class="form-control" value="${row?.name || ''}" placeholder="e.g. Acme Corp">
                </div>
                <div class="form-group full">
                    <label class="form-label">Company Code <span class="req">*</span></label>
                    <input type="text" id="f-code" class="form-control" value="${row?.code || ''}" placeholder="e.g. ACME">
                </div>
            </div>`;

        openModal({
            title: row ? 'Edit Company' : 'New Company',
            bodyHTML: html,
            onSubmit: async () => {
                const payload = {
                    name: val('f-name'),
                    code: val('f-code')
                };
                if (row) {
                    await api.put(`/companies/${row.id}`, payload);
                    showToast('Company updated');
                } else {
                    await api.post('/companies', payload);
                    showToast('Company created');
                }
                load();
            }
        });
    };

    load();
});
