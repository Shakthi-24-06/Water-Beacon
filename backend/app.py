import csv
import io
import os
import sys
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, Response

# Ensure backend directory is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from db import get_db_connection

BASE_DIR = os.path.dirname(CURRENT_DIR)
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

VALID_STATUSES = [
    "AVAILABLE",
    "OUT_OF_WATER",
    "UNDER_MAINTENANCE",
    "REPAIR",
    "TEMPORARILY_CLOSED"
]

@app.after_request
def add_security_and_cors_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# -------------------------------------------------------------
# Web Page Routes
# -------------------------------------------------------------

@app.route("/")
def home():
    """Public citizen/villager page"""
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/operator")
def operator_portal():
    """Dedicated Operator & Administrative Portal"""
    return send_from_directory(FRONTEND_DIR, "operator.html")

# -------------------------------------------------------------
# Operator Authentication API
# -------------------------------------------------------------

@app.route("/api/operator/login", methods=["POST"])
def operator_login():
    data = request.get_json(silent=True) or {}
    pin = data.get("pin", "").strip()
    expected_pin = os.environ.get("OPERATOR_PIN", "2026")

    village_id = data.get("village_id")
    village_name = data.get("village_name", "").strip()

    if pin == expected_pin:
        op_name = data.get("operator_name", "").strip() or "Panchayat Operator"
        return jsonify({
            "success": True,
            "message": "Operator authenticated successfully",
            "operator": {
                "name": op_name,
                "village_id": village_id,
                "village_name": village_name or "Village RO Station",
                "role": "Authorized Field Operator",
                "session_token": "wb_operator_session_2026"
            }
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": "Invalid Operator PIN. Please contact Panchayat administration."
        }), 401

# -------------------------------------------------------------
# Villages API
# -------------------------------------------------------------

@app.route("/api/villages")
def get_villages():
    connection = None
    cursor = None
    search = request.args.get("search", "").strip()

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                v.id,
                v.name,
                v.district,
                v.state,
                r.id AS machine_id,
                r.machine_name,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.last_updated
            FROM villages v
            LEFT JOIN ro_machines r ON v.id = r.village_id
        """
        params = []

        if search:
            query += " WHERE v.name LIKE %s OR v.district LIKE %s OR r.machine_name LIKE %s"
            wildcard = f"%{search}%"
            params.extend([wildcard, wildcard, wildcard])

        query += " ORDER BY v.name ASC"

        cursor.execute(query, tuple(params))
        villages = cursor.fetchall()

        for item in villages:
            if item.get("last_updated"):
                item["last_updated"] = item["last_updated"].isoformat()

        return jsonify(villages)

    except Exception as error:
        app.logger.error("Error in get_villages: %s", error)
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/villages/<int:village_id>/status")
def get_village_status(village_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                v.id AS village_id,
                v.name AS village_name,
                v.district,
                v.state,
                r.id AS machine_id,
                r.machine_name,
                r.location,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.operator_name,
                r.operator_phone,
                r.last_updated
            FROM villages v
            JOIN ro_machines r ON v.id = r.village_id
            WHERE v.id = %s
            LIMIT 1
        """, (village_id,))

        result = cursor.fetchone()

        if not result:
            return jsonify({
                "error": "Village or RO machine not found"
            }), 404

        if result.get("last_updated"):
            result["last_updated"] = result["last_updated"].isoformat()

        return jsonify(result)

    except Exception as error:
        app.logger.error("Error in get_village_status: %s", error)
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# -------------------------------------------------------------
# RO Machines API
# -------------------------------------------------------------

