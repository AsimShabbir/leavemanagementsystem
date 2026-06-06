class EmployeeCategory {
    constructor(data) {
        this.id          = data.id || Date.now();
        this.company_id  = data.company_id;
        this.name        = data.name;
        this.description = data.description || null;
        this.is_active   = data.is_active !== undefined ? data.is_active : true;
        this.created_at  = data.created_at || new Date().toISOString();
    }

    static validate(data) {
        if (!data.company_id) return 'company_id is required';
        if (!data.name)       return 'name is required';
        return null;
    }
}

module.exports = EmployeeCategory;
