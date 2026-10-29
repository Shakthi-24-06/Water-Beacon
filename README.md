# 💧 Water Beacon — Smart Community RO Water Monitoring System

Water Beacon is a community-first water intelligence platform designed for rural and semi-urban Panchayats (specifically serving districts in Tamil Nadu). It provides real-time drinking water availability, automated tank volume telemetry, water purity (TDS) metrics, citizen issue reporting, and transparent maintenance tracking.

Residents can check their local RO plant status before leaving home, avoiding wasted trips and long queues in extreme weather.

---

## 🌟 Key Features

1. **Real-time RO Availability & Telemetry**:
   - Live status display (`WATER AVAILABLE`, `OUT OF WATER`, `UNDER MAINTENANCE`, `UNDER REPAIR`, `TEMPORARILY CLOSED`).
   - Dynamic animated water tank level gauge with graduated measurement marks.
   - Water quality metrics (TDS in PPM) and total plant capacity in liters.
   - Operating hours and Panchayat operator direct contact phone number.

2. **Smart Station Search & Autocomplete**:
   - Instant search bar with live auto-suggest dropdown across villages and districts.
   - Real-time animated telemetry counters for Total Stations, System Uptime %, Monitored Capacity (L), and Villages Covered.

3. **Stations Directory & Explorer**:
   - Searchable and filterable grid of all community RO plants across the district.
   - Filter chips: All Stations, Available, Under Maintenance, Out of Water.
   - Instant "View Live Monitor" station switcher.
   - Direct CSV Data Export (`/api/export/status-csv`) with complete station operational data.

4. **Maintenance & Repair Tracking**:
   - Public service logs detailing active and completed maintenance tickets.
   - Track sediment & carbon filter replacements, UV lamp servicing, and pump overhauls.
   - Filter tabs: All, Active / Open, Completed.
   - "Mark Resolved" one-click action that updates status, closes ticket, and restores the station to Available.

5. **Citizen Issue Reporting**:
   - Villagers can submit reports directly to the maintenance team for low pressure, strange water taste, dispenser tap leaks, or power failures.
   - Stored in the `community_reports` database table for tracking and resolution.

6. **Panchayat Operator Portal**:
   - Secure operator dialog allowing designated village operators to broadcast status changes, update water levels %, record TDS readings, and write remarks.
   - Full audit trail recorded in `machine_status_logs`.

7. **Bilingual Support (English & தமிழ்)**:
   - Full English and Tamil language localization with instantaneous switching.
   - Localized village terms, status descriptions, and interface elements.

8. **Clean, Modern, Accessible UI/UX**:
   - Fresh, bright interface with crisp typography and subtle water-blue and emerald accents.
   - 100% SVG vector icons (no emojis in UI).
   - Smooth CSS animations, skeleton loaders, and interactive toast notification system.
   - Full accessibility support with `@media (prefers-reduced-motion: reduce)`.

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
│   ├── index.html            # Main entry point and dynamic loader
│   ├── css/
│   │   ├── style.css         # Global design system, variables, modals, toasts
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

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
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
| `GET` | `/api/stats/overview` | Aggregated system metrics for counters & hero |
| `GET` | `/api/export/status-csv` | Download CSV status report for all stations |

---

## 🛡️ License
Built for public community welfare, municipal governance, and clean drinking water access in rural India.