@app.route("/api/machines")
def get_machines():
    connection = None
    cursor = None
    status_filter = request.args.get("status", "").strip().upper()
    search = request.args.get("search", "").strip()

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                r.id,
                r.village_id,
                v.name AS village_name,
                v.district,
                v.state,
                r.machine_name,
                r.location,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.operator_name,
                r.operator_phone,
                r.last_updated
            FROM ro_machines r
            JOIN villages v ON r.village_id = v.id
            WHERE 1=1
        """
        params = []

        if status_filter and status_filter in VALID_STATUSES:
            query += " AND r.status = %s"
            params.append(status_filter)

        if search:
            query += " AND (v.name LIKE %s OR r.machine_name LIKE %s OR r.location LIKE %s OR v.district LIKE %s)"
            wildcard = f"%{search}%"
            params.extend([wildcard, wildcard, wildcard, wildcard])

        query += " ORDER BY r.status = 'AVAILABLE' DESC, v.name ASC"

        cursor.execute(query, tuple(params))
        machines = cursor.fetchall()

        for m in machines:
            if m.get("last_updated"):
                m["last_updated"] = m["last_updated"].isoformat()

        return jsonify(machines)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/machines/<int:machine_id>")
def get_machine(machine_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                r.id,
                r.village_id,
                v.name AS village_name,
                v.district,
                v.state,
                r.machine_name,
                r.location,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.operator_name,
                r.operator_phone,
                r.last_updated
            FROM ro_machines r
            JOIN villages v ON r.village_id = v.id
            WHERE r.id = %s
        """, (machine_id,))

        machine = cursor.fetchone()

        if not machine:
            return jsonify({"error": "RO machine not found"}), 404

        if machine.get("last_updated"):
            machine["last_updated"] = machine["last_updated"].isoformat()

        return jsonify(machine)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/machines/<int:machine_id>/status", methods=["POST"])
def update_machine_status(machine_id):
    connection = None
    cursor = None
    data = request.get_json(silent=True) or {}

    new_status = data.get("status", "").strip().upper()
    remarks = data.get("remarks", "").strip()
    updated_by = data.get("updated_by", "Local Operator").strip()
    water_level = data.get("water_level_pct")
    tds = data.get("tds_level")

    if new_status not in VALID_STATUSES:
        return jsonify({
            "error": f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        }), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT id, status, water_level_pct FROM ro_machines WHERE id = %s", (machine_id,))
        machine = cursor.fetchone()
        if not machine:
            return jsonify({"error": "Machine not found"}), 404

        if water_level is None:
            if new_status == "AVAILABLE":
                water_level = 90
            elif new_status == "OUT_OF_WATER":
                water_level = 0
            elif new_status in ["UNDER_MAINTENANCE", "REPAIR"]:
                water_level = 35
            else:
                water_level = 10
        else:
            try:
                water_level = max(0, min(100, int(water_level)))
            except (ValueError, TypeError):
                water_level = 50

        if tds is not None:
            try:
                tds = max(10, min(1000, int(tds)))
            except (ValueError, TypeError):
                tds = 110
            cursor.execute("""
                UPDATE ro_machines
                SET status = %s, water_level_pct = %s, tds_level = %s, last_updated = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (new_status, water_level, tds, machine_id))
        else:
            cursor.execute("""
                UPDATE ro_machines
                SET status = %s, water_level_pct = %s, last_updated = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (new_status, water_level, machine_id))

        cursor.execute("""
            INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
            VALUES (%s, %s, %s, %s)
        """, (machine_id, new_status, remarks or f"Status changed to {new_status}", updated_by))

        connection.commit()

        cursor.execute("""
            SELECT
                r.id,
                r.village_id,
                v.name AS village_name,
                r.machine_name,
                r.location,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.operator_name,
                r.operator_phone,
                r.last_updated
            FROM ro_machines r
            JOIN villages v ON r.village_id = v.id
            WHERE r.id = %s
        """, (machine_id,))
        updated = cursor.fetchone()

        if updated.get("last_updated"):
            updated["last_updated"] = updated["last_updated"].isoformat()

        return jsonify({
            "message": "Status updated successfully",
            "machine": updated
        }), 200

    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/machines/<int:machine_id>/logs")
