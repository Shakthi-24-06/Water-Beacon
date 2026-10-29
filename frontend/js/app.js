/**
 * Water Beacon - Main Application Orchestrator
 * Coordinates toasts, modals, forms, scroll reveals, and cross-section updates.
 */

// Toast Notification System
function showToast(type = "info", message = "", title = "") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        title = title || "Success";
    } else if (type === "error") {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        title = title || "Error";
    } else if (type === "warning") {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        title = title || "Notice";
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        title = title || "Information";
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4200);
}

window.showToast = showToast;

// Modal Helpers
function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
        el.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
        el.classList.remove("active");
        document.body.style.overflow = "";
    }
}

window.openModal = openModal;
window.closeModal = closeModal;

// Preload machines into a select element
async function populateMachineSelect(selectId, selectedMachineId = null, selectedVillageId = null) {
    const select = document.getElementById(selectId);
    if (!select) return;

    try {
        const res = await fetch("/api/machines");
        if (!res.ok) return;
        const machines = await res.json();

        select.innerHTML = machines.map(m => {
            const isSelected = (selectedMachineId && m.id === selectedMachineId) ||
                               (!selectedMachineId && selectedVillageId && m.village_id === selectedVillageId);
            return `
                <option value="${m.id}" data-village-id="${m.village_id}" data-status="${m.status}" data-level="${m.water_level_pct}" data-tds="${m.tds_level}" ${isSelected ? "selected" : ""}>
                    ${m.village_name} - ${m.machine_name} (${m.status})
                </option>
            `;
        }).join("");
    } catch (e) {
        console.warn("Failed to populate machine select:", e);
    }
}

// Open Operator Modal
window.openOperatorModal = async function(villageId = null, machineId = null) {
    const targetVid = villageId || window.selectedVillageId || 1;
    await populateMachineSelect("op-machine-select", machineId, targetVid);

    const select = document.getElementById("op-machine-select");
    if (select) {
        const opt = select.selectedOptions[0];
        if (opt) {
            const status = opt.getAttribute("data-status");
            const level = opt.getAttribute("data-level");
            const tds = opt.getAttribute("data-tds");

            if (status) document.getElementById("op-status-select").value = status;
            if (level) document.getElementById("op-water-level").value = level;
            if (tds) document.getElementById("op-tds-level").value = tds;
        }
    }

    openModal("modal-operator");
};

// Open Citizen Report Modal
window.openReportModal = async function(villageId = null, machineId = null) {
    const targetVid = villageId || window.selectedVillageId || 1;
    await populateMachineSelect("rep-machine-select", machineId, targetVid);
    openModal("modal-report");
};

// Open Maintenance Modal
window.openMaintenanceModal = async function(machineId = null) {
    await populateMachineSelect("maint-machine-select", machineId, window.selectedVillageId || 1);
    openModal("modal-maintenance");
};

