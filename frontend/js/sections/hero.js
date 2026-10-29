async function initHero() {
    const villageName = document.getElementById("hero-village-name");
    const locationName = document.getElementById("hero-location-name");
    const machineName = document.getElementById("hero-machine-name");
    const machineLocation = document.getElementById("hero-machine-location");
    const statusPill = document.getElementById("hero-status-pill");
    const statusText = document.getElementById("hero-status-text");
    const waterIcon = document.getElementById("hero-water-icon");
    const waterLevel = document.getElementById("hero-water-level");
    const tdsVal = document.getElementById("hero-tds-val");
    const capacityVal = document.getElementById("hero-capacity-val");
    const lastUpdated = document.getElementById("hero-last-updated");
    const searchInput = document.getElementById("village-search");
    const searchButton = document.getElementById("search-button");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const suggestionsBox = document.getElementById("search-suggestions");

    // Stat Counters
    const statStations = document.getElementById("hero-stat-stations");
    const statUptime = document.getElementById("hero-stat-uptime");
    const statCapacity = document.getElementById("hero-stat-capacity");
    const statVillages = document.getElementById("hero-stat-villages");

    let allVillagesCache = [];

    function t(key, fallback = "") {
        return (typeof window.t === "function") ? window.t(key, fallback) : fallback || key;
    }

    function getStatusLabel(status) {
        if (typeof window.getStatusLabel === "function") {
            return window.getStatusLabel(status);
        }
        const map = {
            AVAILABLE: t("waterAvailable", "Water Available"),
            OUT_OF_WATER: t("outOfWater", "Out of Water"),
            UNDER_MAINTENANCE: t("underMaintenance", "Under Maintenance"),
            REPAIR: t("underRepair", "Under Repair"),
            TEMPORARILY_CLOSED: t("temporarilyClosed", "Temporarily Closed")
        };
        return map[status] || status || t("unknown", "Unknown");
    }

    // Number Counter Animation
    function animateValue(obj, start, end, duration, suffix = "") {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const val = Math.floor(progress * (end - start) + start);
            obj.textContent = val.toLocaleString() + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end.toLocaleString() + suffix;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Load Overall System Statistics
    async function loadStats() {
        try {
            const res = await fetch("/api/stats/overview");
            if (!res.ok) return;
            const data = await res.json();

            animateValue(statStations, 0, data.total_stations, 1200);
            animateValue(statUptime, 0, Math.round(data.system_uptime_percent), 1200, "%");
            animateValue(statCapacity, 0, data.total_capacity_liters, 1400, "L");
            animateValue(statVillages, 0, data.villages_covered, 1200);
        } catch (err) {
            console.warn("Could not load stats overview:", err);
        }
    }

    // Load Live Hero Status for Village
    async function loadHeroStatus(villageId = 1) {
        try {
            const res = await fetch(`/api/villages/${villageId}/status`);
            if (!res.ok) throw new Error("Status API returned non-OK");
            const data = await res.json();

            updateHeroUI(data);
            window.selectedVillageId = data.village_id;
        } catch (err) {
            console.error("Hero status error:", err);
            if (villageName) villageName.textContent = t("statusUnavailable", "Status Unavailable");
            if (statusText) statusText.textContent = t("offline", "Offline");
            if (statusPill) statusPill.className = "status-badge closed";
        }
    }

    function updateHeroUI(data) {
        const vName = (typeof window.translateVillage === "function") ? window.translateVillage(data.village_name) : data.village_name;
        const dist = (typeof window.translateDistrict === "function") ? window.translateDistrict(data.district) : data.district;
        const mName = (typeof window.translateMachine === "function") ? window.translateMachine(data.machine_name) : data.machine_name;
        const loc = (typeof window.translateLocation === "function") ? window.translateLocation(data.location) : (data.location || t("mainRoadLoc", "Village Main Road"));
        const stateName = (typeof window.translateState === "function") ? window.translateState(data.state) : (data.state || t("stateTamilNadu", "Tamil Nadu"));

        if (villageName) villageName.textContent = vName;
        if (locationName) locationName.textContent = `${dist}, ${stateName}`;
        if (machineName) machineName.textContent = mName;
        if (machineLocation) machineLocation.textContent = loc;
        if (lastUpdated) lastUpdated.textContent = formatTime(data.last_updated);

        // Water level %
        const level = data.water_level_pct !== null && data.water_level_pct !== undefined ? data.water_level_pct : (data.status === "AVAILABLE" ? 90 : 0);
        if (waterLevel) waterLevel.textContent = `${level}%`;

        // TDS & Capacity
        if (tdsVal) tdsVal.textContent = `${data.tds_level || 110} PPM`;
        if (capacityVal) capacityVal.textContent = `${(data.tank_capacity_liters || 5000).toLocaleString()} ${t("litersShort", "L")}`;

        // Status Badge & Classes
        if (statusPill) {
            statusPill.className = "status-badge";
            const s = (data.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
            statusPill.classList.add(s);
        }

        if (statusText) {
            statusText.textContent = getStatusLabel(data.status);
        }

        if (waterIcon) {
            waterIcon.className = "water-icon";
            const s = (data.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
            waterIcon.classList.add(s);
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
            return `${timeStr}, ${dateStr}`;
        }
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + ", " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    // Preload Villages for Instant Autocomplete
    async function preloadVillages() {
        try {
            const res = await fetch("/api/villages");
            if (res.ok) {
                allVillagesCache = await res.json();
            }
        } catch (e) {
            console.warn("Preload villages error:", e);
        }
    }

    // Autocomplete Search Input Handler
    if (searchInput && suggestionsBox) {
        let debounceTimer;

        searchInput.addEventListener("input", () => {
            const q = searchInput.value.trim().toLowerCase();
            clearSearchBtn.style.display = q ? "grid" : "none";

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (!q) {
                    suggestionsBox.style.display = "none";
                    return;
                }

                const matches = allVillagesCache.filter(v => {
                    const vNameTa = (typeof window.translateVillage === "function") ? window.translateVillage(v.name).toLowerCase() : "";
                    const distTa = (typeof window.translateDistrict === "function") ? window.translateDistrict(v.district).toLowerCase() : "";
                    const mNameTa = (typeof window.translateMachine === "function") ? window.translateMachine(v.machine_name).toLowerCase() : "";
                    return (
                        v.name.toLowerCase().includes(q) ||
                        v.district.toLowerCase().includes(q) ||
                        (v.machine_name && v.machine_name.toLowerCase().includes(q)) ||
                        vNameTa.includes(q) ||
                        distTa.includes(q) ||
                        mNameTa.includes(q)
                    );
                });

                if (matches.length === 0) {
                    suggestionsBox.innerHTML = `
                        <div class="suggestion-item" style="cursor: default;">
                            <div class="suggestion-info">
                                <span style="color: var(--text-muted);">${t("villageNotFound", "No matching station found")}</span>
                            </div>
                        </div>
                    `;
                    suggestionsBox.style.display = "block";
                    return;
                }

                suggestionsBox.innerHTML = matches.slice(0, 5).map(v => {
                    const statusClass = (v.status || "AVAILABLE").toLowerCase().replace(/_/g, "-");
                    const vName = (typeof window.translateVillage === "function") ? window.translateVillage(v.name) : v.name;
                    const dist = (typeof window.translateDistrict === "function") ? window.translateDistrict(v.district) : v.district;
                    const mName = (typeof window.translateMachine === "function") ? window.translateMachine(v.machine_name) : (v.machine_name || "RO Machine");
                    return `
                        <div class="suggestion-item" data-id="${v.id}">
                            <div class="suggestion-info">
                                <strong>${vName}</strong>
                                <span>${mName} • ${dist}</span>
                            </div>
                            <span class="status-badge ${statusClass}" style="font-size: 10.5px; padding: 3px 8px;">
                                <span class="indicator"></span>
                                ${getStatusLabel(v.status)}
                            </span>
                        </div>
                    `;
                }).join("");

                suggestionsBox.style.display = "block";

                // Click suggestion
                suggestionsBox.querySelectorAll(".suggestion-item[data-id]").forEach(item => {
                    item.addEventListener("click", () => {
                        const id = parseInt(item.getAttribute("data-id"), 10);
                        selectVillage(id);
                        suggestionsBox.style.display = "none";
                    });
                });
            }, 180);
        });

        // Close suggestions on outside click
        document.addEventListener("click", (e) => {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = "none";
            }
        });

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", () => {
                searchInput.value = "";
                clearSearchBtn.style.display = "none";
                suggestionsBox.style.display = "none";
                searchInput.focus();
            });
        }
    }

    // Select Village & Broadcast to entire page
    async function selectVillage(villageId) {
        window.selectedVillageId = villageId;
        await loadHeroStatus(villageId);

        if (typeof window.syncSelectedVillage === "function") {
            window.syncSelectedVillage(villageId);
        }

        const target = document.getElementById("status");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Search button click handler
    if (searchButton && searchInput) {
        searchButton.addEventListener("click", async () => {
            const q = searchInput.value.trim().toLowerCase();
            if (!q) {
                searchInput.focus();
                return;
            }

            const found = allVillagesCache.find(v => {
                const vNameTa = (typeof window.translateVillage === "function") ? window.translateVillage(v.name).toLowerCase() : "";
                return (
                    v.name.toLowerCase() === q ||
                    v.name.toLowerCase().startsWith(q) ||
                    vNameTa === q ||
                    vNameTa.startsWith(q)
                );
            });

            if (found) {
                selectVillage(found.id);
            } else {
                if (typeof window.showToast === "function") {
                    window.showToast("warning", t("villageNotFound", "Village not found in directory. Select below."));
                } else {
                    alert(t("villageNotFound", "Village not found in directory."));
                }
            }
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                searchButton.click();
            }
        });
    }

    // Language change refresh listener
    window.addEventListener("languageChanged", () => {
        loadHeroStatus(window.selectedVillageId || 1);
    });

    window.loadHeroStatus = loadHeroStatus;

    // Initial load
    await preloadVillages();
    await loadStats();
    await loadHeroStatus(window.selectedVillageId || 1);

    // Auto refresh every 30s
    setInterval(() => {
        loadHeroStatus(window.selectedVillageId || 1);
        loadStats();
    }, 30000);
}

window.initHero = initHero;
