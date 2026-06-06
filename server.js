const express = require('express');
const cors    = require('cors');
const path    = require('path');

// ── Routes (from App/API/routes/) ───────────────────────
const companyRoutes          = require('./App/API/routes/companyRoutes');
const leaveTypeRoutes        = require('./App/API/routes/leaveTypeRoutes');
const employeeCategoryRoutes = require('./App/API/routes/employeeCategoryRoutes');
const gradeRoutes            = require('./App/API/routes/gradeRoutes');
const departmentRoutes       = require('./App/API/routes/departmentRoutes');
const leavePolicyRoutes      = require('./App/API/routes/leavePolicyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/ui', express.static(path.join(__dirname, 'App/UI')));

// ── Mount Routes ────────────────────────────────────────
app.use('/api/companies',           companyRoutes);
app.use('/api/leave-types',         leaveTypeRoutes);
app.use('/api/employee-categories', employeeCategoryRoutes);
app.use('/api/grades',              gradeRoutes);
app.use('/api/departments',         departmentRoutes);
app.use('/api/leave-policies',      leavePolicyRoutes);

// ── Root ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: 'Leave Management System API',
        version: '1.0.0',
        endpoints: [
            'GET/POST            /api/companies',
            'GET/PUT/DELETE      /api/companies/:id',
            'GET/POST            /api/leave-types',
            'GET/PUT/DELETE      /api/leave-types/:id',
            'GET/POST            /api/employee-categories',
            'GET/PUT/DELETE      /api/employee-categories/:id',
            'GET/POST            /api/grades',
            'GET/PUT/DELETE      /api/grades/:id',
            'GET/POST            /api/departments',
            'GET/PUT/DELETE      /api/departments/:id',
            'GET/POST            /api/leave-policies',
            'GET/PUT/DELETE      /api/leave-policies/:id',
        ]
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
