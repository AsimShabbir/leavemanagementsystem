const { readData, writeData } = require('../utils/jsonDatabase');
const Grade = require('../models/Grade');

exports.getAll = (req, res) => {
    const data = readData();
    res.json(data.grades || []);
};

exports.getById = (req, res) => {
    const data = readData();
    const item = (data.grades || []).find(g => g.id == req.params.id);
    if (!item) return res.status(404).json({ message: 'Grade not found' });
    res.json(item);
};

exports.create = (req, res) => {
    const error = Grade.validate(req.body);
    if (error) return res.status(400).json({ error });

    const data = readData();
    if (!data.companies.find(c => c.id == req.body.company_id))
        return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

    if (!data.grades) data.grades = [];
    const newItem = new Grade(req.body);
    data.grades.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
};

exports.update = (req, res) => {
    const data = readData();
    const index = (data.grades || []).findIndex(g => g.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Grade not found' });

    const updated = new Grade({ ...data.grades[index], ...req.body, id: data.grades[index].id });
    data.grades[index] = updated;
    writeData(data);
    res.json(updated);
};

exports.delete = (req, res) => {
    const data = readData();
    const index = (data.grades || []).findIndex(g => g.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Grade not found' });

    data.grades.splice(index, 1);
    writeData(data);
    res.status(204).send();
};
