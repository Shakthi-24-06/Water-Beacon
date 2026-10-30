async function initMaintenance() {
    const tbody = document.getElementById("maintenance-tbody");
    const emptyEl = document.getElementById("maintenance-empty");
    const tabs = document.querySelectorAll(".maint-tab-btn");

    const countAll = document.getElementById("maint-count-all");
    const countActive = document.getElementById("maint-count-active");
    const countCompleted = document.getElementById("maint-count-completed");

    const viewAllContainer = document.getElementById("maint-view-all-container");
    const viewAllBtn = document.getElementById("btn-maint-view-all");
    const viewAllText = document.getElementById("btn-maint-view-all-text");
    const viewAllBadge = document.getElementById("maint-total-badge");

    let allRecords = [];
    let currentTab = "ALL";
    let showAllLogs = false; // default: false (show only top recent log)

    function t(key, fallback = "") {
        return (typeof window.t === "function") ? window.t(key, fallback) : fallback || key;
    }

    async function loadMaintenance() {
        try {
            const res = await fetch("/api/maintenance");
            if (!res.ok) throw new Error("Could not fetch maintenance records");
            allRecords = await res.json();

            updateCounts();
            renderTable();
        } catch (err) {
            console.error("Maintenance load error:", err);
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
                            Unable to load maintenance records.
                        </td>
                    </tr>
                `;
            }
        }
    }

    function updateCounts() {
        if (!allRecords) return;
        const total = allRecords.length;
        const active = allRecords.filter(r => r.status === "OPEN" || r.status === "IN_PROGRESS").length;
        const completed = allRecords.filter(r => r.status === "COMPLETED").length;

        if (countAll) countAll.textContent = total;
        if (countActive) countActive.textContent = active;
        if (countCompleted) countCompleted.textContent = completed;
    }

    function renderTable() {
        if (!tbody) return;

        let filtered = allRecords.filter(r => {
            if (currentTab === "ACTIVE") return r.status === "OPEN" || r.status === "IN_PROGRESS";
            if (currentTab === "COMPLETED") return r.status === "COMPLETED";
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            if (viewAllContainer) viewAllContainer.style.display = "none";
            return;
        }

        if (emptyEl) emptyEl.style.display = "none";

        // View All Toggle Controls
        if (viewAllContainer) {
            if (filtered.length <= 1) {
                viewAllContainer.style.display = "none";
            } else {
                viewAllContainer.style.display = "flex";
                if (showAllLogs) {
                    viewAllBtn?.classList.add("expanded");
                    viewAllBtn?.setAttribute("aria-expanded", "true");
                    if (viewAllText) viewAllText.textContent = t("showRecentMaintOnly", "Show Recent Record Only");
                    if (viewAllBadge) viewAllBadge.style.display = "none";
                } else {
                    viewAllBtn?.classList.remove("expanded");
                    viewAllBtn?.setAttribute("aria-expanded", "false");
                    if (viewAllText) viewAllText.textContent = t("viewAllMaintRecords", "View All Maintenance Records");
                    if (viewAllBadge) {
                        viewAllBadge.textContent = filtered.length;
                        viewAllBadge.style.display = "inline-block";
                    }
                }
            }
        }

        // Show top 1 recent log unless user clicked 'View All'
        const recordsToDisplay = showAllLogs ? filtered : filtered.slice(0, 1);

        const statusMap = {
            OPEN: t("statusOpen", "Open"),
            IN_PROGRESS: t("statusInProgress", "In Progress"),
            COMPLETED: t("statusCompleted", "Completed")
        };

        tbody.innerHTML = recordsToDisplay.map(rec => {
            const sClass = (rec.status || "OPEN").toLowerCase().replace(/_/g, "-");
            const localizedStatus = statusMap[rec.status] || rec.status;
            const vName = (typeof window.translateVillage === "function") ? window.translateVillage(rec.village_name) : (rec.village_name || "Village");
            const mName = (typeof window.translateMachine === "function") ? window.translateMachine(rec.machine_name) : (rec.machine_name || "RO Unit");
            const dist = (typeof window.translateDistrict === "function") ? window.translateDistrict(rec.district) : (rec.district || "");
            const issue = (typeof window.translateIssue === "function") ? window.translateIssue(rec.issue_type) : rec.issue_type;
            const desc = (typeof window.translateDescription === "function") ? window.translateDescription(rec.description) : (rec.description || t("routineMaintenanceDesc", "Routine maintenance procedure."));
            const tech = (typeof window.translateOperator === "function") ? window.translateOperator(rec.updated_by) : (rec.updated_by || t("assignedTechnician", "Assigned Technician"));

            return `
                <tr>
                    <td class="station-cell">
                        <strong>${vName}</strong>
                        <span>${mName}${dist ? " • " + dist : ""}</span>
                    </td>

                    <td class="issue-cell">
                        <strong>${issue}</strong>
                        <p>${desc}</p>
                    </td>

                    <td>
                        <span style="font-size: 12.5px; color: var(--text-secondary);">
                            ${formatDate(rec.started_at)}
                        </span>
                    </td>

                    <td>
                        <span class="maint-status-badge ${sClass}">
                            <span class="indicator"></span>
                            ${localizedStatus}
                        </span>
                    </td>

                    <td>
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">
                            ${tech}
                        </span>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function formatDate(val) {
        if (!val) return t("notAvailable", "N/A");
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const lang = document.documentElement.lang;
        if (lang === "ta") {
            return d.toLocaleDateString("ta-IN", { month: "short", day: "numeric", year: "numeric" });
        }
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    // Toggle button click listener
    if (viewAllBtn) {
        viewAllBtn.onclick = () => {
            showAllLogs = !showAllLogs;
            renderTable();
        };
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.getAttribute("data-tab");
            showAllLogs = false; // Reset to top recent log on tab switch
            renderTable();
        });
    });

    window.reloadMaintenanceList = loadMaintenance;

    window.addEventListener("languageChanged", () => {
        renderTable();
    });

    await loadMaintenance();
}

window.initMaintenance = initMaintenance;
