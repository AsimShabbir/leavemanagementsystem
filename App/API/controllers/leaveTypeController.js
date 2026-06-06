const { readData, writeData } = require('../utils/jsonDatabase');
const LeaveType = require('../models/LeaveType');

exports.getAll = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.leaveTypes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave types' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await readData();
        const leaveType = data.leaveTypes.find(lt => lt.id == req.params.id);
        if (!leaveType) return res.status(404).json({ message: 'Leave Type not found' });
        res.json(leaveType);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave type' });
    }
};

exports.create = async (req, res) => {
    try {
        const error = LeaveType.validate(req.body);
        if (error) return res.status(400).json({ error });

        const data = await readData();
        if (!data.companies.find(c => c.id == req.body.Company_id))
            return res.status(400).json({ error: 'Invalid Company_id. Company does not exist.' });

        const newLeaveType = new LeaveType(req.body);
        data.leaveTypes.push(newLeaveType);
        await writeData(data);
        res.status(201).json(newLeaveType);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create leave type' });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await readData();
        const index = data.leaveTypes.findIndex(lt => lt.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Leave Type not found' });

        if (req.body.Company_id && !data.companies.find(c => c.id == req.body.Company_id))
            return res.status(400).json({ error: 'Invalid Company_id. Company does not exist.' });

        const updated = new LeaveType({ ...data.leaveTypes[index], ...req.body, id: data.leaveTypes[index].id });
        data.leaveTypes[index] = updated;
        await writeData(data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update leave type' });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await readData();
        const index = data.leaveTypes.findIndex(lt => lt.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Leave Type not found' });

        data.leaveTypes.splice(index, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete leave type' });
    }
};
