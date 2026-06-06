const { readData, writeData } = require('../utils/jsonDatabase');
const EmployeeCategory = require('../models/EmployeeCategory');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.employeeCategories || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee categories' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const item = (data.employeeCategories || []).find(e => e.id == req.params.id);
        if (!item) return res.status(404).json({ message: 'Employee Category not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee category' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = EmployeeCategory.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        if (!data.companies.find(c => c.id == req.body.company_id))
            return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

        if (!data.employeeCategories) data.employeeCategories = [];
        const newItem = new EmployeeCategory(req.body);
        data.employeeCategories.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create employee category' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.employeeCategories || []).findIndex(e => e.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Employee Category not found' });

        const updated = new EmployeeCategory({ ...data.employeeCategories[index], ...req.body, id: data.employeeCategories[index].id });
        data.employeeCategories[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update employee category' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.employeeCategories || []).findIndex(e => e.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Employee Category not found' });

        data.employeeCategories.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete employee category' });
    }
};
