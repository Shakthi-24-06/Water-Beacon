import os
import sys
import unittest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

from app import app

class TestWaterBeaconApp(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_01_index_route_citizen_separation(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Water Beacon", res.data)
        # Public users see the citizen interface
        self.assertIn(b"navbar", res.data)
        self.assertIn(b"hero", res.data)
        self.assertIn(b"status", res.data)
        # Verify operator portal is separated
        self.assertNotIn(b"Broadcast Status Update to Network", res.data)

    def test_02_operator_portal_route(self):
        res = self.client.get("/operator")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Field Operator Console", res.data)
        self.assertIn(b"Operator Access PIN", res.data)

    def test_03_operator_login_api(self):
        # Invalid PIN
        res_fail = self.client.post("/api/operator/login", json={"pin": "wrong_pin"})
        self.assertEqual(res_fail.status_code, 401)
        self.assertFalse(res_fail.get_json()["success"])

        # Valid PIN (default: 2026)
        res_ok = self.client.post("/api/operator/login", json={"pin": "2026", "operator_name": "Selvam R"})
        self.assertEqual(res_ok.status_code, 200)
        data = res_ok.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["operator"]["name"], "Selvam R")
        self.assertIn("session_token", data["operator"])

    def test_04_all_static_assets(self):
        assets = [
            "/css/style.css",
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
            "/js/operator.js",
            "/js/sections/navbar.js",
            "/js/sections/hero.js",
            "/js/sections/status.js",
            "/js/sections/stations.js",
            "/js/sections/maintenance.js",
            "/assets/logo.svg",
            "/assets/logo-full.svg",
            "/favicon.svg",
        ]
        for asset in assets:
            res = self.client.get(asset)
            self.assertEqual(res.status_code, 200, f"Failed to load asset: {asset}")
            self.assertGreater(len(res.data), 0, f"Asset is empty: {asset}")

    def test_05_api_villages_and_status(self):
        res = self.client.get("/api/villages")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.get_json(), list)

        res_status = self.client.get("/api/villages/1/status")
        self.assertEqual(res_status.status_code, 200)
        data = res_status.get_json()
        self.assertEqual(data["village_id"], 1)
        self.assertIn("water_level_pct", data)
        self.assertIn("tds_level", data)

    def test_06_operator_update_machine_status(self):
        payload = {
            "status": "AVAILABLE",
            "remarks": "Morning filtration cycle completed",
            "updated_by": "Operator Test Suite",
            "water_level_pct": 88,
            "tds_level": 112
        }
        res = self.client.post("/api/machines/1/status", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["machine"]["status"], "AVAILABLE")
        self.assertEqual(data["machine"]["water_level_pct"], 88)

    def test_07_citizen_report_flow_and_operator_resolution(self):
        # 1. Citizen posts issue
        report_data = {
            "machine_id": 1,
            "reporter_name": "Meenakshi",
            "reporter_phone": "+91 94430 12345",
            "issue_type": "Low Pressure",
            "description": "Tap flow is low this afternoon."
        }
        res_post = self.client.post("/api/reports", json=report_data)
        self.assertEqual(res_post.status_code, 201)
        rep_id = res_post.get_json()["report_id"]

        # 2. Operator updates status to INVESTIGATING
        res_inv = self.client.patch(f"/api/reports/{rep_id}", json={"status": "INVESTIGATING"})
        self.assertEqual(res_inv.status_code, 200)

        # 3. Operator marks RESOLVED
        res_res = self.client.patch(f"/api/reports/{rep_id}", json={"status": "RESOLVED"})
        self.assertEqual(res_res.status_code, 200)

    def test_08_system_stats_overview(self):
        res = self.client.get("/api/stats/overview")
        self.assertEqual(res.status_code, 200)
        stats = res.get_json()
        self.assertIn("total_stations", stats)
        self.assertIn("available_stations", stats)

    def test_09_csv_export(self):
        res = self.client.get("/api/export/status-csv")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, "text/csv")
        self.assertIn(b"Semmarikulam", res.data)

if __name__ == "__main__":
    unittest.main()