// Setup Modal Events & Form Submissions
function setupModalsAndForms() {
    // Close modal buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close-modal");
            closeModal(modalId);
        });
    });

    // Close on backdrop click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.active").forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // 1. Submit Operator Form
    const opForm = document.getElementById("form-operator-update");
    if (opForm) {
        opForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("btn-submit-operator");
            const machineId = document.getElementById("op-machine-select").value;
            const newStatus = document.getElementById("op-status-select").value;
            const waterLevel = document.getElementById("op-water-level").value;
            const tds = document.getElementById("op-tds-level").value;
            const updatedBy = document.getElementById("op-updated-by").value;
            const remarks = document.getElementById("op-remarks").value;

            if (!machineId || !newStatus) return;

            btn.disabled = true;
            btn.textContent = "Updating...";

            try {
                const res = await fetch(`/api/machines/${machineId}/status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: newStatus,
                        water_level_pct: parseInt(waterLevel, 10),
                        tds_level: parseInt(tds, 10),
                        updated_by: updatedBy,
                        remarks: remarks
                    })
                });

                if (!res.ok) throw new Error("Status update failed");

                showToast("success", `Machine status successfully updated to ${newStatus}. Live telemetry updated across network.`);
                closeModal("modal-operator");

                // Refresh all views
                const opt = document.getElementById("op-machine-select").selectedOptions[0];
                const vid = opt ? parseInt(opt.getAttribute("data-village-id"), 10) : window.selectedVillageId;

                if (typeof window.loadWaterStatus === "function") {
                    await window.loadWaterStatus(vid || 1);
                }
                if (typeof window.loadHeroStatus === "function") {
                    await window.loadHeroStatus(vid || 1);
                }
                if (typeof window.reloadStationsGrid === "function") {
                    await window.reloadStationsGrid();
                }
                if (typeof window.reloadMaintenanceList === "function") {
                    await window.reloadMaintenanceList();
                }

            } catch (err) {
                console.error("Operator update error:", err);
                showToast("error", "Failed to update status. Please try again.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Save & Broadcast Status";
            }
        });
    }

    // 2. Submit Citizen Report Form
    const repForm = document.getElementById("form-citizen-report");
    if (repForm) {
        repForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("btn-submit-report");
            const machineId = document.getElementById("rep-machine-select").value;
            const name = document.getElementById("rep-name").value.trim();
            const phone = document.getElementById("rep-phone").value.trim();
            const issueType = document.getElementById("rep-issue-type").value;
            const desc = document.getElementById("rep-description").value.trim();

            if (!machineId || !name || !phone) return;

            btn.disabled = true;
            btn.textContent = "Submitting...";

            try {
                const res = await fetch("/api/reports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        machine_id: parseInt(machineId, 10),
                        reporter_name: name,
                        reporter_phone: phone,
                        issue_type: issueType,
                        description: desc
                    })
                });

                if (!res.ok) throw new Error("Report submission failed");
                const data = await res.json();

                showToast("success", `Report #${data.report_id} received. Local Panchayat maintenance team has been alerted.`);
                repForm.reset();
                closeModal("modal-report");

            } catch (err) {
                console.error("Report error:", err);
                showToast("error", "Unable to submit report. Please check details and try again.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Submit Report";
            }
        });
    }

    // 3. Submit Log Maintenance Form
    const maintForm = document.getElementById("form-log-maintenance");
    if (maintForm) {
        maintForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("btn-submit-maint");
            const machineId = document.getElementById("maint-machine-select").value;
            const issueType = document.getElementById("maint-issue-type").value;
            const desc = document.getElementById("maint-desc").value.trim();
            const tech = document.getElementById("maint-technician").value.trim();
            const expDate = document.getElementById("maint-expected-date").value;
            const autoStatus = document.getElementById("maint-auto-status").checked;

            if (!machineId || !issueType) return;

            btn.disabled = true;
            btn.textContent = "Logging...";

            try {
                const res = await fetch("/api/maintenance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        machine_id: parseInt(machineId, 10),
                        issue_type: issueType,
                        description: desc,
                        expected_end_at: expDate || null,
                        updated_by: tech,
                        set_machine_maintenance: autoStatus
                    })
                });

                if (!res.ok) throw new Error("Failed to create maintenance ticket");

                showToast("success", "Maintenance ticket successfully scheduled and logged.");
                maintForm.reset();
                closeModal("modal-maintenance");

                if (typeof window.reloadMaintenanceList === "function") {
                    await window.reloadMaintenanceList();
                }
                if (typeof window.reloadStationsGrid === "function") {
                    await window.reloadStationsGrid();
                }
                if (typeof window.loadWaterStatus === "function") {
                    await window.loadWaterStatus(window.selectedVillageId || 1);
                }
                if (typeof window.loadHeroStatus === "function") {
                    await window.loadHeroStatus(window.selectedVillageId || 1);
                }

            } catch (err) {
                console.error("Maintenance ticket error:", err);
                showToast("error", "Failed to schedule maintenance ticket.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Create Ticket";
            }
        });
    }

    // Footer buttons
    document.getElementById("footer-report-btn")?.addEventListener("click", () => {
        if (typeof window.openReportModal === "function") {
            window.openReportModal();
        }
    });

    document.getElementById("footer-operator-btn")?.addEventListener("click", () => {
        if (typeof window.openOperatorModal === "function") {
            window.openOperatorModal();
        }
    });

    // Back to top button
    document.getElementById("back-to-top-btn")?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Setup Scroll Reveal Animations via IntersectionObserver
function setupScrollReveal() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach(el => el.classList.add("revealed"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
    });
}

// Initialize App Orchestrator
function initApp() {
    setupModalsAndForms();
    setupScrollReveal();
}

window.initApp = initApp;
