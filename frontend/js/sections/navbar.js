function initNavbar() {
    const navbar = document.getElementById("top-navbar");
    const languageBtn = document.getElementById("language-btn");
    const languageMenu = document.getElementById("language-menu");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("main-nav-links");
    const operatorBtn = document.getElementById("nav-operator-btn");

    // Scroll listener for sticky drop shadow
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    }, { passive: true });

    // Language Dropdown
    if (languageBtn && languageMenu) {
        languageBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            languageMenu.classList.toggle("show");
        });

        languageMenu.querySelectorAll("[data-language]").forEach(btn => {
            btn.addEventListener("click", () => {
                const lang = btn.getAttribute("data-language");
                if (typeof window.applyLanguage === "function") {
                    window.applyLanguage(lang);
                }
                languageMenu.classList.remove("show");
            });
        });

        document.addEventListener("click", (e) => {
            if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
                languageMenu.classList.remove("show");
            }
        });
    }

    // Mobile Navigation Drawer
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-open");
            });
        });
    }

    // Active Link Highlighting on Scroll
    const sections = ["home", "status", "stations", "maintenance", "how-it-works", "about"];
    window.addEventListener("scroll", () => {
        let current = "home";
        sections.forEach(secId => {
            const el = document.getElementById(secId);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 140) {
                    current = secId;
                }
            }
        });

        navLinks?.querySelectorAll("a").forEach(a => {
            a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
        });
    }, { passive: true });

    // Operator Button Click -> Open Operator Update Modal
    if (operatorBtn) {
        operatorBtn.addEventListener("click", () => {
            if (typeof window.openOperatorModal === "function") {
                window.openOperatorModal();
            }
        });
    }
}

window.initNavbar = initNavbar;
