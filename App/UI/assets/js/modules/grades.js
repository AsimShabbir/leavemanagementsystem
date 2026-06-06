// Re-uses the buildStandardModule logic from employeeCategories, but since they are separate files we'll duplicate the logic or we can just copy it.
// Better yet, since we have the builder in utils or we could just write it out for grades.
router.register('grades', async (container) => {
    let data = [];
    let companies = [];

    const load = async () => {
        renderSkeleton(container);
        try {
            [data, companies] = await Promise.all([
                api.get('/grades'),
                api.get('/companies')
            ]);
            render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const render = (query = '') => {
        container.innerHTML = '';
        renderPageHeader(container, 'Grades', 'Manage employee grades', 'Add Grade', () => openForm());
        renderSearchBar(container, 'Search grades...', q => render(q));

        const filtered = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        renderTable(container, {
            columns: [
                { key: 'name', label: 'Name' },
                { key: 'description', label: 'Description' },
                { key: 'company_id', label: 'Company', render: id => companies.find(c => c.id == id)?.name || id },
                { key: 'is_active', label: 'Status', render: v => boolBadge(v, 'Active', 'Inactive') }
            ],
            rows: filtered,
            onEdit: openForm,
            onDelete: async (row) => {
                openConfirm({
                    message: `Delete grade "${row.name}"?`,
                    onConfirm: async () => {
                        await api.delete(`/grades/${row.id}`);
                        showToast('Deleted successfully');
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
                    <label class="form-label">Company <span class="req">*</span></label>
                    <select id="f-company" class="form-control">
                        ${companies.map(c => `<option value="${c.id}" ${row?.company_id == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group full">
                    <label class="form-label">Name <span class="req">*</span></label>
                    <input type="text" id="f-name" class="form-control" value="${row?.name || ''}">
                </div>
                <div class="form-group full">
                    <label class="form-label">Description</label>
                    <input type="text" id="f-desc" class="form-control" value="${row?.description || ''}">
                </div>
                <div class="toggle-group full">
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
            title: row ? 'Edit Grade' : 'New Grade',
            bodyHTML: html,
            onSubmit: async () => {
                const payload = {
                    company_id: numVal('f-company'),
                    name: val('f-name'),
                    description: val('f-desc'),
                    is_active: checked('f-active')
                };
                if (row) {
                    await api.put(`/grades/${row.id}`, payload);
                } else {
                    await api.post('/grades', payload);
                }
                showToast('Saved successfully');
                load();
            }
        });
    };

    load();
});
