const fs = require('fs');
const path = require('path');

// data.json is at the project root (3 levels up from App/API/utils/)
const DATA_FILE = path.join(__dirname, '../../../data.json');

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return { companies: [], leaveTypes: [], employeeCategories: [], grades: [], departments: [], leavePolicies: [] };
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing data:', err);
    }
};

module.exports = { readData, writeData };