def get_machine_logs(machine_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                l.id,
                l.machine_id,
                l.status,
                l.remarks,
                l.updated_by,
                l.created_at
            FROM machine_status_logs l
            WHERE l.machine_id = %s
            ORDER BY l.created_at DESC
            LIMIT 50
        """, (machine_id,))

        logs = cursor.fetchall()

        for log in logs:
            if log.get("created_at"):
                log["created_at"] = log["created_at"].isoformat()

        return jsonify(logs)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# -------------------------------------------------------------
# Maintenance Records API
# -------------------------------------------------------------

@app.route("/api/maintenance")
def get_maintenance_records():
    connection = None
    cursor = None
    status_filter = request.args.get("status", "").strip().upper()
    machine_id = request.args.get("machine_id")

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                m.id,
                m.machine_id,
                r.machine_name,
                v.id AS village_id,
                v.name AS village_name,
                v.district,
                m.issue_type,
                m.description,
                m.started_at,
                m.expected_end_at,
                m.completed_at,
                m.status,
                m.updated_by
            FROM maintenance_records m
            JOIN ro_machines r ON m.machine_id = r.id
            JOIN villages v ON r.village_id = v.id
            WHERE 1=1
        """
        params = []

        if status_filter in ["OPEN", "IN_PROGRESS", "COMPLETED"]:
            query += " AND m.status = %s"
            params.append(status_filter)

        if machine_id and machine_id.isdigit():
            query += " AND m.machine_id = %s"
            params.append(int(machine_id))

        query += " ORDER BY m.started_at DESC"

        cursor.execute(query, tuple(params))
        records = cursor.fetchall()

        for rec in records:
            for field in ["started_at", "expected_end_at", "completed_at"]:
                if rec.get(field):
                    rec[field] = rec[field].isoformat()

        return jsonify(records)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/maintenance", methods=["POST"])
def create_maintenance_record():
    connection = None
    cursor = None
    data = request.get_json(silent=True) or {}

    machine_id = data.get("machine_id")
    issue_type = data.get("issue_type", "").strip()
    description = data.get("description", "").strip()
    updated_by = data.get("updated_by", "Technician").strip()
    expected_end = data.get("expected_end_at")
    auto_update_machine = data.get("set_machine_maintenance", True)

    if not machine_id or not issue_type:
        return jsonify({"error": "machine_id and issue_type are required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO maintenance_records (machine_id, issue_type, description, expected_end_at, status, updated_by)
            VALUES (%s, %s, %s, %s, 'OPEN', %s)
        """, (machine_id, issue_type, description, expected_end, updated_by))

        record_id = cursor.lastrowid

        if auto_update_machine:
            cursor.execute("""
                UPDATE ro_machines
                SET status = 'UNDER_MAINTENANCE'
                WHERE id = %s
            """, (machine_id,))

            cursor.execute("""
                INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
                VALUES (%s, 'UNDER_MAINTENANCE', %s, %s)
            """, (machine_id, f"Maintenance logged: {issue_type}", updated_by))

        connection.commit()

        return jsonify({
            "message": "Maintenance record created",
            "record_id": record_id
        }), 201

    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/maintenance/<int:record_id>", methods=["PATCH"])
def update_maintenance_record(record_id):
    connection = None
    cursor = None
    data = request.get_json(silent=True) or {}

    new_status = data.get("status", "").strip().upper()
    if new_status not in ["OPEN", "IN_PROGRESS", "COMPLETED"]:
        return jsonify({"error": "Invalid status. Must be OPEN, IN_PROGRESS, or COMPLETED"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        completed_clause = ", completed_at = CURRENT_TIMESTAMP" if new_status == "COMPLETED" else ""

        cursor.execute(f"""
            UPDATE maintenance_records
            SET status = %s {completed_clause}
            WHERE id = %s
        """, (new_status, record_id))

        if new_status == "COMPLETED":
            cursor.execute("SELECT machine_id FROM maintenance_records WHERE id = %s", (record_id,))
            rec = cursor.fetchone()
            if rec:
                cursor.execute("""
                    UPDATE ro_machines
                    SET status = 'AVAILABLE', water_level_pct = 95
                    WHERE id = %s
                """, (rec["machine_id"],))

                cursor.execute("""
                    INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
                    VALUES (%s, 'AVAILABLE', 'Maintenance completed. Water restored to safe operation.', 'Service Technician')
                """, (rec["machine_id"],))

        connection.commit()

        return jsonify({"message": f"Maintenance record #{record_id} updated to {new_status}"}), 200

    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# -------------------------------------------------------------
# Community Citizen Reports API
# -------------------------------------------------------------

@app.route("/api/reports", methods=["GET", "POST"])
def handle_reports():
    connection = None
    cursor = None

    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        machine_id = data.get("machine_id")
        reporter_name = data.get("reporter_name", "").strip()
        reporter_phone = data.get("reporter_phone", "").strip()
        issue_type = data.get("issue_type", "").strip()
        description = data.get("description", "").strip()

        if not machine_id or not reporter_name or not reporter_phone or not issue_type:
            return jsonify({
                "error": "machine_id, reporter_name, reporter_phone, and issue_type are required"
            }), 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("""
                INSERT INTO community_reports (machine_id, reporter_name, reporter_phone, issue_type, description)
                VALUES (%s, %s, %s, %s, %s)
            """, (machine_id, reporter_name, reporter_phone, issue_type, description))

            report_id = cursor.lastrowid
            connection.commit()

            return jsonify({
                "message": "Report submitted successfully. Local Panchayat team has been notified.",
                "report_id": report_id
            }), 201

        except Exception as error:
            if connection:
                connection.rollback()
            return jsonify({"error": str(error)}), 500

        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()

    # GET
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                c.id,
                c.machine_id,
                r.machine_name,
                v.name AS village_name,
                c.reporter_name,
                c.reporter_phone,
                c.issue_type,
                c.description,
                c.status,
                c.created_at
            FROM community_reports c
            JOIN ro_machines r ON c.machine_id = r.id
            JOIN villages v ON r.village_id = v.id
            ORDER BY c.created_at DESC
            LIMIT 50
        """)

        reports = cursor.fetchall()
        for r in reports:
            if r.get("created_at"):
                r["created_at"] = r["created_at"].isoformat()

        return jsonify(reports)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/reports/<int:report_id>", methods=["PATCH"])
def update_report_status(report_id):
    connection = None
    cursor = None
    data = request.get_json(silent=True) or {}
    new_status = data.get("status", "").strip().upper()

    if new_status not in ["PENDING", "INVESTIGATING", "RESOLVED"]:
        return jsonify({"error": "Invalid status. Must be PENDING, INVESTIGATING, or RESOLVED"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("UPDATE community_reports SET status = %s WHERE id = %s", (new_status, report_id))
        connection.commit()

        return jsonify({"message": f"Report #{report_id} status updated to {new_status}"}), 200

    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# -------------------------------------------------------------
# System Stats & Overview
# -------------------------------------------------------------

@app.route("/api/stats/overview")
def get_stats_overview():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total FROM ro_machines")
        total_machines = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS available FROM ro_machines WHERE status = 'AVAILABLE'")
        available_machines = cursor.fetchone()["available"]

        cursor.execute("SELECT COUNT(*) AS maintenance FROM ro_machines WHERE status IN ('UNDER_MAINTENANCE', 'REPAIR')")
        maintenance_machines = cursor.fetchone()["maintenance"]

        cursor.execute("SELECT COUNT(*) AS out_of_water FROM ro_machines WHERE status = 'OUT_OF_WATER'")
        out_of_water = cursor.fetchone()["out_of_water"]

        cursor.execute("SELECT COALESCE(SUM(tank_capacity_liters), 0) AS total_capacity FROM ro_machines")
        total_capacity = cursor.fetchone()["total_capacity"]

        cursor.execute("SELECT COUNT(*) AS total_villages FROM villages")
        total_villages = cursor.fetchone()["total_villages"]

        cursor.execute("SELECT COUNT(*) AS total_reports FROM community_reports")
        total_reports = cursor.fetchone()["total_reports"]

        uptime_pct = round((available_machines / total_machines * 100), 1) if total_machines > 0 else 0

        return jsonify({
            "total_stations": total_machines,
            "available_stations": available_machines,
            "maintenance_stations": maintenance_machines,
            "out_of_water_stations": out_of_water,
            "total_capacity_liters": int(total_capacity),
            "villages_covered": total_villages,
            "community_reports_count": total_reports,
            "system_uptime_percent": uptime_pct
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# -------------------------------------------------------------
# Export CSV Report
# -------------------------------------------------------------

@app.route("/api/export/status-csv")
def export_status_csv():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                v.name AS village,
                v.district,
                r.machine_name,
                r.location,
                r.status,
                r.water_level_pct,
                r.tds_level,
                r.tank_capacity_liters,
                r.operator_name,
                r.operator_phone,
                r.last_updated
            FROM ro_machines r
            JOIN villages v ON r.village_id = v.id
            ORDER BY v.name ASC
        """)
        rows = cursor.fetchall()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Village",
            "District",
            "RO Machine Name",
            "Location",
            "Status",
            "Water Level (%)",
            "TDS (PPM)",
            "Tank Capacity (Liters)",
            "Operator Name",
            "Operator Phone",
            "Last Updated (UTC)"
        ])

        for r in rows:
            writer.writerow([
                r["village"],
                r["district"],
                r["machine_name"],
                r["location"] or "N/A",
                r["status"],
                r["water_level_pct"] or 0,
                r["tds_level"] or 0,
                r["tank_capacity_liters"] or 0,
                r["operator_name"] or "N/A",
                r["operator_phone"] or "N/A",
                r["last_updated"].strftime("%Y-%m-%d %H:%M:%S") if r.get("last_updated") else "N/A"
            ])

        csv_data = output.getvalue()
        output.close()

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"water_beacon_report_{timestamp}.csv"

        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
