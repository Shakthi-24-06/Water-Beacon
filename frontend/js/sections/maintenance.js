async function initMaintenance() {
    const tbody = document.getElementById("maintenance-tbody");
    const emptyEl = document.getElementById("maintenance-empty");
    const tabs = document.querySelectorAll(".maint-tab-btn");
    const openNewBtn = document.getElementById("open-new-maintenance-btn");

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
                        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
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

        tbody.innerHTML = filtered.map(rec => {
            const sClass = (rec.status || "OPEN").toLowerCase().replace(/_/g, "-");
            const canResolve = rec.status !== "COMPLETED";

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
                            ${rec.status}
                        </span>
                    </td>

                    <td>
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">
                            ${rec.updated_by || "Assigned Technician"}
                        </span>
                    </td>

                    <td>
                        ${canResolve ? `
                            <button type="button" class="btn btn-outline btn-sm btn-resolve-maint" data-id="${rec.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>${t("markDone", "Mark Resolved")}</span>
                            </button>
                        ` : `
                            <span style="font-size: 12px; color: #10b981; font-weight: 600;">
                                ✓ Resolved
                            </span>
                        `}
                    </td>
                </tr>
            `;
        }).join("");

        // Attach Resolve Handlers
        tbody.querySelectorAll(".btn-resolve-maint").forEach(btn => {
            btn.addEventListener("click", async () => {
                const recId = btn.getAttribute("data-id");
                if (!recId) return;

                btn.disabled = true;
                try {
                    const res = await fetch(`/api/maintenance/${recId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "COMPLETED" })
                    });

                    if (!res.ok) throw new Error("Failed to update ticket");

                    if (typeof window.showToast === "function") {
                        window.showToast("success", `Maintenance ticket #${recId} marked as completed.`);
                    }

                    await loadMaintenance();

                    // Refresh stations grid and live monitor
                    if (typeof window.reloadStationsGrid === "function") {
                        window.reloadStationsGrid();
                    }
                    if (typeof window.loadWaterStatus === "function") {
                        window.loadWaterStatus(window.selectedVillageId || 1);
                    }
                    if (typeof window.loadHeroStatus === "function") {
                        window.loadHeroStatus(window.selectedVillageId || 1);
                    }
                } catch (err) {
                    console.error("Resolve error:", err);
                    btn.disabled = false;
                    if (typeof window.showToast === "function") {
                        window.showToast("error", "Failed to resolve ticket. Please try again.");
                    }
                }
            });
        });
    }

    function formatDate(val) {
        if (!val) return "N/A";
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }

    // Tabs Event Handlers
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.getAttribute("data-tab");
            renderTable();
        });
    });

    // Open Log Maintenance Modal
    if (openNewBtn) {
        openNewBtn.addEventListener("click", () => {
            if (typeof window.openMaintenanceModal === "function") {
                window.openMaintenanceModal();
            }
        });
    }

    window.reloadMaintenanceList = loadMaintenance;

    // Language Change Listener
    window.addEventListener("languageChanged", () => {
        renderTable();
    });

    await loadMaintenance();
}

window.initMaintenance = initMaintenance;
