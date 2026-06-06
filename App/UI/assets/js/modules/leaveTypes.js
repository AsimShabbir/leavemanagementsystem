router.register('leave-types', async (container) => {
    let data = [];
    let companies = [];

    const load = async () => {
        renderSkeleton(container);
        try {
            [data, companies] = await Promise.all([
                api.get('/leave-types'),
                api.get('/companies')
            ]);
            render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const render = (query = '') => {
        container.innerHTML = '';
        renderPageHeader(container, 'Leave Types', 'Manage types of leave (Sick, Casual, etc.)', 'Add Leave Type', () => openForm());
        renderSearchBar(container, 'Search leave types...', q => render(q));

        const filtered = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.code.toLowerCase().includes(query.toLowerCase()));

        renderTable(container, {
            columns: [
                { key: 'name', label: 'Name' },
                { key: 'code', label: 'Code', render: v => badge(v, 'violet') },
                { key: 'category', label: 'Category', render: v => badge(v || 'none', 'info') },
                { key: 'Company_id', label: 'Company', render: id => companies.find(c => c.id == id)?.name || id },
                { key: 'is_paid', label: 'Paid?', render: v => boolBadge(v, 'Paid', 'Unpaid') },
                { key: 'is_active', label: 'Status', render: v => boolBadge(v, 'Active', 'Inactive') }
            ],
            rows: filtered,
            onEdit: openForm,
            onDelete: async (row) => {
                openConfirm({
                    message: `Delete leave type "${row.name}"?`,
                    onConfirm: async () => {
                        await api.delete(`/leave-types/${row.id}`);
                        showToast('Leave type deleted');
                        load();
                    }
                });
            }
        });
    };

    const openForm = (row = null) => {
        const html = `
            <div class="form-grid form-grid-2">
                <div class="form-group full">
                    <label class="form-label">Company <span class="req">*</span></label>
                    <select id="f-company" class="form-control">
                        ${companies.map(c => `<option value="${c.id}" ${row?.Company_id == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Code <span class="req">*</span></label>
                    <input type="text" id="f-code" class="form-control" value="${row?.code || ''}" placeholder="e.g. SL">
                </div>
                <div class="form-group">
                    <label class="form-label">Name <span class="req">*</span></label>
                    <input type="text" id="f-name" class="form-control" value="${row?.name || ''}" placeholder="e.g. Sick Leave">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" id="f-category" class="form-control" value="${row?.category || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Sort Order <span class="req">*</span></label>
                    <input type="number" id="f-sort" class="form-control" value="${row?.sort_order ?? 0}">
                </div>
                <div class="form-group full">
                    <label class="form-label">Description</label>
                    <input type="text" id="f-desc" class="form-control" value="${row?.description || ''}">
                </div>
                
                <div class="toggle-group full">
                    <div class="toggle-item">
                        <div class="toggle-label">Is Paid Leave?</div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="f-paid" ${row ? (row.is_paid ? 'checked' : '') : 'checked'}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="toggle-item">
                        <div class="toggle-label">Is Active?</div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="f-active" ${row ? (row.is_active ? 'checked' : '') : 'checked'}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>`;

        openModal({
            title: row ? 'Edit Leave Type' : 'New Leave Type',
            bodyHTML: html,
            onSubmit: async () => {
                const payload = {
                    Company_id: numVal('f-company'),
                    code: val('f-code'),
                    name: val('f-name'),
                    category: val('f-category'),
                    sort_order: numVal('f-sort'),
                    description: val('f-desc'),
                    is_paid: checked('f-paid'),
                    is_active: checked('f-active')
                };
                if (row) {
                    await api.put(`/leave-types/${row.id}`, payload);
                    showToast('Leave Type updated');
                } else {
                    await api.post('/leave-types', payload);
                    showToast('Leave Type created');
                }
                load();
            }
        });
    };

    load();
});
