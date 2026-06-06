const { readData, writeData } = require('../utils/jsonDatabase');
const Department = require('../models/Department');

exports.getAll = (req, res) => {
    const data = readData();
    res.json(data.departments || []);
};

exports.getById = (req, res) => {
    const data = readData();
    const item = (data.departments || []).find(d => d.id == req.params.id);
    if (!item) return res.status(404).json({ message: 'Department not found' });
    res.json(item);
};

exports.create = (req, res) => {
    const error = Department.validate(req.body);
    if (error) return res.status(400).json({ error });

    const data = readData();
    if (!data.companies.find(c => c.id == req.body.company_id))
        return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

    if (!data.departments) data.departments = [];
    const newItem = new Department(req.body);
    data.departments.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
};

exports.update = (req, res) => {
    const data = readData();
    const index = (data.departments || []).findIndex(d => d.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Department not found' });

    const updated = new Department({ ...data.departments[index], ...req.body, id: data.departments[index].id });
    data.departments[index] = updated;
    writeData(data);
    res.json(updated);
};

exports.delete = (req, res) => {
    const data = readData();
    const index = (data.departments || []).findIndex(d => d.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Department not found' });

    data.departments.splice(index, 1);
    writeData(data);
    res.status(204).send();
};
