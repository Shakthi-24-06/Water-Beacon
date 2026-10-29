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

    def test_01_index_route(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Water Beacon", res.data)
        self.assertIn(b"navbar", res.data)

    def test_02_all_static_assets(self):
        assets = [
            "/css/style.css",
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
            "/js/sections/navbar.js",
            "/js/sections/hero.js",
            "/js/sections/status.js",
            "/js/sections/stations.js",
            "/js/sections/maintenance.js",
        ]
        for asset in assets:
            res = self.client.get(asset)
            self.assertEqual(res.status_code, 200, f"Failed to load asset: {asset}")
            self.assertGreater(len(res.data), 0, f"Asset is empty: {asset}")

    def test_03_api_villages(self):
        res = self.client.get("/api/villages")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        self.assertTrue(any(v["name"] == "Semmarikulam" for v in data))

    def test_04_api_village_status(self):
        res = self.client.get("/api/villages/1/status")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["village_id"], 1)
        self.assertEqual(data["village_name"], "Semmarikulam")
        self.assertIn("status", data)
        self.assertIn("water_level_pct", data)
        self.assertIn("tds_level", data)

    def test_05_api_machines_and_filtering(self):
        res = self.client.get("/api/machines")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertGreater(len(data), 0)

        # Filter by status
        res_avail = self.client.get("/api/machines?status=AVAILABLE")
        self.assertEqual(res_avail.status_code, 200)
        for m in res_avail.get_json():
            self.assertEqual(m["status"], "AVAILABLE")

        # Search by name
        res_search = self.client.get("/api/machines?search=Semmari")
        self.assertEqual(res_search.status_code, 200)
        self.assertEqual(len(res_search.get_json()), 1)

    def test_06_operator_update_status(self):
        payload = {
            "status": "AVAILABLE",
            "remarks": "Automated integration test status check",
            "updated_by": "Test Suite Operator",
            "water_level_pct": 92,
            "tds_level": 108
        }
        res = self.client.post("/api/machines/1/status", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["machine"]["status"], "AVAILABLE")
        self.assertEqual(data["machine"]["water_level_pct"], 92)

        # Check logs
        res_logs = self.client.get("/api/machines/1/logs")
        self.assertEqual(res_logs.status_code, 200)
        logs = res_logs.get_json()
        self.assertGreater(len(logs), 0)
        self.assertEqual(logs[0]["remarks"], "Automated integration test status check")

    def test_07_maintenance_crud_flow(self):
        # Create ticket
        payload = {
            "machine_id": 1,
            "issue_type": "Filter Cleaning Test",
            "description": "Routine test verification of intake mesh",
            "updated_by": "Unit Test Tech",
            "set_machine_maintenance": False
        }
        res_create = self.client.post("/api/maintenance", json=payload)
        self.assertEqual(res_create.status_code, 201)
        rec_id = res_create.get_json()["record_id"]

        # Patch ticket to completed
        res_patch = self.client.patch(f"/api/maintenance/{rec_id}", json={"status": "COMPLETED"})
        self.assertEqual(res_patch.status_code, 200)

    def test_08_community_report_submission(self):
        payload = {
            "machine_id": 1,
            "reporter_name": "Sundar",
            "reporter_phone": "+91 98401 23456",
            "issue_type": "Low Pressure",
            "description": "Observed slow dispensing flow during midday hours."
        }
        res = self.client.post("/api/reports", json=payload)
        self.assertEqual(res.status_code, 201)

        res_list = self.client.get("/api/reports")
        self.assertEqual(res_list.status_code, 200)
        reports = res_list.get_json()
        self.assertTrue(any(r["reporter_name"] == "Sundar" for r in reports))

    def test_09_system_stats_overview(self):
        res = self.client.get("/api/stats/overview")
        self.assertEqual(res.status_code, 200)
        stats = res.get_json()
        self.assertIn("total_stations", stats)
        self.assertIn("available_stations", stats)
        self.assertIn("total_capacity_liters", stats)
        self.assertGreater(stats["total_stations"], 0)

    def test_10_csv_export(self):
        res = self.client.get("/api/export/status-csv")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, "text/csv")
        self.assertIn(b"RO Machine Name", res.data)
        self.assertIn(b"Semmarikulam", res.data)

if __name__ == "__main__":
    unittest.main()
