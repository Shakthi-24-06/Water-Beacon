/**
 * Water Beacon - Dedicated Operator & Technician Console Logic
 * Authentication with Village Selector, Telemetry Overrides, Citizen Issue Tracking, and Maintenance Scheduling.
 */

document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("operator-auth-screen");
    const dashboardScreen = document.getElementById("operator-dashboard-screen");
    const loginForm = document.getElementById("form-operator-login");
    const loginVillageSelect = document.getElementById("login-op-village");
    const loginNameInput = document.getElementById("login-op-name");
    const logoutBtn = document.getElementById("btn-operator-logout");
    const headerOpName = document.getElementById("header-operator-name");
    const headerOpVillage = document.getElementById("header-operator-village");

    // Stats
    const statTotal = document.getElementById("stat-total-plants");
    const statActive = document.getElementById("stat-active-dispensing");
    const statMaint = document.getElementById("stat-under-maintenance");
    const statReports = document.getElementById("stat-citizen-reports");

    // Controller
    const stationSelect = document.getElementById("op-station-select");
    const statusBtns = document.querySelectorAll(".status-choice-btn");
    const currentBadge = document.getElementById("op-current-status-badge");
    const slider = document.getElementById("op-slider-level");
    const levelBadge = document.getElementById("op-level-badge");
    const tdsInput = document.getElementById("op-tds-input");
    const nameInput = document.getElementById("op-name-input");
    const remarksInput = document.getElementById("op-remarks-input");
    const stationUpdateForm = document.getElementById("form-op-station-update");

    // Citizen Reports
    const reportsContainer = document.getElementById("op-reports-container");
    const reportsPendingBadge = document.getElementById("badge-pending-reports");

    // Maintenance
    const maintStationSelect = document.getElementById("op-maint-machine");
    const maintForm = document.getElementById("form-op-create-maint");

    // Audit Table
    const auditTbody = document.getElementById("audit-logs-tbody");
    const refreshAuditBtn = document.getElementById("btn-refresh-audit-logs");

    let allMachines = [];
    let selectedStatus = "AVAILABLE";

    // Preload Villages into the Login Selector
    async function populateLoginVillages() {
        if (!loginVillageSelect) return;

        try {
            const res = await fetch("/api/machines");
            if (!res.ok) return;
            const machines = await res.json();
            allMachines = machines;

            loginVillageSelect.innerHTML = machines.map(m => `
                <option value="${m.id}" data-village-id="${m.village_id}" data-village-name="${m.village_name}" data-op-name="${m.operator_name || 'Panchayat Operator'}">
                    ${m.village_name} (${m.district}) — ${m.machine_name}
                </option>
            `).join("");

            // Sync operator name when village is changed
            loginVillageSelect.addEventListener("change", () => {
                const opt = loginVillageSelect.selectedOptions[0];
                if (opt && loginNameInput) {
                    const defaultOp = opt.getAttribute("data-op-name");
                    if (defaultOp) loginNameInput.value = defaultOp;
                }
            });

            // Trigger initial sync
            if (loginVillageSelect.options.length > 0) {
                const firstOpt = loginVillageSelect.options[0];
                const defaultOp = firstOpt.getAttribute("data-op-name");
                if (defaultOp && loginNameInput) loginNameInput.value = defaultOp;
            }

        } catch (e) {
            console.warn("Failed to populate login villages:", e);
        }
    }

    // 1. Check Authentication Session
    function checkAuth() {
        const token = sessionStorage.getItem("wb_operator_session");
        const opName = sessionStorage.getItem("wb_operator_name") || "Panchayat Operator";
        const opVillage = sessionStorage.getItem("wb_operator_village_name") || "Village RO Plant";

        if (token) {
            authScreen.style.display = "none";
            dashboardScreen.style.display = "block";
            if (headerOpName) headerOpName.textContent = opName;
            if (headerOpVillage) headerOpVillage.textContent = `${opVillage} Station`;
            if (nameInput) nameInput.value = opName;
            loadDashboard();
        } else {
            authScreen.style.display = "flex";
            dashboardScreen.style.display = "none";
            populateLoginVillages();
        }
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const pin = document.getElementById("login-op-pin").value.trim();
            const name = document.getElementById("login-op-name").value.trim();
            const selectedOpt = loginVillageSelect?.selectedOptions[0];
            const villageId = selectedOpt?.getAttribute("data-village-id");
            const villageName = selectedOpt?.getAttribute("data-village-name") || "Village RO Station";
            const machineId = selectedOpt?.value;
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
                    throw new Error(data.error || "Authentication failed");
                }

                sessionStorage.setItem("wb_operator_session", data.operator.session_token);
                sessionStorage.setItem("wb_operator_name", data.operator.name);
                sessionStorage.setItem("wb_operator_village_id", villageId || "1");
                sessionStorage.setItem("wb_operator_village_name", villageName);
                if (machineId) sessionStorage.setItem("wb_operator_machine_id", machineId);

                showToast("success", `Signed in as ${data.operator.name} for ${villageName} Station.`);
                checkAuth();

            } catch (err) {
                console.error("Login error:", err);
                showToast("error", err.message || "Invalid Operator PIN.");
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
            showToast("info", "Operator signed out.");
            checkAuth();
        });
    }

    // 2. Load Dashboard Data
    async function loadDashboard() {
        await Promise.all([
            loadStats(),
            loadMachines(),
            loadCitizenReports()
        ]);

        const assignedMachineId = sessionStorage.getItem("wb_operator_machine_id");
        if (assignedMachineId) {
            loadAuditLogs(parseInt(assignedMachineId, 10));
        } else if (allMachines.length > 0) {
            loadAuditLogs(allMachines[0].id);
        }
    }

    // Load Stats
    async function loadStats() {
        try {
            const res = await fetch("/api/stats/overview");
            if (!res.ok) return;
            const data = await res.json();

            if (statTotal) statTotal.textContent = data.total_stations;
            if (statActive) statActive.textContent = data.available_stations;
            if (statMaint) statMaint.textContent = data.maintenance_stations;
            if (statReports) statReports.textContent = data.community_reports_count;
        } catch (e) {
            console.warn("Stats load failed:", e);
        }
    }

    // Load Machines and Select Operator's Assigned Station
    async function loadMachines() {
        try {
            const res = await fetch("/api/machines");
            if (!res.ok) return;
            allMachines = await res.json();

            const assignedMachineId = sessionStorage.getItem("wb_operator_machine_id");

            // Populate station controller select
            if (stationSelect) {
                stationSelect.innerHTML = allMachines.map(m => `
                    <option value="${m.id}" data-status="${m.status}" data-level="${m.water_level_pct}" data-tds="${m.tds_level}" ${String(m.id) === String(assignedMachineId) ? 'selected' : ''}>
                        ${m.village_name} - ${m.machine_name} (${m.status})
                    </option>
                `).join("");

                syncSelectedStationForm();
            }

            // Populate maintenance select
            if (maintStationSelect) {
                maintStationSelect.innerHTML = allMachines.map(m => `
                    <option value="${m.id}" ${String(m.id) === String(assignedMachineId) ? 'selected' : ''}>
                        ${m.village_name} - ${m.machine_name}
                    </option>
                `).join("");
            }

        } catch (e) {
            console.warn("Machines load failed:", e);
        }
    }

    // Sync form when station selected
    function syncSelectedStationForm() {
        const opt = stationSelect?.selectedOptions[0];
        if (!opt) return;

        const status = opt.getAttribute("data-status") || "AVAILABLE";
        const level = opt.getAttribute("data-level") || 85;
        const tds = opt.getAttribute("data-tds") || 110;

        setStatusChoice(status);

        if (slider) slider.value = level;
        if (levelBadge) levelBadge.textContent = `${level}%`;
        if (tdsInput) tdsInput.value = tds;

        loadAuditLogs(parseInt(opt.value, 10));
    }

    stationSelect?.addEventListener("change", syncSelectedStationForm);

    // Status Buttons Selection
    function setStatusChoice(status) {
        selectedStatus = status;
        statusBtns.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-status") === status);
        });

        if (currentBadge) {
            currentBadge.className = "status-badge";
            const sClass = status.toLowerCase().replace(/_/g, "-");
            currentBadge.classList.add(sClass);
            currentBadge.innerHTML = `<span class="indicator"></span>${status}`;
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

    // Slider listener
    slider?.addEventListener("input", () => {
        levelBadge.textContent = `${slider.value}%`;
    });

    // 3. Submit Station Telemetry Update
    stationUpdateForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const machineId = stationSelect.value;
        const btn = document.getElementById("btn-broadcast-status");

        if (!machineId) return;

        btn.disabled = true;
        btn.textContent = "Broadcasting to Public Network...";

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

            showToast("success", `Station status updated to ${selectedStatus} (${slider.value}% water). Live public displays updated.`);
            remarksInput.value = "";

            await loadStats();
            await loadMachines();
            loadAuditLogs(parseInt(machineId, 10));

        } catch (err) {
            console.error("Update error:", err);
            showToast("error", "Failed to update station status.");
        } finally {
            btn.disabled = false;
            btn.textContent = "Broadcast Status Update to Network";
        }
    });

    // 4. Load Citizen Reports
    async function loadCitizenReports() {
        if (!reportsContainer) return;

        try {
            const res = await fetch("/api/reports");
            if (!res.ok) return;
            const reports = await res.json();

            const pending = reports.filter(r => r.status !== "RESOLVED");
            if (reportsPendingBadge) reportsPendingBadge.textContent = `${pending.length} Pending`;

            if (reports.length === 0) {
                reportsContainer.innerHTML = `
                    <p style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">
                        No citizen complaints submitted. All systems normal.
                    </p>
                `;
                return;
            }

            reportsContainer.innerHTML = reports.slice(0, 8).map(r => {
                const isResolved = r.status === "RESOLVED";
                const isInvestigating = r.status === "INVESTIGATING";

                return `
                    <div class="op-report-item">
                        <div class="op-report-item-top">
                            <div>
                                <strong>${r.village_name} - ${r.issue_type}</strong>
                                <span style="display: block; font-size: 11.5px; color: var(--text-muted);">
                                    By: ${r.reporter_name} (${r.reporter_phone})
                                </span>
                            </div>
                            <span class="chip-count" style="${isResolved ? 'background: #dcfce7; color: #166534;' : (isInvestigating ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;')}">
                                ${r.status}
                            </span>
                        </div>

                        <p>${r.description || "No description provided."}</p>

                        ${!isResolved ? `
                            <div class="op-report-actions">
                                ${!isInvestigating ? `
                                    <button type="button" class="btn btn-secondary btn-sm btn-action-report" data-id="${r.id}" data-action="INVESTIGATING">
                                        Mark Investigating
                                    </button>
                                ` : ""}
                                <button type="button" class="btn btn-outline btn-sm btn-action-report" data-id="${r.id}" data-action="RESOLVED" style="color: #10b981; border-color: #10b981;">
                                    Mark Resolved ✓
                                </button>
                            </div>
                        ` : `
                            <span style="font-size: 11.5px; color: #10b981; font-weight: 600;">✓ Resolved</span>
                        `}
                    </div>
                `;
            }).join("");

            // Attach report status handlers
            reportsContainer.querySelectorAll(".btn-action-report").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.getAttribute("data-id");
                    const status = btn.getAttribute("data-action");

                    btn.disabled = true;
                    try {
                        const rRes = await fetch(`/api/reports/${id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status })
                        });

                        if (!rRes.ok) throw new Error("Update report failed");
                        showToast("success", `Report #${id} marked as ${status}.`);
                        loadCitizenReports();
                    } catch (e) {
                        showToast("error", "Failed to update report status.");
                        btn.disabled = false;
                    }
                });
            });

        } catch (e) {
            console.warn("Reports load failed:", e);
        }
    }

    // 5. Schedule Maintenance Form
    maintForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const machineId = maintStationSelect.value;
        const task = document.getElementById("op-maint-task").value;
        const desc = document.getElementById("op-maint-desc").value.trim();
        const tech = document.getElementById("op-maint-tech").value.trim();
        const date = document.getElementById("op-maint-date").value;
        const autoFlag = document.getElementById("op-maint-auto-status").checked;
        const btn = document.getElementById("btn-create-maint");

        btn.disabled = true;

        try {
            const res = await fetch("/api/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    machine_id: parseInt(machineId, 10),
                    issue_type: task,
                    description: desc,
                    updated_by: tech,
                    expected_end_at: date || null,
                    set_machine_maintenance: autoFlag
                })
            });

            if (!res.ok) throw new Error("Maintenance creation failed");

            showToast("success", `Maintenance ticket logged: ${task}.`);
            maintForm.reset();
            await loadStats();
            await loadMachines();
        } catch (err) {
            showToast("error", "Failed to schedule maintenance ticket.");
        } finally {
            btn.disabled = false;
        }
    });

    // 6. Load Audit Logs Table
    async function loadAuditLogs(machineId = 1) {
        if (!auditTbody) return;

        try {
            const res = await fetch(`/api/machines/${machineId}/logs`);
            if (!res.ok) return;
            const logs = await res.json();

            if (logs.length === 0) {
                auditTbody.innerHTML = `
                    <tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No status change logs recorded yet for this station.</td></tr>
                `;
                return;
            }

            auditTbody.innerHTML = logs.slice(0, 15).map(l => {
                const sClass = (l.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
                const time = l.created_at ? new Date(l.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "N/A";
                return `
                    <tr>
                        <td><strong>Machine #${l.machine_id}</strong></td>
                        <td><span class="status-badge ${sClass}" style="font-size: 11px; padding: 2px 8px;"><span class="indicator"></span>${l.status}</span></td>
                        <td>${l.remarks || "—"}</td>
                        <td><strong>${l.updated_by || "Operator"}</strong></td>
                        <td style="color: var(--text-muted);">${time}</td>
                    </tr>
                `;
            }).join("");
        } catch (e) {
            console.warn("Audit logs error:", e);
        }
    }

    refreshAuditBtn?.addEventListener("click", () => {
        const mid = stationSelect ? parseInt(stationSelect.value, 10) : 1;
        loadAuditLogs(mid);
        showToast("info", "Audit logs refreshed.");
    });

    // Initial Auth Check
    checkAuth();
});
