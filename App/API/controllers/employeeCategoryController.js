const { readData, writeData } = require('../utils/jsonDatabase');
const EmployeeCategory = require('../models/EmployeeCategory');

exports.getAll = (req, res) => {
    const data = readData();
    res.json(data.employeeCategories || []);
};

exports.getById = (req, res) => {
    const data = readData();
    const item = (data.employeeCategories || []).find(e => e.id == req.params.id);
    if (!item) return res.status(404).json({ message: 'Employee Category not found' });
    res.json(item);
};

exports.create = (req, res) => {
    const error = EmployeeCategory.validate(req.body);
    if (error) return res.status(400).json({ error });

    const data = readData();
    if (!data.companies.find(c => c.id == req.body.company_id))
        return res.status(400).json({ error: 'Invalid company_id. Company does not exist.' });

    if (!data.employeeCategories) data.employeeCategories = [];
    const newItem = new EmployeeCategory(req.body);
    data.employeeCategories.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
};

exports.update = (req, res) => {
    const data = readData();
    const index = (data.employeeCategories || []).findIndex(e => e.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Employee Category not found' });

    const updated = new EmployeeCategory({ ...data.employeeCategories[index], ...req.body, id: data.employeeCategories[index].id });
    data.employeeCategories[index] = updated;
    writeData(data);
    res.json(updated);
};

exports.delete = (req, res) => {
    const data = readData();
    const index = (data.employeeCategories || []).findIndex(e => e.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Employee Category not found' });

    data.employeeCategories.splice(index, 1);
    writeData(data);
    res.status(204).send();
};
