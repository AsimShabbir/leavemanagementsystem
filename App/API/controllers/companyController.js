const { readData, writeData } = require('../utils/jsonDatabase');
const Company = require('../models/Company');

exports.getAll = (req, res) => {
    const data = readData();
    res.json(data.companies);
};

exports.getById = (req, res) => {
    const data = readData();
    const company = data.companies.find(c => c.id == req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
};

exports.create = (req, res) => {
    const error = Company.validate(req.body);
    if (error) return res.status(400).json({ error });

    const data = readData();
    const newCompany = new Company(req.body);
    data.companies.push(newCompany);
    writeData(data);
    res.status(201).json(newCompany);
};

exports.update = (req, res) => {
    const data = readData();
    const index = data.companies.findIndex(c => c.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Company not found' });

    const updated = new Company({ ...data.companies[index], ...req.body, id: data.companies[index].id });
    data.companies[index] = updated;
    writeData(data);
    res.json(updated);
};

exports.delete = (req, res) => {
    const data = readData();
    const index = data.companies.findIndex(c => c.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Company not found' });

    data.companies.splice(index, 1);
    writeData(data);
    res.status(204).send();
};
