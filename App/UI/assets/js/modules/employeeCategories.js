const buildStandardModule = (routePath, title, endpoint) => {
    router.register(routePath, async (container) => {
        let data = [];
        let companies = [];

        const load = async () => {
            renderSkeleton(container);
            try {
                [data, companies] = await Promise.all([
                    api.get(`/${endpoint}`),
                    api.get('/companies')
                ]);
                render();
            } catch (err) {
                showToast(err.message, 'error');
            }
        };

        const render = (query = '') => {
            container.innerHTML = '';
            renderPageHeader(container, title, `Manage ${title.toLowerCase()}`, `Add ${title.slice(0,-1)}`, () => openForm());
            renderSearchBar(container, `Search ${title.toLowerCase()}...`, q => render(q));

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
                        message: `Delete ${title.slice(0,-1).toLowerCase()} "${row.name}"?`,
                        onConfirm: async () => {
                            await api.delete(`/${endpoint}/${row.id}`);
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
                title: row ? `Edit ${title.slice(0,-1)}` : `New ${title.slice(0,-1)}`,
                bodyHTML: html,
                onSubmit: async () => {
                    const payload = {
                        company_id: numVal('f-company'),
                        name: val('f-name'),
                        description: val('f-desc'),
                        is_active: checked('f-active')
                    };
                    if (row) {
                        await api.put(`/${endpoint}/${row.id}`, payload);
                    } else {
                        await api.post(`/${endpoint}`, payload);
                    }
                    showToast('Saved successfully');
                    load();
                }
            });
        };

        load();
    });
};

buildStandardModule('employee-categories', 'Employee Categories', 'employee-categories');
