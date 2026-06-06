const { readData, writeData } = require('../utils/jsonDatabase');
const Company = require('../models/Company');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.companies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const company = data.companies.find(c => c.id == req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch company' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = Company.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        const newCompany = new Company(req.body);
        data.companies.push(newCompany);
        await writeData(data);
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create company' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = data.companies.findIndex(c => c.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Company not found' });

        const updated = new Company({ ...data.companies[index], ...req.body, id: data.companies[index].id });
        data.companies[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update company' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = data.companies.findIndex(c => c.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Company not found' });

        data.companies.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete company' });
    }
};
