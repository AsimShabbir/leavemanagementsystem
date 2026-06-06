class Company {
    constructor(data) {
        this.id = data.id || Date.now();
        this.name = data.name;
        this.code = data.code;
        this.created_at = data.created_at || new Date().toISOString();
    }

    static validate(data) {
        if (!data.name) return 'Name is required';
        if (!data.code) return 'Code is required';
        return null;
    }
}

module.exports = Company;
