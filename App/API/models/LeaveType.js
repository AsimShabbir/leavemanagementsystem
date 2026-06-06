class LeaveType {
    constructor(data) {
        this.id = data.id || Date.now();
        this.Company_id = data.Company_id;
        this.code = data.code;
        this.name = data.name;
        this.description = data.description || null;
        this.category = data.category || null;
        this.sort_order = data.sort_order !== undefined ? data.sort_order : 0;
        this.is_paid = data.is_paid !== undefined ? data.is_paid : true;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
    }

    static validate(data) {
        if (!data.Company_id) return 'Company_id is required';
        if (!data.code) return 'code is required';
        if (!data.name) return 'name is required';
        if (data.sort_order === undefined || typeof data.sort_order !== 'number') return 'sort_order is required and must be a number';
        if (data.is_paid === undefined || typeof data.is_paid !== 'boolean') return 'is_paid is required and must be a boolean';
        if (data.is_active === undefined || typeof data.is_active !== 'boolean') return 'is_active is required and must be a boolean';
        return null;
    }
}

module.exports = LeaveType;
