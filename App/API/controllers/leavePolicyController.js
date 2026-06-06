const { readData, writeData } = require('../utils/jsonDatabase');
const LeavePolicy = require('../models/LeavePolicy');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.leavePolicies || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave policies' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const item = (data.leavePolicies || []).find(p => p.id == req.params.id);
        if (!item) return res.status(404).json({ message: 'Leave Policy not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave policy' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = LeavePolicy.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        if (!data.companies.find(c => c.id == req.body.company_id))
            return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });
        if (!(data.leaveTypes || []).find(lt => lt.id == req.body.leave_type_id))
            return res.status(400).json({ error: 'Invalid leave_type_id. Leave Type does not exist.' });
        if (req.body.employee_category_id && !(data.employeeCategories || []).find(ec => ec.id == req.body.employee_category_id))
            return res.status(400).json({ error: 'Invalid employee_category_id. Employee Category does not exist.' });
        if (req.body.grade_id && !(data.grades || []).find(g => g.id == req.body.grade_id))
            return res.status(400).json({ error: 'Invalid grade_id. Grade does not exist.' });
        if (req.body.department_id && !(data.departments || []).find(d => d.id == req.body.department_id))
            return res.status(400).json({ error: 'Invalid department_id. Department does not exist.' });

        if (!data.leavePolicies) data.leavePolicies = [];
        const newItem = new LeavePolicy(req.body);
        data.leavePolicies.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create leave policy' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.leavePolicies || []).findIndex(p => p.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Leave Policy not found' });

        const updated = new LeavePolicy({ ...data.leavePolicies[index], ...req.body, id: data.leavePolicies[index].id });
        data.leavePolicies[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update leave policy' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.leavePolicies || []).findIndex(p => p.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Leave Policy not found' });

        data.leavePolicies.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete leave policy' });
    }
};
