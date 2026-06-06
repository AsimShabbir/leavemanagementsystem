/**
 * seed.js
 * Run with: node seed.js
 * Migrates data.json to Firebase Realtime Database
 */

const fs = require('fs');
const path = require('path');
const { writeData } = require('./App/API/utils/jsonDatabase');

const DATA_FILE = path.join(__dirname, 'data.json');

const migrateToFirebase = async () => {
    console.log('🔄 Reading local data.json...');
    let data;
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        data = JSON.parse(fileContent);
    } catch (err) {
        console.error('❌ Failed to read local data.json. Does it exist?', err);
        process.exit(1);
    }

    console.log('⏳ Uploading to Firebase Realtime Database...');
    try {
        await writeData(data);
        console.log('✅ Successfully migrated local data to Firebase!');
        console.log(`   → ${data.companies ? data.companies.length : 0} companies`);
        console.log(`   → ${data.leaveTypes ? data.leaveTypes.length : 0} leave types`);
        console.log(`   → ${data.employeeCategories ? data.employeeCategories.length : 0} employee categories`);
        console.log(`   → ${data.grades ? data.grades.length : 0} grades`);
        console.log(`   → ${data.departments ? data.departments.length : 0} departments`);
        console.log(`   → ${data.leavePolicies ? data.leavePolicies.length : 0} leave policies`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to upload to Firebase:', err);
        process.exit(1);
    }
};

migrateToFirebase();
