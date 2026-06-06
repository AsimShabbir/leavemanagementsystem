class LeavePolicy {
    constructor(data) {
        this.id                        = data.id || Date.now();
        this.company_id                = data.company_id;
        this.leave_type_id             = data.leave_type_id;
        this.employee_category_id      = data.employee_category_id      || null;
        this.grade_id                  = data.grade_id                  || null;
        this.department_id             = data.department_id             || null;
        this.default_days              = data.default_days;
        this.max_days_per_year         = data.max_days_per_year         || null;
        this.max_consecutive_days      = data.max_consecutive_days      || null;
        this.min_notice_days           = data.min_notice_days;
        this.min_service_days          = data.min_service_days;
        this.allow_half_day            = data.allow_half_day            !== undefined ? data.allow_half_day : false;
        this.allow_negative_balance    = data.allow_negative_balance    !== undefined ? data.allow_negative_balance : false;
        this.negative_balance_limit    = data.negative_balance_limit    !== undefined ? data.negative_balance_limit : 0;
        this.is_carry_forward          = data.is_carry_forward          !== undefined ? data.is_carry_forward : false;
        this.carry_forward_limit       = data.carry_forward_limit       !== undefined ? data.carry_forward_limit : 0;
        this.carry_forward_expiry_days = data.carry_forward_expiry_days || null;
        this.is_encashable             = data.is_encashable             !== undefined ? data.is_encashable : false;
        this.encash_limit_days         = data.encash_limit_days         !== undefined ? data.encash_limit_days : 0;
        this.requires_document         = data.requires_document         !== undefined ? data.requires_document : false;
        this.document_required_after_days = data.document_required_after_days !== undefined ? data.document_required_after_days : 0;
        this.is_gender_specific        = data.is_gender_specific        !== undefined ? data.is_gender_specific : false;
        this.applicable_gender         = data.applicable_gender         || null;
        this.is_accrual                = data.is_accrual                !== undefined ? data.is_accrual : false;
        this.is_active                 = data.is_active                 !== undefined ? data.is_active : true;
    }

    static validate(data) {
        if (!data.company_id)        return 'company_id is required';
        if (!data.leave_type_id)     return 'leave_type_id is required';
        if (data.default_days === undefined || typeof data.default_days !== 'number')
                                     return 'default_days is required and must be a number';
        if (data.min_notice_days === undefined || typeof data.min_notice_days !== 'number')
                                     return 'min_notice_days is required and must be a number';
        if (data.min_service_days === undefined || typeof data.min_service_days !== 'number')
                                     return 'min_service_days is required and must be a number';
        if (typeof data.allow_half_day !== 'boolean')
                                     return 'allow_half_day is required and must be a boolean';
        if (typeof data.allow_negative_balance !== 'boolean')
                                     return 'allow_negative_balance is required and must be a boolean';
        if (typeof data.is_carry_forward !== 'boolean')
                                     return 'is_carry_forward is required and must be a boolean';
        if (typeof data.is_encashable !== 'boolean')
                                     return 'is_encashable is required and must be a boolean';
        if (typeof data.requires_document !== 'boolean')
                                     return 'requires_document is required and must be a boolean';
        if (typeof data.is_gender_specific !== 'boolean')
                                     return 'is_gender_specific is required and must be a boolean';
        if (data.is_gender_specific && !data.applicable_gender)
                                     return 'applicable_gender is required when is_gender_specific is true';
        if (typeof data.is_accrual !== 'boolean')
                                     return 'is_accrual is required and must be a boolean';
        if (typeof data.is_active !== 'boolean')
                                     return 'is_active is required and must be a boolean';
        return null;
    }
}

module.exports = LeavePolicy;
