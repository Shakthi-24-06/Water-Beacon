import os
import sys
import unittest
import re

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

from app import app

class TestTamilAndResponsiveDesign(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_01_font_link_includes_noto_sans_tamil(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Noto+Sans+Tamil", res.data)
        self.assertIn(b"Inter", res.data)

    def test_02_tamil_font_variable_defined_in_css(self):
        res = self.client.get("/css/style.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        self.assertIn("--font-tamil:", content)
        self.assertIn("Noto Sans Tamil", content)
        self.assertIn('html[lang="ta"]', content)
        self.assertIn("letter-spacing: 0 !important;", content)

    def test_03_navbar_has_nowrap_and_bilingual_alignment(self):
        res = self.client.get("/css/sections/navbar.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        # white-space: nowrap prevents awkward multi-line wrapping of Tamil labels
        self.assertIn("white-space: nowrap", content)
        # Tamil responsive drawer breakpoint at 1040px
        self.assertIn('html[lang="ta"] .nav-links', content)
        # Vertical alignment
        self.assertIn("align-items: center;", content)

    def test_04_hero_css_tamil_and_grid_stats(self):
        res = self.client.get("/css/sections/hero.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        # Grid stats row prevents overflow
        self.assertIn("grid-template-columns: repeat(4, 1fr);", content)
        # Tamil headline line-height & tracking adjustment
        self.assertIn('html[lang="ta"] .hero-headline', content)
        # Search input allows flex shrink without clipping
        self.assertIn("min-width: 0", content)
        # Word integrity: entire 'தெரிந்துகொள்ளுங்கள்...' is kept together on the same line
        self.assertIn('html[lang="ta"] .hero-headline .hero-highlight', content)
        self.assertIn("white-space: nowrap !important;", content)

    def test_05_status_details_grid_responsive(self):
        res = self.client.get("/css/sections/status.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        self.assertIn("station-details-grid", content)
        self.assertIn("telemetry-card", content)
        self.assertIn("grid-template-columns: repeat(2, 1fr);", content)

    def test_06_stations_card_alignment_and_bottom_pinning(self):
        res = self.client.get("/css/sections/stations.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        self.assertIn("margin-top: auto;", content)
        self.assertIn("flex-wrap: wrap;", content)

    def test_07_how_it_works_stretch_equal_height(self):
        res = self.client.get("/css/sections/how-it-works.css")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        self.assertIn("align-items: stretch;", content)

    def test_08_language_js_has_tamil_dictionary_and_attribute_binding(self):
        res = self.client.get("/js/language.js")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")
        self.assertIn("document.documentElement.lang = lang;", content)
        self.assertIn("lang-ta", content)
        self.assertIn("குடிநீர்", content)
        self.assertIn("அனைத்து நிலையங்கள்", content)

if __name__ == "__main__":
    unittest.main()
