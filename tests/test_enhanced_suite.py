"""Comprehensive verification script for Water Beacon enhancements."""
import os
import sys
import json
import urllib.request
import urllib.error
import re

BASE_URL = "http://127.0.0.1:5000"

def run_tests():
    print("=" * 60)
    print("WATER BEACON ENHANCEMENT VERIFICATION SUITE")
    print("=" * 60)
    passed = 0
    total = 0

    def assert_true(cond, name):
        nonlocal passed, total
        total += 1
        if cond:
            print(f" [PASS] {name}")
            passed += 1
        else:
            print(f" [FAIL] {name}")

    # TEST 1: Entry Page on Root Route (Simple Introduction & Login)
    with urllib.request.urlopen(f"{BASE_URL}/") as resp:
        html = resp.read().decode("utf-8")
        assert_true("Smart Water Monitoring for Every Community" in html, "Entry page appears on / with main headline")
        assert_true("Public Access" in html and "Continue as Public User" in html, "Public Access card present with button")
        assert_true("Admin" in html and ("Login" in html or "Sign In" in html), "Admin / Operator Login section present")
        assert_true("form-welcome-login" in html or "btn-admin-login" in html, "Direct login capability present on welcome page")
        assert_true("href=\"/admin" not in html[html.find("<footer"):], "Footer contains NO admin links")

    # TEST 2: Public Citizen Portal Route
    with urllib.request.urlopen(f"{BASE_URL}/public") as resp:
        pub_html = resp.read().decode("utf-8")
        assert_true("navbar" in pub_html and "status" in pub_html, "Public portal loads on /public")

    # TEST 3: Admin Login Route connects to Operator portal
    with urllib.request.urlopen(f"{BASE_URL}/admin/login") as resp:
        login_html = resp.read().decode("utf-8")
        assert_true(resp.geturl().endswith("/operator") or "Operator Access PIN" in login_html, "Admin login route connects to operator portal")
        assert_true("Operator Access PIN" in login_html and "form-operator-login" in login_html, "Operator PIN authentication form present")

    # TEST 4: Operator Dashboard Screen
    assert_true("operator-dashboard-screen" in login_html and "Live Station Telemetry" in login_html, "Operator management console present in operator.html")
    with urllib.request.urlopen(f"{BASE_URL}/admin/dashboard") as resp:
        assert_true(resp.geturl().endswith("/operator"), "Admin dashboard route redirects to operator portal")

    # TEST 5: Auth Login - Admin User
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/login",
        data=json.dumps({"username": "admin", "password": "Admin@2026"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        admin_token = data.get("token")
        assert_true(data.get("success") and data["user"]["role"] == "ADMIN", "Admin logs in successfully with ADMIN role")

    # TEST 6: Auth Login - Field Operator
    req_op = urllib.request.Request(
        f"{BASE_URL}/api/auth/login",
        data=json.dumps({"username": "operator", "password": "Operator@2026"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req_op) as resp:
        data_op = json.loads(resp.read().decode("utf-8"))
        op_token = data_op.get("token")
        assert_true(data_op.get("success") and data_op["user"]["role"] == "OPERATOR", "Operator logs in successfully with OPERATOR role")

    # TEST 7: Auth Login - PIN Fallback
    req_pin = urllib.request.Request(
        f"{BASE_URL}/api/auth/login",
        data=json.dumps({"pin": "2026"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req_pin) as resp:
        data_pin = json.loads(resp.read().decode("utf-8"))
        assert_true(data_pin.get("success"), "PIN 2026 authenticates successfully")

    # TEST 8: Auth Verification Endpoint /api/auth/me
    req_me = urllib.request.Request(
        f"{BASE_URL}/api/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    with urllib.request.urlopen(req_me) as resp:
        me_data = json.loads(resp.read().decode("utf-8"))
        assert_true(me_data.get("user") and me_data["user"]["username"] == "admin", "/api/auth/me returns authenticated admin")

    # TEST 9: Authorization Check - Operator cannot access /api/admin/users
    req_forbidden = urllib.request.Request(
        f"{BASE_URL}/api/admin/users",
        headers={"Authorization": f"Bearer {op_token}"}
    )
    try:
        urllib.request.urlopen(req_forbidden)
        assert_true(False, "Operator blocked from /api/admin/users with 403")
    except urllib.error.HTTPError as e:
        assert_true(e.code == 403, f"Operator correctly blocked from /api/admin/users (HTTP {e.code})")

    # TEST 10: Authorization Check - Public cannot access /api/admin/users
    req_unauth = urllib.request.Request(f"{BASE_URL}/api/admin/users")
    try:
        urllib.request.urlopen(req_unauth)
        assert_true(False, "Public request blocked from /api/admin/users with 401")
    except urllib.error.HTTPError as e:
        assert_true(e.code == 401, f"Public request correctly blocked from /api/admin/users (HTTP {e.code})")

    # TEST 11: Admin CRUD - Create RO Station
    new_station_payload = {
        "machine_name": "Test Model RO Station",
        "village_name": "TestKulam",
        "district": "Thoothukudi",
        "location": "Near Panchayat Office",
        "status": "AVAILABLE",
        "tank_capacity_liters": 6000,
        "water_level_pct": 92,
        "tds_level": 115,
        "operator_name": "Gopal S",
        "operator_phone": "+91 94420 77777"
    }
    req_create = urllib.request.Request(
        f"{BASE_URL}/api/admin/stations",
        data=json.dumps(new_station_payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {admin_token}"
        },
        method="POST"
    )
    created_id = None
    with urllib.request.urlopen(req_create) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        created_id = res_data.get("machine_id")
        assert_true(resp.status == 201 and created_id, f"Admin created new station (ID: {created_id})")

    # TEST 12: Public Sees the Newly Created Station
    with urllib.request.urlopen(f"{BASE_URL}/api/machines/{created_id}") as resp:
        m_data = json.loads(resp.read().decode("utf-8"))
        assert_true(m_data.get("machine_name") == "Test Model RO Station" and m_data.get("water_level_pct") == 92, "Public machines API returns new station telemetry")

    # TEST 13: Admin Updates the Station Status
    update_payload = {
        "status": "UNDER_MAINTENANCE",
        "water_level_pct": 40,
        "tds_level": 130,
        "remarks": "Semi-annual carbon bed backwash in progress",
        "updated_by": "District Admin"
    }
    req_update = urllib.request.Request(
        f"{BASE_URL}/api/machines/{created_id}/status",
        data=json.dumps(update_payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {admin_token}"
        },
        method="POST"
    )
    with urllib.request.urlopen(req_update) as resp:
        up_data = json.loads(resp.read().decode("utf-8"))
        assert_true(up_data.get("machine") and up_data["machine"]["status"] == "UNDER_MAINTENANCE", "Station status updated to UNDER_MAINTENANCE")

    # TEST 14: Public Sees Updated Status
    with urllib.request.urlopen(f"{BASE_URL}/api/machines/{created_id}") as resp:
        m_data_updated = json.loads(resp.read().decode("utf-8"))
        assert_true(m_data_updated.get("status") == "UNDER_MAINTENANCE" and m_data_updated.get("water_level_pct") == 40, "Public users immediately see the updated status")

    # TEST 15: Admin Deletes Test Station
    req_del = urllib.request.Request(
        f"{BASE_URL}/api/admin/stations/{created_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        method="DELETE"
    )
    with urllib.request.urlopen(req_del) as resp:
        assert_true(resp.status == 200, "Admin deleted test station successfully")

    # TEST 16: Translation Coverage
    with open("frontend/js/language.js", "r", encoding="utf-8") as f:
        lang_js = f.read()

    html_files = [
        "frontend/welcome.html",
        "frontend/operator.html",
        "frontend/public.html",
        "frontend/sections/navbar.html",
        "frontend/sections/hero.html",
        "frontend/sections/status.html",
        "frontend/sections/stations.html",
        "frontend/sections/maintenance.html",
        "frontend/sections/how-it-works.html",
        "frontend/sections/about.html",
        "frontend/sections/footer.html"
    ]

    all_keys = set()
    for hf in html_files:
        if os.path.exists(hf):
            with open(hf, "r", encoding="utf-8") as f:
                c = f.read()
                matches = re.findall(r'data-i18n="([^"]+)"', c)
                all_keys.update(matches)

    missing_en = []
    missing_ta = []

    en_block = lang_js[:lang_js.find("ta: {")]
    ta_block = lang_js[lang_js.find("ta: {"):]

    for k in all_keys:
        if f"{k}:" not in en_block:
            missing_en.append(k)
        if f"{k}:" not in ta_block:
            missing_ta.append(k)

    assert_true(len(missing_en) == 0, f"All {len(all_keys)} data-i18n keys exist in English dictionary (missing: {missing_en})")
    assert_true(len(missing_ta) == 0, f"All {len(all_keys)} data-i18n keys exist in Tamil dictionary (missing: {missing_ta})")

    print("=" * 60)
    print(f"VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED")
    print("=" * 60)
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
