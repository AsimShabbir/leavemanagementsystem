const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase if not already initialized
if (!admin.apps.length) {
    if (!process.env.FIREBASE_PROJECT_ID) {
        console.warn('⚠️ WARNING: Firebase environment variables not set. Ensure .env is configured.');
    }
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Handle newlines in the private key safely
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();
const ROOT_REF = '/hrms_data';

const readData = async () => {
    try {
        const snapshot = await db.ref(ROOT_REF).once('value');
        const data = snapshot.val();
        
        // Return default empty structure if null
        if (!data) {
            return { companies: [], leaveTypes: [], employeeCategories: [], grades: [], departments: [], leavePolicies: [] };
        }
        
        // Ensure all arrays exist (Firebase sometimes drops empty arrays)
        return {
            companies: data.companies || [],
            leaveTypes: data.leaveTypes || [],
            employeeCategories: data.employeeCategories || [],
            grades: data.grades || [],
            departments: data.departments || [],
            leavePolicies: data.leavePolicies || []
        };
    } catch (err) {
        console.error('Error reading from Firebase:', err);
        return { companies: [], leaveTypes: [], employeeCategories: [], grades: [], departments: [], leavePolicies: [] };
    }
};

const writeData = async (data) => {
    try {
        await db.ref(ROOT_REF).set(data);
    } catch (err) {
        console.error('Error writing to Firebase:', err);
        throw err; // Throw so controllers can handle failure
    }
};

module.exports = { readData, writeData };
