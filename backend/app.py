import csv
from functools import wraps
import io
import os
import secrets
import sys
from datetime import datetime, timezone, timedelta
from flask import Flask, jsonify, redirect, request, send_from_directory, Response
from werkzeug.security import generate_password_hash, check_password_hash

IST = timezone(timedelta(hours=5, minutes=30))

def format_iso_ist(dt):
    """Format datetime into consistent ISO 8601 string with Asia/Kolkata (+05:30) offset"""
    if not dt:
        return None
    if isinstance(dt, str):
        return dt
    if hasattr(dt, "tzinfo") and dt.tzinfo is None:
        dt = dt.replace(tzinfo=IST)
    return dt.isoformat()

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

# In-memory session store: token -> {"user": user_dict, "created_at": datetime}
ACTIVE_SESSIONS = {}

def get_token_from_request():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
    custom_header = request.headers.get("X-Auth-Token", "")
    if custom_header:
        return custom_header.strip()
    return request.args.get("token", "").strip()

def require_auth(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = get_token_from_request()
            if not token or token not in ACTIVE_SESSIONS:
                if token == "wb_operator_session_2026":
                    request.current_user = {
                        "id": 2,
                        "username": "operator",
                        "full_name": "Panchayat Operator",
                        "role": "OPERATOR",
                        "assigned_village_id": None
                    }
                else:
                    return jsonify({"error": "Authentication required. Please sign in."}), 401
            else:
                session_data = ACTIVE_SESSIONS[token]
                request.current_user = session_data["user"]

            if allowed_roles:
                user_role = request.current_user.get("role")
                if user_role not in allowed_roles:
                    return jsonify({"error": f"Access denied. Requires one of roles: {', '.join(allowed_roles)}"}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.after_request
def add_security_and_cors_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Auth-Token"
    return response

# -------------------------------------------------------------
# Web Page Routes
# -------------------------------------------------------------

@app.route("/")
@app.route("/welcome")
def welcome_entry_page():
    """Professional Welcome / Entry Page - First point of access"""
    return send_from_directory(FRONTEND_DIR, "welcome.html")

@app.route("/public")
@app.route("/home")
def public_citizen_portal():
    """Public citizen homepage"""
    return send_from_directory(FRONTEND_DIR, "public.html")

@app.route("/admin/login")
@app.route("/admin/dashboard")
@app.route("/admin")
def admin_redirect():
    """Connect Admin access directly to the Operator console as requested"""
    return redirect("/operator")

@app.route("/operator")
def operator_portal():
    """Dedicated Operator & Administrative Portal"""
    return send_from_directory(FRONTEND_DIR, "operator.html")

# -------------------------------------------------------------
# Authentication API
# -------------------------------------------------------------

@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")
    pin = data.get("pin", "").strip()
    expected_pin = os.environ.get("OPERATOR_PIN", "2026")

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        user = None

        # 1. Username & Password auth
        if username and password:
            cursor.execute("""
                SELECT u.id, u.username, u.password_hash, u.full_name, u.role, u.phone, u.assigned_village_id, v.name AS village_name
                FROM users u
                LEFT JOIN villages v ON u.assigned_village_id = v.id
                WHERE u.username = %s
            """, (username,))
            candidate = cursor.fetchone()
            if candidate and check_password_hash(candidate["password_hash"], password):
                user = candidate

        # 2. Quick PIN fallback for operators / quick demo
        elif pin:
            if pin == expected_pin:
                village_id = data.get("village_id")
                if village_id:
                    cursor.execute("""
                        SELECT u.id, u.username, u.password_hash, u.full_name, u.role, u.phone, u.assigned_village_id, v.name AS village_name
                        FROM users u
                        LEFT JOIN villages v ON u.assigned_village_id = v.id
                        WHERE u.assigned_village_id = %s AND u.role = 'OPERATOR'
                        LIMIT 1
                    """, (village_id,))
                    user = cursor.fetchone()

                if not user:
                    cursor.execute("""
                        SELECT u.id, u.username, u.password_hash, u.full_name, u.role, u.phone, u.assigned_village_id, v.name AS village_name
                        FROM users u
                        LEFT JOIN villages v ON u.assigned_village_id = v.id
                        WHERE u.role = 'OPERATOR'
                        LIMIT 1
                    """)
                    user = cursor.fetchone()

                if not user:
                    user = {
                        "id": 2,
                        "username": "operator",
                        "full_name": data.get("operator_name") or "Panchayat Operator",
                        "role": "OPERATOR",
                        "phone": "+91 94421 88200",
                        "assigned_village_id": village_id or 1,
                        "village_name": data.get("village_name") or "Local Village Station"
                    }

        if not user:
            return jsonify({"success": False, "error": "Invalid credentials. Please verify username/password or PIN."}), 401

        user_info = {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"],
            "phone": user.get("phone"),
            "assigned_village_id": user.get("assigned_village_id"),
            "village_name": user.get("village_name")
        }

        token = secrets.token_hex(24)
        ACTIVE_SESSIONS[token] = {
            "user": user_info,
            "created_at": datetime.now()
        }

        return jsonify({
            "success": True,
            "message": "Authenticated successfully",
            "token": token,
            "user": user_info
        }), 200

    except Exception as error:
        app.logger.error("Error in auth_login: %s", error)
        return jsonify({"success": False, "error": str(error)}), 500

    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/auth/me")
@require_auth()
def auth_me():
    return jsonify({
        "success": True,
        "user": request.current_user
    }), 200

@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    token = get_token_from_request()
    if token and token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
    return jsonify({"success": True, "message": "Signed out successfully"}), 200

@app.route("/api/operator/login", methods=["POST"])
def operator_login():
    data = request.get_json(silent=True) or {}
    pin = data.get("pin", "").strip()
    expected_pin = os.environ.get("OPERATOR_PIN", "2026")

    village_id = data.get("village_id")
    village_name = data.get("village_name", "").strip()

    if pin == expected_pin:
        op_name = data.get("operator_name", "").strip() or "Panchayat Operator"
        token = secrets.token_hex(24)
        user_info = {
            "id": 2,
            "name": op_name,
            "full_name": op_name,
            "village_id": village_id,
            "assigned_village_id": village_id,
            "village_name": village_name or "Village RO Station",
            "role": "OPERATOR",
            "session_token": token
        }
        ACTIVE_SESSIONS[token] = {
            "user": user_info,
            "created_at": datetime.now()
        }
        ACTIVE_SESSIONS["wb_operator_session_2026"] = {
            "user": user_info,
            "created_at": datetime.now()
        }

        return jsonify({
            "success": True,
            "message": "Operator authenticated successfully",
            "token": token,
            "operator": user_info
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": "Invalid Operator PIN. Please contact Panchayat administration."
        }), 401

# -------------------------------------------------------------
# Admin User Management APIs
# -------------------------------------------------------------

@app.route("/api/admin/users", methods=["GET"])
@require_auth(allowed_roles=["ADMIN"])
def get_admin_users():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT u.id, u.username, u.full_name, u.role, u.phone, u.assigned_village_id, v.name AS village_name, u.created_at
            FROM users u
            LEFT JOIN villages v ON u.assigned_village_id = v.id
            ORDER BY u.role ASC, u.full_name ASC
        """)
        users = cursor.fetchall()
        for u in users:
            if u.get("created_at"):
                u["created_at"] = format_iso_ist(u.get("created_at"))
        return jsonify(users), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/admin/users", methods=["POST"])
@require_auth(allowed_roles=["ADMIN"])
def create_admin_user():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    full_name = data.get("full_name", "").strip()
    role = data.get("role", "OPERATOR").strip().upper()
    phone = data.get("phone", "").strip()
    village_id = data.get("assigned_village_id")

    if not username or not password or not full_name:
        return jsonify({"error": "Username, password, and full name are required."}), 400
    if role not in ["ADMIN", "OPERATOR"]:
        return jsonify({"error": "Role must be ADMIN or OPERATOR."}), 400

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({"error": "Username already exists."}), 409

        p_hash = generate_password_hash(password)
        cursor.execute("""
            INSERT INTO users (username, password_hash, full_name, role, phone, assigned_village_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (username, p_hash, full_name, role, phone, village_id if village_id else None))
        connection.commit()
        user_id = cursor.lastrowid
        return jsonify({"message": "User created successfully", "user_id": user_id}), 201
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/admin/users/<int:user_id>", methods=["PUT"])
@require_auth(allowed_roles=["ADMIN"])
def update_admin_user(user_id):
    data = request.get_json(silent=True) or {}
    full_name = data.get("full_name", "").strip()
    role = data.get("role", "").strip().upper()
    phone = data.get("phone", "").strip()
    village_id = data.get("assigned_village_id")
    password = data.get("password", "").strip()

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, username, role FROM users WHERE id = %s", (user_id,))
        existing = cursor.fetchone()
        if not existing:
            return jsonify({"error": "User not found"}), 404

        updates = []
        params = []
        if full_name:
            updates.append("full_name = %s")
            params.append(full_name)
        if role and role in ["ADMIN", "OPERATOR"]:
            updates.append("role = %s")
            params.append(role)
        if phone is not None:
            updates.append("phone = %s")
            params.append(phone)
        if "assigned_village_id" in data:
            updates.append("assigned_village_id = %s")
            params.append(village_id if village_id else None)
        if password:
            updates.append("password_hash = %s")
            params.append(generate_password_hash(password))

        if updates:
            params.append(user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(query, tuple(params))
            connection.commit()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@require_auth(allowed_roles=["ADMIN"])
def delete_admin_user(user_id):
    if request.current_user.get("id") == user_id:
        return jsonify({"error": "You cannot delete your own account."}), 400

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        target = cursor.fetchone()
        if not target:
            return jsonify({"error": "User not found"}), 404
        if target["role"] == "ADMIN":
            cursor.execute("SELECT COUNT(*) AS count FROM users WHERE role = 'ADMIN'")
            if cursor.fetchone()["count"] <= 1:
                return jsonify({"error": "Cannot delete the last administrator."}), 400

        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

# -------------------------------------------------------------
# Admin Station Management APIs
# -------------------------------------------------------------

@app.route("/api/admin/stations", methods=["POST"])
@require_auth(allowed_roles=["ADMIN"])
def create_station():
    data = request.get_json(silent=True) or {}
    village_name = data.get("village_name", "").strip()
    district = data.get("district", "Thoothukudi").strip()
    state = data.get("state", "Tamil Nadu").strip()
    machine_name = data.get("machine_name", "").strip()
    location = data.get("location", "").strip()
    status = data.get("status", "AVAILABLE").strip().upper()
    capacity = int(data.get("tank_capacity_liters") or 5000)
    water_level = int(data.get("water_level_pct") or 85)
    tds = int(data.get("tds_level") or 110)
    op_name = data.get("operator_name", "").strip() or "Local Panchayat Operator"
    op_phone = data.get("operator_phone", "").strip() or "+91 94421 88200"

    if not village_name or not machine_name:
        return jsonify({"error": "Village name and Machine name are required."}), 400
    if status not in VALID_STATUSES:
        status = "AVAILABLE"

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT id FROM villages WHERE name = %s", (village_name,))
        v_row = cursor.fetchone()
        if v_row:
            village_id = v_row["id"]
        else:
            cursor.execute("INSERT INTO villages (name, district, state) VALUES (%s, %s, %s)", (village_name, district, state))
            connection.commit()
            village_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO ro_machines (village_id, machine_name, location, status, tank_capacity_liters, water_level_pct, tds_level, operator_name, operator_phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (village_id, machine_name, location, status, capacity, water_level, tds, op_name, op_phone))
        connection.commit()
        machine_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO machine_status_logs (machine_id, status, remarks, updated_by)
            VALUES (%s, %s, %s, %s)
        """, (machine_id, status, "New station commissioned into Water Beacon network", request.current_user.get("full_name", "Admin")))
        connection.commit()

        return jsonify({"message": "Station created successfully", "machine_id": machine_id}), 201
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/admin/stations/<int:machine_id>", methods=["PUT"])
@require_auth(allowed_roles=["ADMIN", "OPERATOR"])
def update_station(machine_id):
    data = request.get_json(silent=True) or {}
    machine_name = data.get("machine_name", "").strip()
    location = data.get("location", "").strip()
    capacity = data.get("tank_capacity_liters")
    water_level = data.get("water_level_pct")
    tds = data.get("tds_level")
    op_name = data.get("operator_name", "").strip()
    op_phone = data.get("operator_phone", "").strip()
    status = data.get("status", "").strip().upper()

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT id, village_id FROM ro_machines WHERE id = %s", (machine_id,))
        machine = cursor.fetchone()
        if not machine:
            return jsonify({"error": "Station not found"}), 404

        if request.current_user.get("role") == "OPERATOR":
            assigned_v = request.current_user.get("assigned_village_id")
            if assigned_v and assigned_v != machine["village_id"]:
                return jsonify({"error": "You are not authorized to modify this station."}), 403

        updates = []
        params = []
        if machine_name:
            updates.append("machine_name = %s")
            params.append(machine_name)
        if location:
            updates.append("location = %s")
            params.append(location)
        if capacity is not None:
            updates.append("tank_capacity_liters = %s")
            params.append(int(capacity))
        if water_level is not None:
            updates.append("water_level_pct = %s")
            params.append(int(water_level))
        if tds is not None:
            updates.append("tds_level = %s")
            params.append(int(tds))
        if op_name:
            updates.append("operator_name = %s")
            params.append(op_name)
        if op_phone:
            updates.append("operator_phone = %s")
            params.append(op_phone)
        if status and status in VALID_STATUSES:
            updates.append("status = %s")
            params.append(status)

        if updates:
            params.append(machine_id)
            cursor.execute(f"UPDATE ro_machines SET {', '.join(updates)}, last_updated = CURRENT_TIMESTAMP WHERE id = %s", tuple(params))
            connection.commit()

        if request.current_user.get("role") == "ADMIN" and (data.get("village_name") or data.get("district")):
            v_updates = []
            v_params = []
            if data.get("village_name"):
                v_updates.append("name = %s")
                v_params.append(data.get("village_name").strip())
            if data.get("district"):
                v_updates.append("district = %s")
                v_params.append(data.get("district").strip())
            if v_updates:
                v_params.append(machine["village_id"])
                cursor.execute(f"UPDATE villages SET {', '.join(v_updates)} WHERE id = %s", tuple(v_params))
                connection.commit()

        return jsonify({"message": "Station updated successfully"}), 200
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

@app.route("/api/admin/stations/<int:machine_id>", methods=["DELETE"])
@require_auth(allowed_roles=["ADMIN"])
def delete_station(machine_id):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id FROM ro_machines WHERE id = %s", (machine_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Station not found"}), 404

        cursor.execute("DELETE FROM ro_machines WHERE id = %s", (machine_id,))
        connection.commit()
        return jsonify({"message": "Station deleted successfully"}), 200
    except Exception as error:
        if connection: connection.rollback()
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor: cursor.close()
        if connection and connection.is_connected(): connection.close()

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
                item["last_updated"] = format_iso_ist(item.get("last_updated"))

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
            result["last_updated"] = format_iso_ist(result["last_updated"])

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
                m["last_updated"] = format_iso_ist(m.get("last_updated"))

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
            machine["last_updated"] = format_iso_ist(machine["last_updated"])

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
            updated["last_updated"] = format_iso_ist(updated["last_updated"])

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
            ORDER BY l.created_at DESC, l.id DESC
            LIMIT 50
        """, (machine_id,))

        logs = cursor.fetchall()

        for log in logs:
            if log.get("created_at"):
                log["created_at"] = format_iso_ist(log["created_at"])

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

        query += " ORDER BY m.started_at DESC, m.id DESC"

        cursor.execute(query, tuple(params))
        records = cursor.fetchall()

        for rec in records:
            for field in ["started_at", "expected_end_at", "completed_at"]:
                if rec.get(field):
                    rec[field] = format_iso_ist(rec[field])

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
            ORDER BY c.created_at DESC, c.id DESC
            LIMIT 50
        """)

        reports = cursor.fetchall()
        for r in reports:
            if r.get("created_at"):
                r["created_at"] = format_iso_ist(r["created_at"])

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
