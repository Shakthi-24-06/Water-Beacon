async function initStations() {
    const grid = document.getElementById("stations-grid");
    const emptyState = document.getElementById("stations-empty-state");
    const searchInput = document.getElementById("station-filter-search");
    const filterChips = document.querySelectorAll(".filter-chip");
    const resetBtn = document.getElementById("reset-station-filters-btn");

    const countAll = document.getElementById("count-all");
    const countAvailable = document.getElementById("count-available");
    const countMaint = document.getElementById("count-maint");
    const countEmpty = document.getElementById("count-empty");

    let allStations = [];
    let currentFilter = "ALL";
    let searchQuery = "";

    function t(key, fallback = "") {
        return (typeof window.t === "function") ? window.t(key, fallback) : fallback || key;
    }

    function getStatusLabel(status) {
        const map = {
            AVAILABLE: t("waterAvailable", "Water Available"),
            OUT_OF_WATER: t("outOfWater", "Out of Water"),
            UNDER_MAINTENANCE: t("underMaintenance", "Under Maintenance"),
            REPAIR: t("underRepair", "Under Repair"),
            TEMPORARILY_CLOSED: t("temporarilyClosed", "Temporarily Closed")
        };
        return map[status] || status || t("unknown", "Unknown");
    }

    async function loadStations() {
        try {
            const res = await fetch("/api/machines");
            if (!res.ok) throw new Error("Could not load machines");
            allStations = await res.json();

            updateCounts();
            renderGrid();
        } catch (err) {
            console.error("Stations load error:", err);
            if (grid) {
                grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                        <p>Unable to load stations list right now. Please check server connection.</p>
                    </div>
                `;
            }
        }
    }

    function updateCounts() {
        if (!allStations) return;
        const total = allStations.length;
        const avail = allStations.filter(s => s.status === "AVAILABLE").length;
        const maint = allStations.filter(s => s.status === "UNDER_MAINTENANCE" || s.status === "REPAIR").length;
        const empty = allStations.filter(s => s.status === "OUT_OF_WATER").length;

        if (countAll) countAll.textContent = total;
        if (countAvailable) countAvailable.textContent = avail;
        if (countMaint) countMaint.textContent = maint;
        if (countEmpty) countEmpty.textContent = empty;
    }

    function renderGrid() {
        if (!grid) return;

        let filtered = allStations.filter(s => {
            if (currentFilter === "AVAILABLE" && s.status !== "AVAILABLE") return false;
            if (currentFilter === "UNDER_MAINTENANCE" && s.status !== "UNDER_MAINTENANCE" && s.status !== "REPAIR") return false;
            if (currentFilter === "OUT_OF_WATER" && s.status !== "OUT_OF_WATER") return false;

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = s.village_name?.toLowerCase().includes(q);
                const matchDistrict = s.district?.toLowerCase().includes(q);
                const matchMachine = s.machine_name?.toLowerCase().includes(q);
                const matchLoc = s.location?.toLowerCase().includes(q);
                if (!matchName && !matchDistrict && !matchMachine && !matchLoc) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            grid.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        grid.innerHTML = filtered.map(station => {
            const sClass = (station.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
            const level = station.water_level_pct !== null && station.water_level_pct !== undefined
                ? station.water_level_pct
                : (station.status === "AVAILABLE" ? 85 : 0);

            return `
                <div class="station-card">
                    <div>
                        <div class="station-card-top">
                            <div class="card-title-group">
                                <h4>${station.village_name}</h4>
                                <span>${station.district}, ${station.state || "Tamil Nadu"}</span>
                            </div>
                            <span class="status-badge ${sClass}">
                                <span class="indicator"></span>
                                ${getStatusLabel(station.status)}
                            </span>
                        </div>

                        <div class="station-card-machine">
                            ${station.machine_name || "RO Unit"}
                        </div>

                        <div class="station-card-loc">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 21C16 17 19 14 19 10C19 6.134 15.866 3 12 3C8.134 3 5 6.134 5 10C5 14 8 17 12 21Z" stroke="currentColor" stroke-width="1.8"/>
                                <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/>
                            </svg>
                            <span>${station.location || "Main Road"}</span>
                        </div>

                        <!-- Tank Level Progress -->
                        <div class="card-level-progress-box">
                            <div class="card-progress-labels">
                                <span>Water Level</span>
                                <strong>${level}% (${(station.tds_level || 110)} PPM)</strong>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill ${sClass}" style="width: ${level}%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="station-card-footer">
                        <button type="button" class="btn btn-outline btn-sm btn-select-station" data-village-id="${station.village_id}" style="width: 100%;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>${t("viewStationBtn", "View Live Monitor")}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        // Attach Card Click Handlers
        grid.querySelectorAll(".btn-select-station").forEach(btn => {
            btn.addEventListener("click", () => {
                const vid = parseInt(btn.getAttribute("data-village-id"), 10);
                if (vid) {
                    window.selectedVillageId = vid;
                    if (typeof window.syncSelectedVillage === "function") {
                        window.syncSelectedVillage(vid);
                    }
                    if (typeof window.loadHeroStatus === "function") {
                        window.loadHeroStatus(vid);
                    }
                    document.getElementById("status")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    // Filter Chips Event Handlers
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentFilter = chip.getAttribute("data-filter");
            renderGrid();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchQuery = searchInput.value.trim();
            renderGrid();
        });
    }

    // Reset Filters Button
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            searchQuery = "";
            currentFilter = "ALL";
            filterChips.forEach(c => c.classList.toggle("active", c.getAttribute("data-filter") === "ALL"));
            renderGrid();
        });
    }

    window.reloadStationsGrid = loadStations;

    window.addEventListener("languageChanged", () => {
        renderGrid();
    });

    await loadStations();
}

window.initStations = initStations;
