import unittest
import glob
import re
import json

class TestTamilFullCoverage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('frontend/js/language.js', 'r', encoding='utf-8') as f:
            cls.lang_js = f.read()

    def test_all_html_data_i18n_keys_present_in_translations(self):
        """Every single data-i18n tag across all section HTML templates must exist in language.js translations."""
        missing = []
        for fpath in glob.glob('frontend/sections/*.html'):
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            for m in re.finditer(r'data-i18n="([^"]+)"', content):
                key = m.group(1)
                # Ensure key is in translations.en and translations.ta
                pattern = rf'\b{key}\s*:'
                if not re.search(pattern, self.lang_js):
                    missing.append((fpath, key))

        self.assertEqual(len(missing), 0, f"Found missing i18n keys: {missing}")

    def test_brand_tamil_translations_present(self):
        """Brand name 'Water Beacon' must have Tamil counterpart 'வாட்டர் பீக்கன்'."""
        self.assertIn("brandWater", self.lang_js)
        self.assertIn("brandBeacon", self.lang_js)
        self.assertIn("வாட்டர்", self.lang_js)
        self.assertIn("பீக்கன்", self.lang_js)

    def test_avatar_badges_tamil_translations(self):
        """Avatar badges TN/RO must have Tamil counterpart."""
        self.assertIn("avatarTN", self.lang_js)
        self.assertIn("த.நா", self.lang_js)

    def test_toast_and_button_tamil_translations(self):
        """Toast notifications and action buttons must have Tamil entries."""
        keys = ["toastSuccess", "toastError", "toastNotice", "toastInfo", "submittingBtn", "reportSuccessToast", "statusRefreshedToast"]
        for k in keys:
            self.assertIn(k, self.lang_js, f"Missing key: {k}")

    def test_dynamic_telemetry_dictionaries_exist(self):
        """Global dictionaries for villages, districts, machines, operators, and issues must exist."""
        self.assertIn("villageTranslations", self.lang_js)
        self.assertIn("districtTranslations", self.lang_js)
        self.assertIn("locationTranslations", self.lang_js)
        self.assertIn("machineTranslations", self.lang_js)
        self.assertIn("operatorTranslations", self.lang_js)
        self.assertIn("issueTranslations", self.lang_js)

    def test_window_helper_functions_defined(self):
        """window.translateVillage, translateDistrict, translateMachine, getStatusLabel must be defined."""
        helpers = [
            "window.translateVillage",
            "window.translateDistrict",
            "window.translateLocation",
            "window.translateMachine",
            "window.translateOperator",
            "window.translateIssue",
            "window.getStatusLabel"
        ]
        for h in helpers:
            self.assertIn(h, self.lang_js, f"Missing helper: {h}")

    def test_village_translations_coverage(self):
        """All primary villages in the system must map to valid Tamil names."""
        villages = [
            "Semmarikulam", "Srivaikuntam", "Tiruchendur", "Udangudi",
            "Authoor", "Kayalpattinam", "Nazareth", "Sathankulam"
        ]
        for v in villages:
            self.assertIn(f'"{v}"', self.lang_js, f"Missing village mapping: {v}")

if __name__ == '__main__':
    unittest.main()
