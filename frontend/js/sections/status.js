async function initStatus() {
    const stationSelect = document.getElementById("village-station-select");
    const villageNameEl = document.getElementById("status-village-name");
    const machineNameEl = document.getElementById("status-machine-name");
    const tankWaterEl = document.getElementById("status-tank-water");
    const waterLevelEl = document.getElementById("water-level");
    const statusBox = document.getElementById("water-status");
    const statusTitleEl = document.getElementById("status-title");
    const statusMessageEl = document.getElementById("status-message");
    const statusIconBox = document.getElementById("status-icon-box");

    // Telemetry fields
    const tdsEl = document.getElementById("status-tds");
    const capacityEl = document.getElementById("status-capacity");
    const tankLitersEstEl = document.getElementById("status-tank-liters-est");
    const operatorEl = document.getElementById("status-operator");
    const operatorPhoneEl = document.getElementById("status-operator-phone");
    const updatedEl = document.getElementById("status-updated");
    const locationDetailEl = document.getElementById("status-location-detail");

    // Buttons
    const refreshBtn = document.getElementById("status-refresh-btn");
    const refreshIcon = document.getElementById("refresh-icon-svg");
    const reportIssueBtn = document.getElementById("status-report-issue-btn");

    function t(key, fallback = "") {
        return (typeof window.t === "function") ? window.t(key, fallback) : fallback || key;
    }

    // Populate Station Dropdown
    async function populateStationsDropdown() {
        try {
            const res = await fetch("/api/villages");
            if (!res.ok) return;
            const villages = await res.json();

            if (stationSelect) {
                stationSelect.innerHTML = villages.map(v => {
                    const vName = (typeof window.translateVillage === "function") ? window.translateVillage(v.name) : v.name;
                    const dist = (typeof window.translateDistrict === "function") ? window.translateDistrict(v.district) : v.district;
                    const mName = (typeof window.translateMachine === "function") ? window.translateMachine(v.machine_name) : (v.machine_name || "RO Unit");
                    return `
                        <option value="${v.id}" ${v.id === (window.selectedVillageId || 1) ? "selected" : ""}>
                            ${vName} (${dist}) - ${mName}
                        </option>
                    `;
                }).join("");

                stationSelect.addEventListener("change", (e) => {
                    const vid = parseInt(e.target.value, 10);
                    if (vid) {
                        window.selectedVillageId = vid;
                        loadWaterStatus(vid);
                        if (typeof window.loadHeroStatus === "function") {
                            window.loadHeroStatus(vid);
                        }
                    }
                });
            }
        } catch (err) {
            console.warn("Failed to populate station dropdown:", err);
        }
    }

    // SVG Icons for different statuses
    const statusIcons = {
        AVAILABLE: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `,
        OUT_OF_WATER: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
                <circle cx="12" cy="12" r="10"/>
            </svg>
        `,
        UNDER_MAINTENANCE: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
        `,
        REPAIR: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
        `,
        TEMPORARILY_CLOSED: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        `
    };

    async function loadWaterStatus(villageId = 1) {
        try {
            const res = await fetch(`/api/villages/${villageId}/status`);
            if (!res.ok) throw new Error("Could not fetch water status");
            const data = await res.json();

            updateStatusUI(data);

            if (stationSelect && stationSelect.value !== String(villageId)) {
                stationSelect.value = String(villageId);
            }
        } catch (err) {
            console.error("Water status load error:", err);
            if (statusTitleEl) statusTitleEl.textContent = t("statusUnavailable", "Status Unavailable");
            if (statusMessageEl) statusMessageEl.textContent = t("unableToConnect", "Unable to connect to server");
        }
    }

    function updateStatusUI(data) {
        const vName = (typeof window.translateVillage === "function") ? window.translateVillage(data.village_name) : data.village_name;
        const mName = (typeof window.translateMachine === "function") ? window.translateMachine(data.machine_name) : data.machine_name;
        const loc = (typeof window.translateLocation === "function") ? window.translateLocation(data.location) : (data.location || t("mainRoadLoc", "Main Road"));
        const dist = (typeof window.translateDistrict === "function") ? window.translateDistrict(data.district) : data.district;
        const opName = (typeof window.translateOperator === "function") ? window.translateOperator(data.operator_name) : (data.operator_name || t("defaultOperatorTitle", "Local Panchayat Operator"));

        if (villageNameEl) villageNameEl.textContent = vName;
        if (machineNameEl) machineNameEl.textContent = mName;
        if (tdsEl) tdsEl.textContent = `${data.tds_level || 110} PPM`;

        const capacity = data.tank_capacity_liters || 5000;
        if (capacityEl) capacityEl.textContent = `${capacity.toLocaleString()} ${t("litersUnit", "Liters")}`;

        const pct = data.water_level_pct !== null && data.water_level_pct !== undefined
            ? data.water_level_pct
            : (data.status === "AVAILABLE" ? 85 : 0);

        if (waterLevelEl) waterLevelEl.textContent = `${pct}%`;

        const estLiters = Math.round((pct / 100) * capacity);
        if (tankLitersEstEl) tankLitersEstEl.textContent = `${t("approxInTank", "Approx.")} ${estLiters.toLocaleString()} ${t("litersShort", "L")} ${t("inTankText", "in tank")}`;

        if (operatorEl) operatorEl.textContent = opName;
        if (operatorPhoneEl) {
            const phone = data.operator_phone || "+91 94421 88200";
            operatorPhoneEl.textContent = phone;
            operatorPhoneEl.href = `tel:${phone.replace(/\s+/g, "")}`;
        }

        if (locationDetailEl) locationDetailEl.textContent = `${loc}, ${dist}`;
        if (updatedEl) updatedEl.textContent = formatTime(data.last_updated);

        if (tankWaterEl) {
            tankWaterEl.style.height = `${Math.max(6, Math.min(100, pct))}%`;
            tankWaterEl.className = "tank-water";
            const sClass = (data.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
            tankWaterEl.classList.add(sClass);
        }

        if (statusBox) {
            statusBox.className = "status-result";
            const sClass = (data.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
            statusBox.classList.add(sClass);
        }

        if (data.status === "AVAILABLE") {
            statusTitleEl.textContent = t("waterAvailable", "WATER AVAILABLE");
            statusMessageEl.textContent = t("waterAvailableMessage", "Drinking water is safe, pure, and currently dispensing.");
            statusIconBox.innerHTML = statusIcons.AVAILABLE;
        } else if (data.status === "OUT_OF_WATER") {
            statusTitleEl.textContent = t("outOfWater", "OUT OF WATER");
            statusMessageEl.textContent = t("outOfWaterMessage", "The raw water supply is empty. Refill is scheduled.");
            statusIconBox.innerHTML = statusIcons.OUT_OF_WATER;
        } else if (data.status === "UNDER_MAINTENANCE") {
            statusTitleEl.textContent = t("underMaintenance", "UNDER MAINTENANCE");
            statusMessageEl.textContent = t("maintenanceMessage", "Scheduled filter replacement and UV sanitization in progress.");
            statusIconBox.innerHTML = statusIcons.UNDER_MAINTENANCE;
        } else if (data.status === "REPAIR") {
            statusTitleEl.textContent = t("underRepair", "UNDER REPAIR");
            statusMessageEl.textContent = t("repairMessage", "A technician is repairing the high-pressure booster pump.");
            statusIconBox.innerHTML = statusIcons.REPAIR;
        } else if (data.status === "TEMPORARILY_CLOSED") {
            statusTitleEl.textContent = t("temporarilyClosed", "TEMPORARILY CLOSED");
            statusMessageEl.textContent = t("closedMessage", "This RO station is closed for village power grid maintenance.");
            statusIconBox.innerHTML = statusIcons.TEMPORARILY_CLOSED;
        }
    }

    function formatTime(val) {
        if (!val) return t("justNow", "Just now");
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const lang = document.documentElement.lang;
        if (lang === "ta") {
            const timeStr = d.toLocaleTimeString("ta-IN", { hour: "2-digit", minute: "2-digit" });
            const dateStr = d.toLocaleDateString("ta-IN", { month: "short", day: "numeric" });
            return `${timeStr} (${dateStr})`;
        }
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " (" + d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ")";
    }

    if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
            refreshIcon?.classList.add("spin");
            refreshBtn.disabled = true;

            await loadWaterStatus(window.selectedVillageId || 1);
            if (typeof window.loadHeroStatus === "function") {
                await window.loadHeroStatus(window.selectedVillageId || 1);
            }

            setTimeout(() => {
                refreshIcon?.classList.remove("spin");
                refreshBtn.disabled = false;
                if (typeof window.showToast === "function") {
                    window.showToast("success", t("statusRefreshedToast", "Water status refreshed with live server telemetry."));
                }
            }, 600);
        });
    }

    if (reportIssueBtn) {
        reportIssueBtn.addEventListener("click", () => {
            if (typeof window.openReportModal === "function") {
                window.openReportModal(window.selectedVillageId || 1);
            }
        });
    }

    window.syncSelectedVillage = function(villageId) {
        loadWaterStatus(villageId);
    };

    window.loadWaterStatus = loadWaterStatus;

    window.addEventListener("languageChanged", () => {
        populateStationsDropdown();
        loadWaterStatus(window.selectedVillageId || 1);
    });

    await populateStationsDropdown();
    await loadWaterStatus(window.selectedVillageId || 1);
}

window.initStatus = initStatus;
