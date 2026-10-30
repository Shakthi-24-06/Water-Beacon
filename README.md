# 💧 Water Beacon — Smart Community RO Water Monitoring System

Water Beacon is a community-first water intelligence platform designed for rural and semi-urban Panchayats (specifically serving districts in Tamil Nadu). It provides real-time drinking water availability, automated tank volume telemetry, water purity (TDS) metrics, citizen issue reporting, and transparent maintenance tracking.

The platform cleanly separates the **Public Citizen Portal** from the **Panchayat Operator Console**, ensuring unauthorized users cannot alter plant status.

---

## 🌟 Key Features

### 👤 Public Citizen Portal (`/`)
1. **Real-time RO Availability & Telemetry**:
   - Live status display (`WATER AVAILABLE`, `OUT OF WATER`, `UNDER MAINTENANCE`, `UNDER REPAIR`, `TEMPORARILY CLOSED`).
   - Dynamic animated water tank level gauge with graduated measurement marks (0%, 25%, 50%, 75%, 100%).
   - Water quality metrics (TDS in PPM) and total plant capacity in liters.
   - Operating hours and Panchayat operator direct contact phone number with click-to-call.

2. **Smart Station Search & Autocomplete**:
   - Instant search bar with live debounced auto-suggest dropdown across villages and districts.
   - Real-time animated telemetry counters for Total Stations, System Uptime %, Monitored Capacity (L), and Villages Covered.

3. **Stations Directory & Explorer**:
   - Searchable and filterable grid of all community RO plants across the district.
   - Filter chips: All Stations, Available, Under Maintenance, Out of Water.
   - 1-Click "View Live Monitor" station switcher.
   - Direct CSV Data Export (`/api/export/status-csv`) with complete station operational data.

4. **Maintenance & Repair Tracking**:
   - Transparent public service logs showing active and resolved maintenance tickets.
   - Filter tabs: All Records, Active / Open, Completed.

5. **Citizen Issue Reporting**:
   - Villagers can submit reports directly to the maintenance team for low pressure, strange water taste, dispenser tap leaks, or power failures.
   - Stored in the `community_reports` database table for tracking and resolution.

6. **Bilingual Support (English & தமிழ்)**:
   - Full English and Tamil language localization with instantaneous switching without full page reloads.

---

### 🛡️ Dedicated Operator Portal (`/operator`)
- **Separated & Protected**: Public citizens do not see operator controls or status edit forms on the public site.
- **PIN Authentication**: Secure login gate (Demonstration PIN: `2026`).
- **Live Station Status Controller**: Set dispensing status, overhead tank water level % slider, TDS purity readings, and status remarks.
- **Citizen Report Management**: Review incoming reports and update status (`PENDING`, `INVESTIGATING`, `RESOLVED`).
- **Preventative Maintenance Scheduler**: Schedule filter changes, UV lamp replacements, and pump motor servicing.
- **Live Audit Trail**: Full log table tracking all historical status modifications and operator remarks.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.11, Flask 3.1, Werkzeug
- **Database**: MySQL 8.0+ (`smart_ro_water_system`) via `mysql-connector-python`
- **Frontend**: Modern Vanilla JavaScript (ES6+), Semantic HTML5, CSS3 Custom Properties
- **Architecture**: Modular partials and section components with dynamic loading and asynchronous REST API integration

---

## 📁 Project Structure

```
water/
├── backend/
│   ├── app.py                # Main Flask application and REST API routes
│   ├── config.py             # Database configuration
│   ├── db.py                 # MySQL database connection pool
│   ├── migrate.py            # Safe database migration and seeding utility
│   └── requirements.txt      # Python dependencies
├── database/
│   └── schema.sql            # Full MySQL database schema definition
├── frontend/
│   ├── index.html            # Public citizen portal entry point
│   ├── operator.html         # Dedicated operator & technician portal
│   ├── css/
│   │   ├── style.css         # Global design system, variables, modals, toasts
│   │   ├── operator.css      # Operator dashboard layout and styles
│   │   └── sections/         # Modular CSS per section
│   │       ├── navbar.css
│   │       ├── hero.css
│   │       ├── status.css
│   │       ├── stations.css
│   │       ├── maintenance.css
│   │       ├── how-it-works.css
│   │       ├── about.css
│   │       └── footer.css
│   ├── js/
│   │   ├── app.js            # App orchestrator, modal handlers, toasts
│   │   ├── operator.js       # Dedicated operator console logic & auth
│   │   ├── language.js       # English & Tamil translation dictionary
│   │   └── sections/         # Section-specific logic
│   │       ├── navbar.js
│   │       ├── hero.js
│   │       ├── status.js
│   │       ├── stations.js
│   │       └── maintenance.js
│   └── sections/             # Modular HTML partials
│       ├── navbar.html
│       ├── hero.html
│       ├── status.html
│       ├── stations.html
│       ├── maintenance.html
│       ├── how-it-works.html
│       ├── about.html
│       ├── footer.html
│       └── modals.html
├── tests/
│   └── test_suite.py         # Comprehensive unit & integration tests
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11+
- MySQL Server 8.0+ running on port 3306

### 2. Database Setup
Ensure the MySQL database `smart_ro_water_system` exists and credentials in `backend/config.py` match your local server. Run the migration script to configure tables and seed initial data:

```bash
python backend/migrate.py
```

### 3. Run the Backend Server
Start the Flask development server:

```bash
python backend/app.py
```

- Public Citizen View: `http://127.0.0.1:5000/`
- Operator Console: `http://127.0.0.1:5000/operator` 

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Public citizen/villager page |
| `GET` | `/operator` | Dedicated operator portal page |
| `POST` | `/api/operator/login` | Operator PIN authentication |
| `GET` | `/api/villages` | List all villages with machine status & summary |
| `GET` | `/api/villages/<id>/status` | Detailed live machine telemetry for a specific village |
| `GET` | `/api/machines` | Filterable list of all RO machines across districts |
| `GET` | `/api/machines/<id>` | Single machine details |
| `POST` | `/api/machines/<id>/status` | Update status, water level, TDS, and record audit log |
| `GET` | `/api/machines/<id>/logs` | Status change audit trail logs |
| `GET` | `/api/maintenance` | Filterable list of maintenance tickets |
| `POST` | `/api/maintenance` | Create a new maintenance ticket |
| `PATCH` | `/api/maintenance/<id>` | Update maintenance ticket status (mark COMPLETED) |
| `GET` | `/api/reports` | List community citizen reports |
| `POST` | `/api/reports` | Submit a citizen water issue report |
| `PATCH` | `/api/reports/<id>` | Operator updates report status (`INVESTIGATING`, `RESOLVED`) |
| `GET` | `/api/stats/overview` | Aggregated system metrics for counters & hero |
| `GET` | `/api/export/status-csv` | Download CSV status report for all stations |

---

## 🛡️ License
Built for public community welfare, municipal governance, and clean drinking water access in rural India.
