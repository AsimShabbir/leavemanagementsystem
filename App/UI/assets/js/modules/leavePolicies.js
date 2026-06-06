router.register('leave-policies', async (container) => {
    let data = [], companies = [], leaveTypes = [], categories = [], grades = [], departments = [];

    const load = async () => {
        renderSkeleton(container);
        try {
            [data, companies, leaveTypes, categories, grades, departments] = await Promise.all([
                api.get('/leave-policies'),
                api.get('/companies'),
                api.get('/leave-types'),
                api.get('/employee-categories'),
                api.get('/grades'),
                api.get('/departments')
            ]);
            render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const render = (query = '') => {
        container.innerHTML = '';
        renderPageHeader(container, 'Leave Policies', 'Configure rules and limits for leave types', 'Add Policy', () => openForm());
        renderSearchBar(container, 'Search policies...', q => render(q));

        const filtered = data; // Could add complex filtering here if needed

        renderTable(container, {
            columns: [
                { key: 'company_id', label: 'Company', render: id => companies.find(c => c.id == id)?.name || id },
                { key: 'leave_type_id', label: 'Leave Type', render: id => leaveTypes.find(lt => lt.id == id)?.name || id },
                { key: 'default_days', label: 'Days' },
                { key: 'employee_category_id', label: 'Category', render: id => id ? (categories.find(c => c.id == id)?.name || id) : 'All' },
                { key: 'is_active', label: 'Status', render: v => boolBadge(v, 'Active', 'Inactive') }
            ],
            rows: filtered,
            onEdit: openForm,
            onDelete: async (row) => {
                openConfirm({
                    message: `Delete this leave policy?`,
                    onConfirm: async () => {
                        await api.delete(`/leave-policies/${row.id}`);
                        showToast('Policy deleted');
                        load();
                    }
                });
            }
        });
    };

    const openForm = (row = null) => {
        const buildSelect = (id, options, selected, nullOption = 'None') => `
            <select id="${id}" class="form-control">
                ${nullOption ? `<option value="">-- ${nullOption} --</option>` : ''}
                ${options.map(o => `<option value="${o.id}" ${selected == o.id ? 'selected' : ''}>${o.name}</option>`).join('')}
            </select>
        `;

        const buildToggle = (id, label, isChecked) => `
            <div class="toggle-item">
                <div class="toggle-label">${label}</div>
                <label class="toggle-switch">
                    <input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;

        const html = `
            <div class="form-grid form-grid-2">
                <div class="form-section-label">Targeting</div>
                <div class="form-group">
                    <label class="form-label">Company <span class="req">*</span></label>
                    ${buildSelect('f-company', companies, row?.company_id, null)}
                </div>
                <div class="form-group">
                    <label class="form-label">Leave Type <span class="req">*</span></label>
                    ${buildSelect('f-lt', leaveTypes, row?.leave_type_id, null)}
                </div>
                <div class="form-group">
                    <label class="form-label">Employee Category</label>
                    ${buildSelect('f-cat', categories, row?.employee_category_id, 'All Categories')}
                </div>
                <div class="form-group">
                    <label class="form-label">Grade</label>
                    ${buildSelect('f-grade', grades, row?.grade_id, 'All Grades')}
                </div>
                <div class="form-group">
                    <label class="form-label">Department</label>
                    ${buildSelect('f-dept', departments, row?.department_id, 'All Departments')}
                </div>

                <div class="form-section-label" style="margin-top: 10px;">Allowances</div>
                <div class="form-group">
                    <label class="form-label">Default Days <span class="req">*</span></label>
                    <input type="number" id="f-days" class="form-control" value="${row?.default_days ?? 0}">
                </div>
                <div class="form-group">
                    <label class="form-label">Max Days Per Year</label>
                    <input type="number" id="f-max-year" class="form-control" value="${row?.max_days_per_year ?? ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Max Consecutive Days</label>
                    <input type="number" id="f-max-cons" class="form-control" value="${row?.max_consecutive_days ?? ''}">
                </div>

                <div class="form-section-label" style="margin-top: 10px;">Rules</div>
                <div class="form-group">
                    <label class="form-label">Min Notice Days <span class="req">*</span></label>
                    <input type="number" id="f-notice" class="form-control" value="${row?.min_notice_days ?? 0}">
                </div>
                <div class="form-group">
                    <label class="form-label">Min Service Days <span class="req">*</span></label>
                    <input type="number" id="f-service" class="form-control" value="${row?.min_service_days ?? 0}">
                </div>

                <div class="toggle-group full" style="margin-top: 10px;">
                    ${buildToggle('f-half', 'Allow Half Day', row ? row.allow_half_day : false)}
                    ${buildToggle('f-neg', 'Allow Negative Balance', row ? row.allow_negative_balance : false)}
                    ${buildToggle('f-cf', 'Is Carry Forward', row ? row.is_carry_forward : false)}
                    ${buildToggle('f-encash', 'Is Encashable', row ? row.is_encashable : false)}
                    ${buildToggle('f-doc', 'Requires Document', row ? row.requires_document : false)}
                    ${buildToggle('f-gender', 'Is Gender Specific', row ? row.is_gender_specific : false)}
                    ${buildToggle('f-accrual', 'Is Accrual', row ? row.is_accrual : false)}
                    ${buildToggle('f-active', 'Is Active', row ? row.is_active : true)}
                </div>

                <div class="form-group full" id="div-gender" style="${row?.is_gender_specific ? '' : 'display:none;'}">
                    <label class="form-label">Applicable Gender</label>
                    <select id="f-app-gender" class="form-control">
                        <option value="male" ${row?.applicable_gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${row?.applicable_gender === 'female' ? 'selected' : ''}>Female</option>
                    </select>
                </div>
            </div>`;

        openModal({
            title: row ? 'Edit Leave Policy' : 'New Leave Policy',
            bodyHTML: html,
            onSubmit: async () => {
                const payload = {
                    company_id: numVal('f-company'),
                    leave_type_id: numVal('f-lt'),
                    employee_category_id: numVal('f-cat') || null,
                    grade_id: numVal('f-grade') || null,
                    department_id: numVal('f-dept') || null,
                    default_days: numVal('f-days'),
                    max_days_per_year: numVal('f-max-year') || null,
                    max_consecutive_days: numVal('f-max-cons') || null,
                    min_notice_days: numVal('f-notice'),
                    min_service_days: numVal('f-service'),
                    allow_half_day: checked('f-half'),
                    allow_negative_balance: checked('f-neg'),
                    is_carry_forward: checked('f-cf'),
                    is_encashable: checked('f-encash'),
                    requires_document: checked('f-doc'),
                    is_gender_specific: checked('f-gender'),
                    applicable_gender: checked('f-gender') ? val('f-app-gender') : null,
                    is_accrual: checked('f-accrual'),
                    is_active: checked('f-active')
                };
                
                if (row) {
                    await api.put(`/leave-policies/${row.id}`, payload);
                } else {
                    await api.post('/leave-policies', payload);
                }
                showToast('Saved successfully');
                load();
            }
        });

        // Toggle gender dropdown visibility
        document.getElementById('f-gender').addEventListener('change', (e) => {
            document.getElementById('div-gender').style.display = e.target.checked ? 'block' : 'none';
        });
    };

    load();
});
