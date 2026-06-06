const { readData, writeData } = require('../utils/jsonDatabase');
const Department = require('../models/Department');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.departments || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const item = (data.departments || []).find(d => d.id == req.params.id);
        if (!item) return res.status(404).json({ message: 'Department not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch department' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = Department.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        if (!data.companies.find(c => c.id == req.body.company_id))
            return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

        if (!data.departments) data.departments = [];
        const newItem = new Department(req.body);
        data.departments.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create department' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.departments || []).findIndex(d => d.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Department not found' });

        const updated = new Department({ ...data.departments[index], ...req.body, id: data.departments[index].id });
        data.departments[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update department' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.departments || []).findIndex(d => d.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Department not found' });

        data.departments.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete department' });
    }
};
