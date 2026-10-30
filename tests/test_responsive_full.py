import unittest
import os
import re

class TestResponsiveFullApplication(unittest.TestCase):
    """
    Comprehensive verification of application responsiveness across
    Desktop, Tablet, Mobile (standard & small), and Ultra-wide viewports.
    """

    def setUp(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.frontend_dir = os.path.join(self.base_dir, "frontend")

    def test_01_all_html_pages_have_viewport_meta_tag(self):
        """All main HTML entry points must define a mobile-responsive viewport meta tag."""
        pages = ["welcome.html", "public.html", "index.html", "operator.html"]
        for page in pages:
            file_path = os.path.join(self.frontend_dir, page)
            self.assertTrue(os.path.exists(file_path), f"File {page} missing")
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn('<meta name="viewport" content="width=device-width, initial-scale=1.0', content,
                          f"Page {page} is missing proper viewport meta tag")

    def test_02_global_style_css_responsiveness(self):
        """style.css must define responsive container, tables, modals, and toast rules."""
        css_path = os.path.join(self.frontend_dir, "css", "style.css")
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Responsive container
        self.assertIn(".container {", content)
        self.assertIn("min(1200px,", content)
        self.assertIn("@media (max-width: 480px)", content)

        # Responsive tables
        self.assertIn(".table-responsive {", content)
        self.assertIn("overflow-x: auto;", content)
        self.assertIn("-webkit-overflow-scrolling: touch;", content)

        # Mobile modal adjustments
        self.assertIn("@media (max-width: 560px)", content)
        self.assertIn(".modal-container {", content)
        self.assertIn(".modal-footer {", content)

    def test_03_operator_css_responsiveness(self):
        """operator.css must handle desktop, tablet, and mobile breakpoints gracefully."""
        css_path = os.path.join(self.frontend_dir, "css", "operator.css")
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Topbar responsive handling
        self.assertIn(".operator-topbar {", content)
        self.assertIn("@media (max-width: 820px)", content)
        self.assertIn(".op-nav-tabs {", content)

        # Fluid status pill choices
        self.assertIn(".status-pill-selector {", content)
        self.assertIn("min(100%, 105px)", content)

        # Responsive audit log table
        self.assertIn(".table-responsive {", content)
        self.assertIn(".audit-table {", content)
        self.assertIn("min-width: 560px;", content)

        # Responsive single plant grid & issues grid
        self.assertIn("@media (max-width: 992px)", content)
        self.assertIn("@media (max-width: 640px)", content)
        self.assertIn("@media (max-width: 540px)", content)
        self.assertIn("@media (max-width: 380px)", content)

    def test_04_welcome_css_responsiveness(self):
        """welcome.css must support tablets and phones with 1-column card stack and fluid typography."""
        css_path = os.path.join(self.frontend_dir, "css", "welcome.css")
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("@media (max-width: 840px)", content)
        self.assertIn(".access-cards-grid {", content)
        self.assertIn("grid-template-columns: 1fr;", content)
        self.assertIn("@media (max-width: 480px)", content)
        self.assertIn("@media (max-width: 360px)", content)

    def test_05_navbar_css_responsiveness(self):
        """navbar.css must support standard tablets and ultra-compact mobile (<= 380px)."""
        css_path = os.path.join(self.frontend_dir, "css", "sections", "navbar.css")
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn(".mobile-menu-btn {", content)
        self.assertIn(".nav-links.mobile-open {", content)
        self.assertIn("@media (max-width: 380px)", content)

    def test_06_maintenance_and_status_css_responsiveness(self):
        """maintenance.css and status.css must have touch scroll and compact responsive rules."""
        maint_path = os.path.join(self.frontend_dir, "css", "sections", "maintenance.css")
        with open(maint_path, "r", encoding="utf-8") as f:
            maint_content = f.read()

        self.assertIn(".table-responsive {", maint_content)
        self.assertIn("min-width: 680px;", maint_content)
        self.assertIn("@media (max-width: 768px)", maint_content)

        status_path = os.path.join(self.frontend_dir, "css", "sections", "status.css")
        with open(status_path, "r", encoding="utf-8") as f:
            status_content = f.read()

        self.assertIn("@media (max-width: 640px)", status_content)
        self.assertIn("@media (max-width: 420px)", status_content)

if __name__ == "__main__":
    unittest.main()
