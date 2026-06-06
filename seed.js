/**
 * seed.js
 * Run with: node seed.js
 * Pre-populates data.json with sample Company and LeaveType records.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

const seedData = {
    companies: [
        {
            id: 1,
            name: "Magnic Digital Pvt. Ltd.",
            code: "MAGNIC",
            created_at: "2024-01-01T00:00:00.000Z"
        },
        {
            id: 2,
            name: "Tech Solutions Ltd.",
            code: "TECHSOL",
            created_at: "2024-01-01T00:00:00.000Z"
        }
    ],
    leaveTypes: [
        {
            id: 1,
            Company_id: 1,
            code: "CL",
            name: "Casual Leave",
            description: "Short-term personal leave for casual purposes.",
            category: "casual",
            sort_order: 1,
            is_paid: true,
            is_active: true
        },
        {
            id: 2,
            Company_id: 1,
            code: "SL",
            name: "Sick Leave",
            description: "Leave taken due to illness or medical reasons.",
            category: "sick",
            sort_order: 2,
            is_paid: true,
            is_active: true
        },
        {
            id: 3,
            Company_id: 1,
            code: "EL",
            name: "Earned Leave",
            description: "Leave earned based on days worked throughout the year.",
            category: "earned",
            sort_order: 3,
            is_paid: true,
            is_active: true
        },
        {
            id: 4,
            Company_id: 1,
            code: "ML",
            name: "Maternity Leave",
            description: "Leave granted to female employees on childbirth.",
            category: "maternity",
            sort_order: 4,
            is_paid: true,
            is_active: true
        },
        {
            id: 5,
            Company_id: 1,
            code: "UL",
            name: "Unpaid Leave",
            description: "Leave without pay when all paid leaves are exhausted.",
            category: "unpaid",
            sort_order: 5,
            is_paid: false,
            is_active: true
        },
        {
            id: 6,
            Company_id: 2,
            code: "CL",
            name: "Casual Leave",
            description: "Casual leave for Tech Solutions org (different rules than org 1).",
            category: "casual",
            sort_order: 1,
            is_paid: true,
            is_active: true
        }
    ]
};

fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2));
console.log('✅ data.json seeded successfully!');
console.log(`   → ${seedData.companies.length} companies`);
console.log(`   → ${seedData.leaveTypes.length} leave types`);
