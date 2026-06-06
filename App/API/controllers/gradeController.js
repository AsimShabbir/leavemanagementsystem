const { readData, writeData } = require('../utils/jsonDatabase');
const Grade = require('../models/Grade');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.grades || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch grades' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const item = (data.grades || []).find(g => g.id == req.params.id);
        if (!item) return res.status(404).json({ message: 'Grade not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch grade' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = Grade.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        if (!data.companies.find(c => c.id == req.body.company_id))
            return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

        if (!data.grades) data.grades = [];
        const newItem = new Grade(req.body);
        data.grades.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create grade' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.grades || []).findIndex(g => g.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Grade not found' });

        const updated = new Grade({ ...data.grades[index], ...req.body, id: data.grades[index].id });
        data.grades[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update grade' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = (data.grades || []).findIndex(g => g.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Grade not found' });

        data.grades.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete grade' });
    }
};
