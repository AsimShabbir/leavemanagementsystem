# Leave Management System — REST API

A RESTful API for managing **Companies** and **Leave Types**, built with **Node.js + Express** using a local `data.json` file as the database. Fully supports CRUD operations.

---

## 📁 Project Structure

```
LeaveManagementSystem/
├── server.js                   # Entry point — Express app
├── seed.js                     # Seed script to populate sample data
├── data.json                   # Local JSON database
├── package.json
├── models/
│   ├── Company.js              # Company entity model
│   └── LeaveType.js            # LeaveType entity model
├── controllers/
│   ├── companyController.js    # CRUD logic for Company
│   └── leaveTypeController.js  # CRUD logic for LeaveType
├── routes/
│   ├── companyRoutes.js        # Route definitions for /api/companies
│   └── leaveTypeRoutes.js      # Route definitions for /api/leave-types
└── utils/
    └── jsonDatabase.js         # JSON read/write utility
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Seed sample data (optional but recommended)
```bash
npm run seed
# or: node seed.js
```

### 3. Start the server
```bash
# Production
npm start

# Development (auto-restart on file change)
npm run dev
```

Server runs at: **http://localhost:3000**

---

## 📦 Entities

### Company
| Field        | Type    | Required | Description                        |
|--------------|---------|----------|------------------------------------|
| `id`         | INT (auto) | —     | Auto-generated unique ID           |
| `name`       | String  | ✅       | Full company name                  |
| `code`       | String  | ✅       | Short unique identifier (e.g. ORG) |
| `created_at` | ISO Date | —       | Auto-generated timestamp           |

---

### LeaveType
| Field        | Type        | Nullable | Description                                              |
|--------------|-------------|----------|----------------------------------------------------------|
| `id`         | INT (auto)  | No       | Unique auto-generated primary key                        |
| `Company_id` | INT (FK)    | No       | FK to Company — multi-company support                    |
| `code`       | VARCHAR(20) | No       | Short identifier e.g. CL, SL, EL, ML (unique per org)   |
| `name`       | VARCHAR(100)| No       | Full display name e.g. Casual Leave, Sick Leave          |
| `description`| TEXT        | Yes      | Optional longer explanation for employee self-service    |
| `category`   | VARCHAR(50) | Yes      | casual / sick / earned / maternity / paternity / compensatory / unpaid |
| `sort_order` | INT         | No       | Controls display order in dropdowns (lower = first)      |
| `is_paid`    | BOOLEAN     | No       | TRUE = full salary paid; FALSE = payroll deducts         |
| `is_active`  | BOOLEAN     | No       | TRUE = available to apply; FALSE = hidden (no data loss) |

---

## 🌐 API Endpoints

### Companies — `/api/companies`

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/companies`      | Get all companies     |
| GET    | `/api/companies/:id`  | Get company by ID     |
| POST   | `/api/companies`      | Create a new company  |
| PUT    | `/api/companies/:id`  | Update company by ID  |
| DELETE | `/api/companies/:id`  | Delete company by ID  |

---

### Leave Types — `/api/leave-types`

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/api/leave-types`       | Get all leave types      |
| GET    | `/api/leave-types/:id`   | Get leave type by ID     |
| POST   | `/api/leave-types`       | Create a new leave type  |
| PUT    | `/api/leave-types/:id`   | Update leave type by ID  |
| DELETE | `/api/leave-types/:id`   | Delete leave type by ID  |

---

## 📋 Sample API Usage (cURL)

### Create a Company
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Magnic Digital Pvt. Ltd.",
    "code": "MAGNIC"
  }'
```

### Get All Companies
```bash
curl http://localhost:3000/api/companies
```

### Create a Leave Type
```bash
curl -X POST http://localhost:3000/api/leave-types \
  -H "Content-Type: application/json" \
  -d '{
    "Company_id": 1,
    "code": "CL",
    "name": "Casual Leave",
    "description": "Short-term personal leave for casual purposes.",
    "category": "casual",
    "sort_order": 1,
    "is_paid": true,
    "is_active": true
  }'
```

### Get All Leave Types
```bash
curl http://localhost:3000/api/leave-types
```

### Update a Leave Type
```bash
curl -X PUT http://localhost:3000/api/leave-types/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Casual Leave (Updated)",
    "is_active": false
  }'
```

### Delete a Leave Type
```bash
curl -X DELETE http://localhost:3000/api/leave-types/1
```

---

## ✅ Validation Rules

- `Company_id`, `code`, `name`, `sort_order`, `is_paid`, `is_active` are **required** when creating a LeaveType.
- `Company_id` is **validated** — creating a LeaveType with a non-existent company returns a `400` error.
- `is_paid` and `is_active` must be **booleans** (`true` / `false`).
- `sort_order` must be a **number**.
