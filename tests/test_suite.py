"""
Comprehensive test suite for Water Beacon application.
Tests citizen portal, operator authentication, telemetry, maintenance, and community reporting.
"""

import unittest
import sys
import os
import json

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app
from db import get_db_connection

class WaterBeaconTestSuite(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def test_01_welcome_and_citizen_routes(self):
        # 1. Entry page on root route
        res_entry = self.client.get("/")
        self.assertEqual(res_entry.status_code, 200)
        self.assertIn(b"Water Beacon", res_entry.data)
        self.assertIn(b"Public Access", res_entry.data)
        self.assertIn(b"Admin / Operator Access", res_entry.data)
        self.assertNotIn(b"Broadcast Status Update to Network", res_entry.data)

        # 2. Public citizen portal on /public
        res_pub = self.client.get("/public")
        self.assertEqual(res_pub.status_code, 200)
        self.assertIn(b"navbar", res_pub.data)
        self.assertIn(b"hero", res_pub.data)
        self.assertIn(b"status", res_pub.data)

    def test_02_operator_portal_route(self):
        res = self.client.get("/operator")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Field Operator Console", res.data)
        self.assertIn(b"Operator Access PIN", res.data)

    def test_03_operator_login_api(self):
        # Invalid PIN
        res_fail = self.client.post("/api/operator/login", json={"pin": "wrong_pin"})
        self.assertEqual(res_fail.status_code, 401)
        data_fail = json.loads(res_fail.data.decode("utf-8"))
        self.assertFalse(data_fail.get("success"))

        # Valid PIN (2026)
        res_ok = self.client.post("/api/operator/login", json={
            "pin": "2026",
            "village_id": 1,
            "village_name": "Semmarikulam",
            "operator_name": "Muthu K"
        })
        self.assertEqual(res_ok.status_code, 200)
        data_ok = json.loads(res_ok.data.decode("utf-8"))
        self.assertTrue(data_ok.get("success"))
        self.assertIn("operator", data_ok)
        self.assertEqual(data_ok["operator"]["name"], "Muthu K")

    def test_04_get_villages_api(self):
        res = self.client.get("/api/villages")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode("utf-8"))
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertIn("name", data[0])
        self.assertIn("status", data[0])

    def test_05_get_village_status_api(self):
        res = self.client.get("/api/villages/1/status")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode("utf-8"))
        self.assertIn("village_name", data)
        self.assertIn("machine_name", data)
        self.assertIn("status", data)
        self.assertIn("water_level_pct", data)

    def test_06_machine_status_update_and_audit_log(self):
        # Update station 1 to OUT_OF_WATER
        payload = {
            "status": "OUT_OF_WATER",
            "water_level_pct": 0,
            "tds_level": 120,
            "remarks": "Automated unit test ran dry tank check",
            "updated_by": "Unit Test Tech"
        }
        res_update = self.client.post("/api/machines/1/status", json=payload)
        self.assertEqual(res_update.status_code, 200)
        updated_data = json.loads(res_update.data.decode("utf-8"))
        self.assertEqual(updated_data["machine"]["status"], "OUT_OF_WATER")

        # Check logs
        res_logs = self.client.get("/api/machines/1/logs")
        self.assertEqual(res_logs.status_code, 200)
        logs = json.loads(res_logs.data.decode("utf-8"))
        self.assertGreaterEqual(len(logs), 1)
        self.assertEqual(logs[0]["status"], "OUT_OF_WATER")
        self.assertEqual(logs[0]["updated_by"], "Unit Test Tech")

        # Restore back to AVAILABLE
        self.client.post("/api/machines/1/status", json={
            "status": "AVAILABLE",
            "water_level_pct": 90,
            "tds_level": 110,
            "remarks": "Restored after unit test",
            "updated_by": "Unit Test Tech"
        })

    def test_07_maintenance_records_workflow(self):
        # 1. Create Maintenance Record
        create_payload = {
            "machine_id": 1,
            "issue_type": "Filter Cleaning Test",
            "description": "Routine test verification of intake mesh",
            "updated_by": "Test Inspector",
            "set_machine_maintenance": True
        }
        res_create = self.client.post("/api/maintenance", json=create_payload)
        self.assertEqual(res_create.status_code, 201)
        created_data = json.loads(res_create.data.decode("utf-8"))
        record_id = created_data.get("record_id")
        self.assertIsNotNone(record_id)

        # Machine should now be UNDER_MAINTENANCE
        res_machine = self.client.get("/api/machines/1")
        machine_data = json.loads(res_machine.data.decode("utf-8"))
        self.assertEqual(machine_data["status"], "UNDER_MAINTENANCE")

        # 2. Complete Maintenance Record
        res_patch = self.client.patch(f"/api/maintenance/{record_id}", json={"status": "COMPLETED"})
        self.assertEqual(res_patch.status_code, 200)

        # Machine should now be restored to AVAILABLE
        res_restored = self.client.get("/api/machines/1")
        restored_data = json.loads(res_restored.data.decode("utf-8"))
        self.assertEqual(restored_data["status"], "AVAILABLE")

    def test_08_community_report_workflow(self):
        report_payload = {
            "machine_id": 1,
            "reporter_name": "Anitha Ramanathan",
            "reporter_phone": "+91 94420 55443",
            "issue_type": "Low Dispenser Pressure",
            "description": "Dispenser nozzle flow rate is unusually slow this afternoon."
        }
        res_post = self.client.post("/api/reports", json=report_payload)
        self.assertEqual(res_post.status_code, 201)
        post_data = json.loads(res_post.data.decode("utf-8"))
        report_id = post_data.get("report_id")
        self.assertIsNotNone(report_id)

        # Fetch Reports List
        res_get = self.client.get("/api/reports")
        self.assertEqual(res_get.status_code, 200)
        reports = json.loads(res_get.data.decode("utf-8"))
        self.assertTrue(any(r["id"] == report_id for r in reports))

        # Update report status to INVESTIGATING
        res_patch = self.client.patch(f"/api/reports/{report_id}", json={"status": "INVESTIGATING"})
        self.assertEqual(res_patch.status_code, 200)

    def test_09_static_assets_presence(self):
        assets = [
            "/css/style.css",
            "/css/welcome.css",
            "/css/operator.css",
            "/css/sections/navbar.css",
            "/css/sections/hero.css",
            "/css/sections/status.css",
            "/css/sections/stations.css",
            "/css/sections/maintenance.css",
            "/css/sections/how-it-works.css",
            "/css/sections/about.css",
            "/css/sections/footer.css",
            "/sections/navbar.html",
            "/sections/hero.html",
            "/sections/status.html",
            "/sections/stations.html",
            "/sections/maintenance.html",
            "/sections/how-it-works.html",
            "/sections/about.html",
            "/sections/footer.html",
            "/sections/modals.html",
            "/js/language.js",
            "/js/app.js",
            "/js/operator.js"
        ]
        for asset in assets:
            res = self.client.get(asset)
            self.assertEqual(res.status_code, 200, f"Asset {asset} failed to load")

if __name__ == "__main__":
    unittest.main()
