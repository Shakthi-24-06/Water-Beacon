/**
 * Water Beacon - Dedicated Operator & Technician Console Logic
 * Single RO Plant Focus, Dedicated Issues Section, and Full Tamil/English Translation.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Language Toggle & Global Synchronization
    // -------------------------------------------------------------
    const toggles = [
        { btn: document.getElementById("op-lang-toggle"), menu: document.getElementById("op-lang-menu"), text: document.getElementById("op-lang-text") },
        { btn: document.getElementById("op-auth-lang-toggle"), menu: document.getElementById("op-auth-lang-menu"), text: document.getElementById("op-auth-lang-text") }
    ];

    toggles.forEach(({ btn, menu }) => {
        if (btn && menu) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                menu.classList.toggle("active");
            });
            document.addEventListener("click", () => menu.classList.remove("active"));
        }
    });

    function syncLanguageDisplay(lang) {
        toggles.forEach(({ text }) => {
            if (text) text.textContent = lang === "ta" ? "தமிழ்" : "English";
        });
        document.querySelectorAll("[data-lang-choice]").forEach(el => {
            el.classList.toggle("active", el.getAttribute("data-lang-choice") === lang);
        });
    }

    document.querySelectorAll("[data-lang-choice]").forEach(choice => {
        choice.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = choice.getAttribute("data-lang-choice");
            if (typeof applyLanguage === "function") {
                applyLanguage(lang);
            }
            syncLanguageDisplay(lang);
            toggles.forEach(({ menu }) => { if (menu) menu.classList.remove("active"); });
        });
    });

    // Re-render dynamic elements whenever language changes
    window.addEventListener("languageChanged", (e) => {
        const lang = e.detail?.language || localStorage.getItem("waterBeaconLanguage") || "en";
        syncLanguageDisplay(lang);
        updateSinglePlantDisplay();
        renderCitizenReports();
        renderAuditLogs();
        if (activeModalReport) {
            populateModalDetails(activeModalReport);
        }
    });

    const savedLang = localStorage.getItem("waterBeaconLanguage") || "en";
    if (typeof applyLanguage === "function") {
        applyLanguage(savedLang);
    }
    syncLanguageDisplay(savedLang);

    // -------------------------------------------------------------
    // 2. DOM Elements & State
    // -------------------------------------------------------------
    const authScreen = document.getElementById("operator-auth-screen");
    const dashboardScreen = document.getElementById("operator-dashboard-screen");
    const loginForm = document.getElementById("form-operator-login");
    const loginVillageSelect = document.getElementById("login-op-village");
    const loginNameInput = document.getElementById("login-op-name");
    const logoutBtn = document.getElementById("btn-operator-logout");
    const headerOpName = document.getElementById("header-operator-name");
    const headerOpVillage = document.getElementById("header-operator-village");

    // Views & Nav Tabs
    const navDashboard = document.getElementById("nav-op-dashboard");
    const navIssues = document.getElementById("nav-op-issues");
    const navIssuesBadge = document.getElementById("op-nav-issues-badge");
    const viewDashboard = document.getElementById("view-op-dashboard");
    const viewIssues = document.getElementById("view-op-issues");

    // Single RO Plant Overview Card
    const singlePlantName = document.getElementById("single-plant-name");
    const singlePlantVillage = document.getElementById("single-plant-village");
    const singlePlantStatusBadge = document.getElementById("single-plant-status-badge");
    const singlePlantStatusText = document.getElementById("single-plant-status-text");
    const tilePlantStatus = document.getElementById("tile-plant-status");
    const tilePlantLevel = document.getElementById("tile-plant-level");
    const tilePlantLevelFill = document.getElementById("tile-plant-level-fill");
    const tilePlantTds = document.getElementById("tile-plant-tds");
    const tilePlantUpdatedTime = document.getElementById("tile-plant-updated-time");
    const tilePlantUpdatedBy = document.getElementById("tile-plant-updated-by");

    // Controller Elements
    const stationSelect = document.getElementById("op-station-select");
    const statusBtns = document.querySelectorAll(".status-choice-btn");
    const currentBadge = document.getElementById("op-current-status-badge");
    const slider = document.getElementById("op-slider-level");
    const levelBadge = document.getElementById("op-level-badge");
    const tdsInput = document.getElementById("op-tds-input");
    const nameInput = document.getElementById("op-name-input");
    const remarksInput = document.getElementById("op-remarks-input");
    const stationUpdateForm = document.getElementById("form-op-station-update");

    // Audit Log Elements
    const auditTbody = document.getElementById("audit-logs-tbody");
    const refreshAuditBtn = document.getElementById("btn-refresh-audit-logs");

    // Dedicated Issues Page Elements
    const issuesGrid = document.getElementById("issues-grid-container");
    const issuesEmptyState = document.getElementById("issues-empty-state");
    const filterButtons = document.querySelectorAll(".op-filter-btn");

    // Issue Modal Elements
    const modalBackdrop = document.getElementById("modal-issue-details");
    const modalCloseBtn = document.getElementById("btn-close-issue-modal");
    const modalSecondaryCloseBtn = document.getElementById("modal-btn-close");
    const modalIssueStation = document.getElementById("modal-issue-station");
    const modalIssueStatusBadge = document.getElementById("modal-issue-status-badge");
    const modalIssueCategory = document.getElementById("modal-issue-category");
    const modalIssueDate = document.getElementById("modal-issue-date");
    const modalIssueReporter = document.getElementById("modal-issue-reporter");
    const modalIssuePhone = document.getElementById("modal-issue-phone");
    const modalIssueDesc = document.getElementById("modal-issue-description");
    const modalBtnInvestigating = document.getElementById("modal-btn-investigating");
    const modalBtnResolved = document.getElementById("modal-btn-resolved");
    const modalBtnReopen = document.getElementById("modal-btn-reopen");

    // State Variables
    let allMachines = [];
    let currentMachine = null;
    let selectedStatus = "AVAILABLE";
    let allReports = [];
    let currentFilter = "ALL";
    let activeModalReport = null;
    let cachedAuditLogs = [];

    // Helper translation accessor
    function tr(key, fallback = "") {
        if (typeof window.t === "function") {
            return window.t(key, fallback);
        }
        return fallback || key;
    }

    // -------------------------------------------------------------
    // 3. Navigation View Switching (Dashboard vs Issues)
    // -------------------------------------------------------------
    function switchView(target) {
        if (target === "issues") {
            navIssues?.classList.add("active");
            navDashboard?.classList.remove("active");
            if (viewDashboard) viewDashboard.style.display = "none";
            if (viewIssues) viewIssues.style.display = "block";
            loadCitizenReports();
        } else {
            navDashboard?.classList.add("active");
            navIssues?.classList.remove("active");
            if (viewDashboard) viewDashboard.style.display = "block";
            if (viewIssues) viewIssues.style.display = "none";
        }
    }

    navDashboard?.addEventListener("click", () => switchView("dashboard"));
    navIssues?.addEventListener("click", () => switchView("issues"));

    // -------------------------------------------------------------
    // 4. Preload Villages into Login Selector
    // -------------------------------------------------------------
    async function populateLoginVillages() {
        if (!loginVillageSelect) return;

        try {
            const res = await fetch("/api/machines");
            if (!res.ok) return;
            const machines = await res.json();
            allMachines = machines;

            loginVillageSelect.innerHTML = machines.map(m => {
                const vName = (typeof window.translateVillage === "function") ? window.translateVillage(m.village_name) : m.village_name;
                const distName = (typeof window.translateDistrict === "function") ? window.translateDistrict(m.district) : m.district;
                const mName = (typeof window.translateStationName === "function") ? window.translateStationName(m.machine_name, m.village_name) : ((typeof window.translateMachine === "function") ? window.translateMachine(m.machine_name) : m.machine_name);
                return `
                    <option value="${m.id}" data-village-id="${m.village_id}" data-village-name="${m.village_name}" data-op-name="${m.operator_name || 'Muthu K'}">
                        ${vName} (${distName}) — ${mName}
                    </option>
                `;
            }).join("");

            // Synchronize operator name when village is changed
            loginVillageSelect.addEventListener("change", () => {
                const opt = loginVillageSelect.selectedOptions[0];
                if (opt && loginNameInput) {
                    const defaultOp = opt.getAttribute("data-op-name");
                    if (defaultOp) loginNameInput.value = defaultOp;
                }
            });

            // Trigger initial selection
            if (loginVillageSelect.options.length > 0) {
                const firstOpt = loginVillageSelect.options[0];
                const defaultOp = firstOpt.getAttribute("data-op-name");
                if (defaultOp && loginNameInput) loginNameInput.value = defaultOp;
            }

        } catch (e) {
            console.warn("Failed to populate login villages:", e);
        }
    }

    // -------------------------------------------------------------
    // 5. Authentication & Session Management
    // -------------------------------------------------------------
    function checkAuth() {
        const token = sessionStorage.getItem("wb_operator_session");
        const opName = sessionStorage.getItem("wb_operator_name") || "Panchayat Operator";
        const opVillage = sessionStorage.getItem("wb_operator_village_name") || "Village RO Plant";

        if (token) {
            if (authScreen) authScreen.style.display = "none";
            if (dashboardScreen) dashboardScreen.style.display = "block";
            if (headerOpName) headerOpName.textContent = opName;
            if (headerOpVillage) {
                const lang = localStorage.getItem("waterBeaconLanguage") || "en";
                const vDisplay = (typeof window.translateVillage === "function") ? window.translateVillage(opVillage) : opVillage;
                headerOpVillage.textContent = (lang === "ta") ? `${vDisplay} நிலையம்` : `${vDisplay} Station`;
            }
            if (nameInput) nameInput.value = opName;
            loadPortalData();
        } else {
            if (authScreen) authScreen.style.display = "flex";
            if (dashboardScreen) dashboardScreen.style.display = "none";
            populateLoginVillages();
        }
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const pin = document.getElementById("login-op-pin").value.trim();
            const name = document.getElementById("login-op-name").value.trim();
            const selectedOpt = loginVillageSelect?.selectedOptions[0];
            const villageId = selectedOpt?.getAttribute("data-village-id") || "1";
            const villageName = selectedOpt?.getAttribute("data-village-name") || "Semmarikulam";
            const machineId = selectedOpt?.value || "1";
            const btn = document.getElementById("btn-login-submit");

            btn.disabled = true;

            try {
                const res = await fetch("/api/operator/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pin,
                        operator_name: name,
                        village_id: villageId,
                        village_name: villageName
                    })
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || tr("invalidCreds", "Authentication failed"));
                }

                sessionStorage.setItem("wb_operator_session", data.operator.session_token);
                sessionStorage.setItem("wb_operator_name", data.operator.name);
                sessionStorage.setItem("wb_operator_village_id", villageId);
                sessionStorage.setItem("wb_operator_village_name", villageName);
                sessionStorage.setItem("wb_operator_machine_id", machineId);

                showToast("success", tr("opToastLoginSuccess", `Signed in as ${data.operator.name}`));
                checkAuth();

            } catch (err) {
                console.error("Login error:", err);
                showToast("error", err.message || tr("invalidCreds", "Invalid Operator PIN"));
            } finally {
                btn.disabled = false;
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("wb_operator_session");
            sessionStorage.removeItem("wb_operator_name");
            sessionStorage.removeItem("wb_operator_village_id");
            sessionStorage.removeItem("wb_operator_village_name");
            sessionStorage.removeItem("wb_operator_machine_id");
            showToast("info", tr("opToastLogout", "Operator signed out."));
            checkAuth();
        });
    }

    // -------------------------------------------------------------
    // 6. Load Portal Data (Single-RO Setup)
    // -------------------------------------------------------------
    async function loadPortalData() {
        await Promise.all([
            loadSingleMachine(),
            loadCitizenReports()
        ]);

        if (currentMachine) {
            loadAuditLogs(currentMachine.id);
        }
    }

    // Load Single Machine Data
    async function loadSingleMachine() {
        try {
            const res = await fetch("/api/machines");
            if (!res.ok) return;
            allMachines = await res.json();

            const assignedMachineId = sessionStorage.getItem("wb_operator_machine_id");
            currentMachine = allMachines.find(m => String(m.id) === String(assignedMachineId)) || allMachines[0];

            if (!currentMachine && allMachines.length > 0) {
                currentMachine = allMachines[0];
            }

            if (currentMachine) {
                updateSinglePlantDisplay();
                syncControllerForm();
            }

            // Populate station controller select
            if (stationSelect) {
                stationSelect.innerHTML = allMachines.map(m => {
                    const vName = (typeof window.translateVillage === "function") ? window.translateVillage(m.village_name) : m.village_name;
                    const mName = (typeof window.translateStationName === "function") ? window.translateStationName(m.machine_name, m.village_name) : ((typeof window.translateMachine === "function") ? window.translateMachine(m.machine_name) : m.machine_name);
                    return `
                        <option value="${m.id}" data-status="${m.status}" data-level="${m.water_level_pct}" data-tds="${m.tds_level}" ${String(m.id) === String(currentMachine?.id) ? 'selected' : ''}>
                            ${vName} - ${mName}
                        </option>
                    `;
                }).join("");
            }

        } catch (e) {
            console.warn("Single machine load failed:", e);
        }
    }

    // Update the Single-RO Overview Card on Dashboard
    function updateSinglePlantDisplay() {
        if (!currentMachine) return;

        const lang = localStorage.getItem("waterBeaconLanguage") || "en";
        const vName = (typeof window.translateVillage === "function") ? window.translateVillage(currentMachine.village_name) : currentMachine.village_name;
        const distName = (typeof window.translateDistrict === "function") ? window.translateDistrict(currentMachine.district) : currentMachine.district;
        const mName = (typeof window.translateStationName === "function") ? window.translateStationName(currentMachine.machine_name, currentMachine.village_name) : ((typeof window.translateMachine === "function") ? window.translateMachine(currentMachine.machine_name) : currentMachine.machine_name);

        if (singlePlantName) singlePlantName.textContent = mName;
        if (singlePlantVillage) singlePlantVillage.textContent = `${vName} (${distName})`;
        if (headerOpVillage) {
            headerOpVillage.textContent = (lang === "ta") ? `${vName} நிலையம்` : `${vName} Station`;
        }

        const status = currentMachine.status || "AVAILABLE";
        const statusLabel = (typeof window.getStatusLabel === "function") ? window.getStatusLabel(status) : status;
        const sClass = status.toLowerCase().replace(/_/g, "-");

        if (singlePlantStatusBadge) {
            singlePlantStatusBadge.className = `status-badge ${sClass}`;
        }
        if (singlePlantStatusText) {
            singlePlantStatusText.textContent = statusLabel;
        }

        if (tilePlantStatus) {
            tilePlantStatus.textContent = statusLabel;
            tilePlantStatus.style.color = (status === "AVAILABLE") ? "#10b981" : ((status === "OUT_OF_WATER") ? "#ef4444" : "#f59e0b");
        }

        const level = currentMachine.water_level_pct || 0;
        if (tilePlantLevel) tilePlantLevel.textContent = `${level}%`;
        if (tilePlantLevelFill) tilePlantLevelFill.style.width = `${level}%`;

        const tds = currentMachine.tds_level || 110;
        if (tilePlantTds) tilePlantTds.textContent = tds;

        if (tilePlantUpdatedTime) {
            if (currentMachine.last_status_update) {
                const dateObj = new Date(currentMachine.last_status_update);
                tilePlantUpdatedTime.textContent = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
                tilePlantUpdatedTime.textContent = tr("notAvailable", "Just Now");
            }
        }

        if (tilePlantUpdatedBy) {
            const rawOp = currentMachine.operator_name || sessionStorage.getItem("wb_operator_name") || "Muthu K";
            const transOp = (typeof window.translateOperator === "function") ? window.translateOperator(rawOp) : rawOp;
            tilePlantUpdatedBy.textContent = (lang === "ta") ? `${transOp} அவர்களால்` : `By ${transOp}`;
        }
    }

    // Synchronize the Controller Form with Current Plant
    function syncControllerForm() {
        if (!currentMachine) return;

        const status = currentMachine.status || "AVAILABLE";
        const level = currentMachine.water_level_pct || 85;
        const tds = currentMachine.tds_level || 110;

        setStatusChoice(status);

        if (slider) slider.value = level;
        if (levelBadge) levelBadge.textContent = `${level}%`;
        if (tdsInput) tdsInput.value = tds;
    }

    stationSelect?.addEventListener("change", () => {
        const opt = stationSelect.selectedOptions[0];
        if (!opt) return;
        const machineId = opt.value;
        currentMachine = allMachines.find(m => String(m.id) === String(machineId)) || currentMachine;
        if (currentMachine) {
            updateSinglePlantDisplay();
            syncControllerForm();
            loadAuditLogs(currentMachine.id);
        }
    });

    // -------------------------------------------------------------
    // 7. Status & Telemetry Form Handling
    // -------------------------------------------------------------
    function setStatusChoice(status) {
        selectedStatus = status;
        statusBtns.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-status") === status);
        });

        if (currentBadge) {
            currentBadge.className = "status-badge";
            const sClass = status.toLowerCase().replace(/_/g, "-");
            currentBadge.classList.add(sClass);
            const label = (typeof window.getStatusLabel === "function") ? window.getStatusLabel(status) : status;
            currentBadge.innerHTML = `<span class="indicator"></span>${label}`;
        }
    }

    statusBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const st = btn.getAttribute("data-status");
            setStatusChoice(st);

            if (st === "AVAILABLE" && parseInt(slider.value, 10) < 50) {
                slider.value = 85;
                levelBadge.textContent = "85%";
            } else if (st === "OUT_OF_WATER") {
                slider.value = 0;
                levelBadge.textContent = "0%";
            }
        });
    });

    slider?.addEventListener("input", () => {
        if (levelBadge) levelBadge.textContent = `${slider.value}%`;
    });

    stationUpdateForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const machineId = currentMachine ? currentMachine.id : (stationSelect ? stationSelect.value : 1);
        const btn = document.getElementById("btn-broadcast-status");

        if (!machineId) return;

        btn.disabled = true;
        btn.textContent = tr("broadcastingText", "Broadcasting to Public Network...");

        try {
            const res = await fetch(`/api/machines/${machineId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: selectedStatus,
                    water_level_pct: parseInt(slider.value, 10),
                    tds_level: parseInt(tdsInput.value, 10),
                    updated_by: nameInput.value.trim() || "Panchayat Operator",
                    remarks: remarksInput.value.trim()
                })
            });

            if (!res.ok) throw new Error("Status update failed");

            // Update in-memory machine state
            if (currentMachine) {
                currentMachine.status = selectedStatus;
                currentMachine.water_level_pct = parseInt(slider.value, 10);
                currentMachine.tds_level = parseInt(tdsInput.value, 10);
                currentMachine.last_status_update = new Date().toISOString();
            }

            updateSinglePlantDisplay();
            const successMsg = tr("opToastStatusSuccess", "Machine status successfully updated and broadcasted to public portal.");
            showToast("success", successMsg);
            showBroadcastBanner("success", successMsg);
            if (remarksInput) remarksInput.value = "";

            loadAuditLogs(parseInt(machineId, 10));

        } catch (err) {
            console.error("Update error:", err);
            const errorMsg = tr("opToastStatusError", "Failed to update machine status. Please try again.");
            showToast("error", errorMsg);
            showBroadcastBanner("error", errorMsg);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span data-i18n="btnBroadcastStatus">${tr("btnBroadcastStatus", "Broadcast Status Update to Network")}</span>
            `;
        }
    });

    // -------------------------------------------------------------
    // 8. Dedicated Issues Section & Modal Logic
    // -------------------------------------------------------------
    async function loadCitizenReports() {
        try {
            const res = await fetch("/api/reports");
            if (!res.ok) return;
            allReports = await res.json();

            // Update pending badge in navigation
            const pendingCount = allReports.filter(r => r.status !== "RESOLVED").length;
            if (navIssuesBadge) {
                navIssuesBadge.textContent = pendingCount;
                navIssuesBadge.style.display = pendingCount > 0 ? "inline-block" : "none";
            }

            renderCitizenReports();

        } catch (e) {
            console.warn("Reports load failed:", e);
        }
    }

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter") || "ALL";
            renderCitizenReports();
        });
    });

    function renderCitizenReports() {
        if (!issuesGrid) return;

        let filtered = allReports;
        if (currentFilter !== "ALL") {
            filtered = allReports.filter(r => r.status === currentFilter);
        }

        if (filtered.length === 0) {
            issuesGrid.style.display = "none";
            if (issuesEmptyState) issuesEmptyState.style.display = "block";
            return;
        }

        issuesGrid.style.display = "grid";
        if (issuesEmptyState) issuesEmptyState.style.display = "none";

        issuesGrid.innerHTML = filtered.map(r => {
            const status = r.status || "PENDING";
            const sClass = status.toLowerCase();
            const statusLabel = (status === "RESOLVED") ? tr("reportStatusResolved", "Resolved")
                              : (status === "INVESTIGATING") ? tr("reportStatusInvestigating", "Investigating")
                              : tr("reportStatusPending", "Pending");

            const vName = (typeof window.translateVillage === "function") ? window.translateVillage(r.village_name) : r.village_name;
            const category = (typeof window.translateIssue === "function") ? window.translateIssue(r.issue_type) : r.issue_type;
            const desc = (typeof window.translateDescription === "function") ? window.translateDescription(r.description || "") : (r.description || tr("noDescription", "No description provided."));
            const dateStr = r.created_at ? new Date(r.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—";

            return `
                <div class="op-issue-card status-${sClass}" data-report-id="${r.id}">
                    <div>
                        <div class="op-issue-card-top">
                            <span class="op-issue-category-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <span>${category}</span>
                            </span>
                            <span class="chip-count" style="${status === 'RESOLVED' ? 'background: #dcfce7; color: #166534;' : (status === 'INVESTIGATING' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;')}">
                                ${statusLabel}
                            </span>
                        </div>

                        <p class="op-issue-card-desc">"${desc}"</p>

                        <div class="op-issue-card-meta">
                            <div><strong>${tr("thMachine", "Station")}:</strong> ${vName} - ${(typeof window.translateStationName === "function") ? window.translateStationName(r.machine_name, r.village_name) : r.machine_name}</div>
                            <div><strong>${tr("issueReportedBy", "Reported By")}:</strong> ${r.reporter_name} (${r.reporter_phone})</div>
                            <div><strong>${tr("issueDate", "Date")}:</strong> ${dateStr}</div>
                        </div>
                    </div>

                    <div class="op-issue-card-actions">
                        <button type="button" class="btn btn-outline btn-sm btn-open-issue-details" data-id="${r.id}">
                            ${tr("btnReviewIssue", "Review & Update")}
                        </button>
                        ${status === 'PENDING' ? `
                            <button type="button" class="btn btn-secondary btn-sm btn-quick-status" data-id="${r.id}" data-status="INVESTIGATING">
                                ${tr("btnMarkInvestigating", "Mark Investigating")}
                            </button>
                        ` : ''}
                        ${status !== 'RESOLVED' ? `
                            <button type="button" class="btn btn-primary btn-sm btn-quick-status" data-id="${r.id}" data-status="RESOLVED" style="background: #10b981; border-color: #10b981;">
                                ${tr("btnMarkResolved", "Mark Resolved ✓")}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join("");

        // Attach Quick Status Buttons
        issuesGrid.querySelectorAll(".btn-quick-status").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute("data-id");
                const newStatus = btn.getAttribute("data-status");
                await updateReportStatus(id, newStatus);
            });
        });

        // Attach Modal Open Handlers
        issuesGrid.querySelectorAll(".btn-open-issue-details").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.getAttribute("data-id");
                const report = allReports.find(r => String(r.id) === String(id));
                if (report) openIssueModal(report);
            });
        });

        // Also allow clicking card to open modal
        issuesGrid.querySelectorAll(".op-issue-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-report-id");
                const report = allReports.find(r => String(r.id) === String(id));
                if (report) openIssueModal(report);
            });
        });
    }

    // Modal Details Helper
    function openIssueModal(report) {
        activeModalReport = report;
        populateModalDetails(report);
        if (modalBackdrop) modalBackdrop.classList.add("active");
    }

    function closeIssueModal() {
        activeModalReport = null;
        if (modalBackdrop) modalBackdrop.classList.remove("active");
    }

    modalCloseBtn?.addEventListener("click", closeIssueModal);
    modalSecondaryCloseBtn?.addEventListener("click", closeIssueModal);
    modalBackdrop?.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeIssueModal();
    });

    function populateModalDetails(report) {
        if (!report) return;

        const vName = (typeof window.translateVillage === "function") ? window.translateVillage(report.village_name) : report.village_name;
        const category = (typeof window.translateIssue === "function") ? window.translateIssue(report.issue_type) : report.issue_type;
        const desc = (typeof window.translateDescription === "function") ? window.translateDescription(report.description || "") : (report.description || "—");
        const status = report.status || "PENDING";
        const statusLabel = (status === "RESOLVED") ? tr("reportStatusResolved", "Resolved")
                          : (status === "INVESTIGATING") ? tr("reportStatusInvestigating", "Investigating")
                          : tr("reportStatusPending", "Pending");

        if (modalIssueStation) modalIssueStation.textContent = `${vName} — ${(typeof window.translateStationName === "function") ? window.translateStationName(report.machine_name, report.village_name) : report.machine_name}`;
        if (modalIssueCategory) modalIssueCategory.textContent = category;
        if (modalIssueReporter) modalIssueReporter.textContent = report.reporter_name;
        if (modalIssuePhone) {
            modalIssuePhone.innerHTML = `<a href="tel:${report.reporter_phone}" style="color: #0284c7; text-decoration: none;">${report.reporter_phone}</a>`;
        }
        if (modalIssueDate) {
            modalIssueDate.textContent = report.created_at ? new Date(report.created_at).toLocaleString([], { dateStyle: "long", timeStyle: "short" }) : "—";
        }
        if (modalIssueDesc) modalIssueDesc.textContent = desc;

        if (modalIssueStatusBadge) {
            modalIssueStatusBadge.innerHTML = `
                <span class="chip-count" style="${status === 'RESOLVED' ? 'background: #dcfce7; color: #166534;' : (status === 'INVESTIGATING' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;')}">
                    ${statusLabel}
                </span>
            `;
        }

        // Toggle modal action buttons according to status
        if (modalBtnInvestigating) {
            modalBtnInvestigating.style.display = (status === "PENDING") ? "inline-block" : "none";
        }
        if (modalBtnResolved) {
            modalBtnResolved.style.display = (status !== "RESOLVED") ? "inline-block" : "none";
        }
        if (modalBtnReopen) {
            modalBtnReopen.style.display = (status === "RESOLVED") ? "inline-block" : "none";
        }
    }

    // Modal Status Action Click Handlers
    [modalBtnInvestigating, modalBtnResolved, modalBtnReopen].forEach(btn => {
        btn?.addEventListener("click", async () => {
            if (!activeModalReport) return;
            const newStatus = btn.getAttribute("data-action");
            const reportId = activeModalReport.id;
            await updateReportStatus(reportId, newStatus);
            closeIssueModal();
        });
    });

    // Update Report Status API Call
    async function updateReportStatus(reportId, newStatus) {
        try {
            const res = await fetch(`/api/reports/${reportId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Update report failed");

            // Update in-memory report status
            const found = allReports.find(r => String(r.id) === String(reportId));
            if (found) {
                found.status = newStatus;
            }

            showToast("success", tr("opToastReportUpdated", `Issue #${reportId} status updated to ${newStatus}.`));
            await loadCitizenReports();

        } catch (e) {
            console.error("Report status update failed:", e);
            showToast("error", tr("opToastReportError", "Failed to update issue status."));
        }
    }

    // -------------------------------------------------------------
    // 9. Audit Trail Activity Table
    // -------------------------------------------------------------
    async function loadAuditLogs(machineId = 1) {
        if (!auditTbody) return;

        try {
            const res = await fetch(`/api/machines/${machineId}/logs`);
            if (!res.ok) return;
            cachedAuditLogs = await res.json();
            renderAuditLogs();

        } catch (e) {
            console.warn("Audit logs error:", e);
        }
    }

    function renderAuditLogs() {
        if (!auditTbody) return;

        if (!cachedAuditLogs || cachedAuditLogs.length === 0) {
            auditTbody.innerHTML = `
                <tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">${tr("noAuditLogs", "No status change logs recorded yet for this station.")}</td></tr>
            `;
            return;
        }

        const lang = localStorage.getItem("waterBeaconLanguage") || "en";
        auditTbody.innerHTML = cachedAuditLogs.slice(0, 15).map(l => {
            const machText = (lang === "ta") ? `இயந்திரம் #${l.machine_id}` : `Machine #${l.machine_id}`;
            const status = l.status || "AVAILABLE";
            const sClass = status.toLowerCase().replace(/_/g, "-");
            const statusLabel = (typeof window.getStatusLabel === "function") ? window.getStatusLabel(status) : status;
            const time = l.created_at ? new Date(l.created_at).toLocaleString(lang === "ta" ? "ta-IN" : "en-US", { dateStyle: "short", timeStyle: "short" }) : "—";
            const rawOp = l.updated_by || "Operator";
            const transOp = (typeof window.translateOperator === "function") ? window.translateOperator(rawOp) : rawOp;
            const remarks = (typeof window.translateRemarks === "function") ? window.translateRemarks(l.remarks || "") : ((typeof window.translateDescription === "function") ? window.translateDescription(l.remarks || "") : (l.remarks || "—"));

            return `
                <tr>
                    <td><strong>${machText}</strong></td>
                    <td><span class="status-badge ${sClass}" style="font-size: 11px; padding: 3px 8px;"><span class="indicator"></span>${statusLabel}</span></td>
                    <td>${remarks}</td>
                    <td><strong>${transOp}</strong></td>
                    <td style="color: var(--text-muted);">${time}</td>
                </tr>
            `;
        }).join("");
    }

    refreshAuditBtn?.addEventListener("click", () => {
        const mid = currentMachine ? currentMachine.id : 1;
        loadAuditLogs(mid);
        showToast("info", tr("opToastAuditRefreshed", "Audit logs refreshed."));
    });

    // -------------------------------------------------------------
    // 10. Localized Toast & Alert System (Full 5s Longevity + Smooth Fade)
    // -------------------------------------------------------------
    let toastTimeout = null;
    let toastFadeTimeout = null;
    let bannerTimeout = null;

    function showToast(type, message) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        // Clear existing timeouts
        if (toastTimeout) clearTimeout(toastTimeout);
        if (toastFadeTimeout) clearTimeout(toastFadeTimeout);

        // Clear existing toasts
        container.querySelectorAll(".toast").forEach(t => t.remove());

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const icon = (type === "success") ? "✓" : ((type === "error") ? "✕" : "ℹ");
        toast.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.22); font-size: 15px; font-weight: 800; flex-shrink: 0;">
                ${icon}
            </div>
            <div style="flex: 1; font-size: 14px; font-weight: 600; line-height: 1.4;">
                ${message}
            </div>
            <button type="button" class="toast-close-btn" aria-label="Close notification" style="background: none; border: none; color: #ffffff; opacity: 0.8; font-size: 22px; line-height: 1; cursor: pointer; padding: 0 4px; margin-left: 8px;">
                &times;
            </button>
        `;

        let dismissed = false;
        const dismissToast = () => {
            if (dismissed) return;
            dismissed = true;
            toast.classList.remove("show");
            toastFadeTimeout = setTimeout(() => {
                toast.remove();
            }, 500);
        };

        const closeBtn = toast.querySelector(".toast-close-btn");
        closeBtn?.addEventListener("click", dismissToast);

        container.appendChild(toast);

        // Smooth slide & fade in using CSS class transition
        setTimeout(() => {
            toast.classList.add("show");
        }, 30);

        // Keep visible for a full 5.0 seconds before starting smooth fade out
        toastTimeout = setTimeout(() => {
            dismissToast();
        }, 5000);
    }

    // Helper for inline broadcast confirmation banner on the controller card
    function showBroadcastBanner(type, message) {
        const banner = document.getElementById("op-broadcast-banner");
        const bannerText = document.getElementById("op-broadcast-banner-text");
        const bannerClose = document.getElementById("btn-close-broadcast-banner");
        if (!banner || !bannerText) return;

        if (bannerTimeout) clearTimeout(bannerTimeout);

        banner.className = `op-status-alert ${type === "error" ? "error" : "success"}`;
        bannerText.textContent = message;
        banner.style.display = "flex";
        banner.style.opacity = "1";
        banner.style.transform = "translateY(0)";

        const closeBanner = () => {
            banner.style.opacity = "0";
            banner.style.transform = "translateY(-6px)";
            setTimeout(() => {
                banner.style.display = "none";
            }, 400);
        };

        bannerClose.onclick = closeBanner;

        // Keep inline banner visible for a full 5.0 seconds
        bannerTimeout = setTimeout(() => {
            closeBanner();
        }, 5000);
    }

    window.showToast = showToast;

    // Initial Authentication Verification
    checkAuth();
});
