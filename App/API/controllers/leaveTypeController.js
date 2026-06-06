const { readData, writeData } = require('../utils/jsonDatabase');
const LeaveType = require('../models/LeaveType');

exports.getAll = (req, res) => {
    const data = readData();
    res.json(data.leaveTypes);
};

exports.getById = (req, res) => {
    const data = readData();
    const leaveType = data.leaveTypes.find(lt => lt.id == req.params.id);
    if (!leaveType) return res.status(404).json({ message: 'Leave Type not found' });
    res.json(leaveType);
};

exports.create = (req, res) => {
    const error = LeaveType.validate(req.body);
    if (error) return res.status(400).json({ error });

    const data = readData();
    if (!data.companies.find(c => c.id == req.body.Company_id))
        return res.status(400).json({ error: 'Invalid Company_id. Company does not exist.' });

    const newLeaveType = new LeaveType(req.body);
    data.leaveTypes.push(newLeaveType);
    writeData(data);
    res.status(201).json(newLeaveType);
};

exports.update = (req, res) => {
    const data = readData();
    const index = data.leaveTypes.findIndex(lt => lt.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Leave Type not found' });

    if (req.body.Company_id && !data.companies.find(c => c.id == req.body.Company_id))
        return res.status(400).json({ error: 'Invalid Company_id. Company does not exist.' });

    const updated = new LeaveType({ ...data.leaveTypes[index], ...req.body, id: data.leaveTypes[index].id });
    data.leaveTypes[index] = updated;
    writeData(data);
    res.json(updated);
};

exports.delete = (req, res) => {
    const data = readData();
    const index = data.leaveTypes.findIndex(lt => lt.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Leave Type not found' });

    data.leaveTypes.splice(index, 1);
    writeData(data);
    res.status(204).send();
};
