async function initMaintenance() {
    const tbody = document.getElementById("maintenance-tbody");
    const emptyEl = document.getElementById("maintenance-empty");
    const tabs = document.querySelectorAll(".maint-tab-btn");

    const countAll = document.getElementById("maint-count-all");
    const countActive = document.getElementById("maint-count-active");
    const countCompleted = document.getElementById("maint-count-completed");

    let allRecords = [];
    let currentTab = "ALL";

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
            return;
        }

        if (emptyEl) emptyEl.style.display = "none";

        const statusMap = {
            OPEN: t("statusOpen", "Open"),
            IN_PROGRESS: t("statusInProgress", "In Progress"),
            COMPLETED: t("statusCompleted", "Completed")
        };

        tbody.innerHTML = filtered.map(rec => {
            const sClass = (rec.status || "OPEN").toLowerCase().replace(/_/g, "-");
            const localizedStatus = statusMap[rec.status] || rec.status;

            return `
                <tr>
                    <td class="station-cell">
                        <strong>${rec.village_name || "Village"}</strong>
                        <span>${rec.machine_name || "RO Unit"} • ${rec.district || ""}</span>
                    </td>

                    <td class="issue-cell">
                        <strong>${rec.issue_type}</strong>
                        <p>${rec.description || "Routine maintenance procedure."}</p>
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
                            ${rec.updated_by || "Assigned Technician"}
                        </span>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function formatDate(val) {
        if (!val) return "N/A";
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.getAttribute("data-tab");
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
