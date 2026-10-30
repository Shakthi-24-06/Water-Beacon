"""Database migration and seed script for Smart RO Water System."""
import sys
import os
import mysql.connector
from werkzeug.security import generate_password_hash

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import DB_CONFIG

def migrate_and_seed():
    print("Connecting to database...")
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor(dictionary=True)

    print("Checking and adding enhanced columns to ro_machines...")
    enhanced_columns = [
        ("tds_level", "INT DEFAULT 110"),
        ("water_level_pct", "INT DEFAULT 85"),
        ("tank_capacity_liters", "INT DEFAULT 5000"),
        ("operator_name", "VARCHAR(100) DEFAULT 'Muthu K (Panchayat Operator)'"),
        ("operator_phone", "VARCHAR(50) DEFAULT '+91 94421 88200'"),
    ]

    for col, defn in enhanced_columns:
        cursor.execute("SHOW COLUMNS FROM ro_machines LIKE %s", (col,))
        if not cursor.fetchone():
            print(f"  Adding column {col}...")
            cursor.execute(f"ALTER TABLE ro_machines ADD COLUMN {col} {defn}")
            connection.commit()
        else:
            print(f"  Column {col} already exists.")

    print("Checking community_reports table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS community_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            machine_id INT NOT NULL,
            reporter_name VARCHAR(100) NOT NULL,
            reporter_phone VARCHAR(50) NOT NULL,
            issue_type VARCHAR(100) NOT NULL,
            description TEXT,
            status ENUM('PENDING', 'INVESTIGATING', 'RESOLVED') DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (machine_id) REFERENCES ro_machines(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)
    connection.commit()

    print("Checking users table for Admin and Operator roles...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role ENUM('ADMIN', 'OPERATOR') NOT NULL DEFAULT 'OPERATOR',
            phone VARCHAR(50) DEFAULT NULL,
            assigned_village_id INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_village_id) REFERENCES villages(id) ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)
    connection.commit()

    # Seed default Admin and Operator accounts
    default_users = [
        ("admin", generate_password_hash("Admin@2026"), "District Water Admin", "ADMIN", "+91 94420 10000", None),
        ("operator", generate_password_hash("Operator@2026"), "Muthu K (Panchayat Operator)", "OPERATOR", "+91 94421 88200", 1),
        ("selvam", generate_password_hash("Operator@2026"), "Selvam R", "OPERATOR", "+91 94422 11001", 2),
        ("murugan", generate_password_hash("Operator@2026"), "Murugan S", "OPERATOR", "+91 94423 22002", 3)
    ]

    for uname, p_hash, fname, role, phone, v_id in default_users:
        cursor.execute("SELECT id FROM users WHERE username = %s", (uname,))
        existing = cursor.fetchone()
        if not existing:
            cursor.execute("""
                INSERT INTO users (username, password_hash, full_name, role, phone, assigned_village_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (uname, p_hash, fname, role, phone, v_id))
            connection.commit()
            print(f"  Created user: {uname} ({role})")
        else:
            print(f"  User {uname} already exists.")

    # Seed additional villages if only 1 exists
    cursor.execute("SELECT COUNT(*) AS count FROM villages")
    village_count = cursor.fetchone()["count"]
    print(f"Current village count: {village_count}")

    if village_count <= 1:
        print("Seeding sample villages and RO machines in Thoothukudi / Tamil Nadu...")
        sample_villages = [
            ("Udangudi", "Thoothukudi", "Tamil Nadu", "Udangudi Central RO Unit", "Bazaar Street, Near Bus Stand", "AVAILABLE", 90, 115, 6000, "Selvam R", "+91 94422 11001"),
            ("Sathankulam", "Thoothukudi", "Tamil Nadu", "Sathankulam Community RO Plant", "Panchayat Office Complex", "UNDER_MAINTENANCE", 45, 140, 5000, "Murugan S", "+91 94423 22002"),
            ("Nazareth", "Thoothukudi", "Tamil Nadu", "Nazareth Model RO Station", "Near Railway Feeder Road", "AVAILABLE", 95, 105, 8000, "David Johnson", "+91 94424 33003"),
            ("Tiruchendur", "Thoothukudi", "Tamil Nadu", "Tiruchendur Pilgrim RO Center", "Temple Car Street West", "AVAILABLE", 80, 112, 10000, "Kannan V", "+91 94425 44004"),
            ("Kayalpattinam", "Thoothukudi", "Tamil Nadu", "Kayalpattinam RO Station 1", "Coastal Road Junction", "OUT_OF_WATER", 0, 160, 5000, "Ahmed Bilal", "+91 94426 55005"),
            ("Authoor", "Thoothukudi", "Tamil Nadu", "Authoor Betel Leaf RO Facility", "Main Market Area", "REPAIR", 25, 150, 4000, "Mariappan P", "+91 94427 66006"),
            ("Srivaikuntam", "Thoothukudi", "Tamil Nadu", "Srivaikuntam Riverbank RO Plant", "North Car Street", "AVAILABLE", 75, 118, 7000, "Suresh Kumar", "+91 94428 77007"),
        ]

        for v_name, district, state, m_name, loc, status, w_level, tds, cap, op_name, op_phone in sample_villages:
            cursor.execute("INSERT INTO villages (name, district, state) VALUES (%s, %s, %s)", (v_name, district, state))
            connection.commit()
            new_village_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO ro_machines (village_id, machine_name, location, status, water_level_pct, tds_level, tank_capacity_liters, operator_name, operator_phone)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (new_village_id, m_name, loc, status, w_level, tds, cap, op_name, op_phone))
            connection.commit()
            new_machine_id = cursor.lastrowid

            # Add status log
            cursor.execute("""
                INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
                VALUES (%s, %s, %s, %s)
            """, (new_machine_id, status, f"System initialized status to {status}", op_name))
            connection.commit()

        # Seed sample maintenance records
        cursor.execute("SELECT id, machine_name, status FROM ro_machines WHERE status IN ('UNDER_MAINTENANCE', 'REPAIR')")
        maint_machines = cursor.fetchall()
        for m in maint_machines:
            m_id = m["id"]
            issue = "Sediment & Carbon Filter Replacement" if m["status"] == "UNDER_MAINTENANCE" else "High-Pressure Booster Pump Overhaul"
            desc = "Routine quarterly multi-stage pre-filter replacement and UV sterilizer cleaning." if m["status"] == "UNDER_MAINTENANCE" else "Motor overheating detected. New capacitor and impeller replacement in progress."
            status = "IN_PROGRESS" if m["status"] == "UNDER_MAINTENANCE" else "OPEN"
            cursor.execute("""
                INSERT INTO maintenance_records (machine_id, issue_type, description, status, updated_by)
                VALUES (%s, %s, %s, %s, %s)
            """, (m_id, issue, desc, status, "District Water Technician"))
            connection.commit()

        # Seed initial status log for village 1 if empty
        cursor.execute("SELECT COUNT(*) AS count FROM machine_status_logs WHERE machine_id = 1")
        if cursor.fetchone()["count"] == 0:
            cursor.execute("""
                INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
                VALUES (1, 'AVAILABLE', 'Morning regular RO filtration cycle completed. Water tank full.', 'Muthu K (Panchayat Operator)')
            """)
            connection.commit()

        print("Sample data successfully seeded!")

    cursor.close()
    connection.close()
    print("Migration and seeding finished successfully.")

if __name__ == "__main__":
    migrate_and_seed()
