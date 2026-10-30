const translations = {
    en: {
        // Navbar
        home: "Home",
        waterStatus: "Water Status",
        exploreStations: "All Stations",
        maintenance: "Maintenance",
        howItWorks: "How It Works",
        about: "About",
        operatorMode: "Operator Portal",
        updateStatus: "Update Station",

        // Hero
        liveMonitoring: "LIVE RO WATER MONITORING",
        knowBefore: "Know Before,",
        youGo: "You Go...",
        heroTitle: "Know Before, You Go...",
        heroDescription: "Check real-time RO drinking water availability in your village before leaving home. Reliable, community-driven, and updated live by local operators.",
        villagePlaceholder: "Enter your village",
        checkAvailability: "Check availability",
        checking: "Checking...",
        villageFocused: "Village-focused",
        builtForCommunities: "Built for local communities",
        currentStatus: "CURRENT STATUS",
        roMachine: "RO MACHINE",
        lastUpdated: "Last updated",
        liveUpdates: "Live updates",
        updatedByOperator: "Updated by operator",
        readyForCollection: "Ready for collection",
        waterLevel: "water level",
        totalStations: "RO Stations",
        uptimeRate: "System Uptime",
        capacityLitres: "Liters Capacity",
        villagesCovered: "Villages Covered",

        // Status
        liveWaterStatus: "LIVE WATER STATUS",
        waterAvailability: "Water availability",
        atAGlance: "at a glance.",
        statusDescription: "Live water volume, purification status, and telemetry from your village RO station.",
        roWaterStation: "RO WATER STATION",
        selectVillagePrompt: "Select Village RO Station:",
        waterLevelLabel: "Water Tank Level",
        tdsLabel: "Water Quality (TDS)",
        tdsSubtext: "PPM (Pure Drinking Standard)",
        capacityLabel: "Storage Capacity",
        location: "LOCATION",
        district: "DISTRICT",
        operatorLabel: "LOCAL OPERATOR",
        lastUpdatedLabel: "LAST UPDATED",
        refreshStatusBtn: "Refresh Live Status",
        reportIssueBtn: "Report Water Issue",
        updateStatusBtn: "Operator Status Update",

        // Status Outcomes
        waterAvailable: "WATER AVAILABLE",
        waterAvailableMessage: "Drinking water is safe, pure, and currently dispensing.",
        outOfWater: "OUT OF WATER",
        outOfWaterMessage: "The raw water supply is empty. Refill is scheduled.",
        underMaintenance: "UNDER MAINTENANCE",
        maintenanceMessage: "Scheduled filter replacement and UV sanitization in progress.",
        underRepair: "UNDER REPAIR",
        repairMessage: "A technician is repairing the high-pressure booster pump.",
        temporarilyClosed: "TEMPORARILY CLOSED",
        closedMessage: "This RO station is closed for village power grid maintenance.",

        // Status Helpers
        statusUnavailable: "Status unavailable",
        unableToConnect: "Unable to connect to server",
        offline: "Offline",
        unknown: "Unknown",
        serverConnectionError: "Unable to reach water server",
        machineUnavailable: "Machine offline",
        locationUnavailable: "Location not listed",
        villageNotFound: "Village not found in directory. Try selecting from the Stations list below.",
        searchError: "Error searching for village. Please try again.",

        // Stations Explorer
        explorerTitle: "RO Stations Directory",
        explorerSubtitle: "Browse, filter, and monitor all community water plants across the district.",
        searchStationInput: "Search by village, machine name, or locality...",
        filterAll: "All Stations",
        filterAvailable: "Available",
        filterMaintenance: "Maintenance",
        filterOutOfWater: "Out of Water",
        exportCsvBtn: "Download Status CSV",
        viewStationBtn: "View Live Monitor",

        // Maintenance Section
        maintenanceTitle: "Active Maintenance & Repairs",
        maintenanceSubtitle: "Transparent service logs, membrane replacement cycles, and repair tracking.",
        logMaintenanceBtn: "Log Maintenance Ticket",
        filterAllTickets: "All Records",
        filterActiveTickets: "Active / Open",
        filterCompletedTickets: "Completed",
        issueTypeCol: "Issue / Task",
        machineCol: "Station / Village",
        startedCol: "Reported Date",
        statusCol: "Service Status",
        technicianCol: "Assigned Tech",
        actionCol: "Action",
        markDone: "Mark Resolved",
        viewAllMaintRecords: "View All Maintenance Records",
        showRecentMaintOnly: "Show Recent Record Only",

        // How It Works
        howItWorksTitle: "How It Works",
        howItWorksSubtitle: "Know the water status before you visit the RO station.",
        step1Title: "Search your village",
        step1Desc: "Enter your village name or pick your local station from the directory.",
        step2Title: "Check water status & purity",
        step2Desc: "See whether the plant has water, check the tank level %, and verify TDS purity.",
        step3Title: "Plan your collection",
        step3Desc: "Visit the RO station with confidence when drinking water is dispensing.",
        simpleReliable: "Simple. Local. Reliable.",
        reliableDesc: "Telemetry and status information verified by village Panchayat operators.",

        // About
        aboutTitle: "About Water Beacon",
        aboutDescription: "Water Beacon is a community-first water intelligence platform helping rural and semi-urban households track RO water availability without wasted trips.",
        feature1Title: "Check Before You Go",
        feature1Desc: "Avoid long walks and empty queues in the hot sun by knowing station status beforehand.",
        feature2Title: "Verified Local Updates",
        feature2Desc: "Village Panchayat operators and technicians keep status logs and maintenance tickets up to date.",
        feature3Title: "Community Reporting",
        feature3Desc: "Citizens can report leaks, pressure drops, or taste issues directly to maintenance teams.",

        // Footer
        footerTagline: "Smart Community RO Water Monitoring System",
        footerRights: "Water Beacon. Built for public community welfare and clean water access.",
        emergencyHelpline: "District Water Helpline: 1800-425-1000",
        quickLinks: "Quick Links",
        waterInitiative: "Tamil Nadu Rural Clean Water Initiative",

        // Modals
        reportModalTitle: "Report an Issue / Water Problem",
        reportModalDesc: "Notify the local maintenance team about RO machine faults, leaks, or water taste issues.",
        operatorModalTitle: "Operator Status Update Portal",
        operatorModalDesc: "Panchayat Operators: Update the live dispensing status and tank water levels.",
        maintModalTitle: "Log Maintenance Ticket",
        maintModalDesc: "Schedule preventative filter changes, UV bulb repairs, or pump maintenance.",
        submitBtn: "Submit",
        cancelBtn: "Cancel",
        saveChangesBtn: "Save & Broadcast Status",

        // Additional labels for forms & status badges
        roLocation: "RO Station Location",
        yourFullName: "Your Full Name",
        contactPhone: "Contact Phone Number",
        issueCategory: "Issue Category",
        detailedDescription: "Detailed Description",
        statusOpen: "Open",
        statusInProgress: "In Progress",
        statusCompleted: "Completed",

        // About Section
        makingWater: "Making water",
        accessEasier: "access easier.",
        smartNetworkTitle: "Smart Village RO Network",
        smartNetworkDesc: "Real-time status tracking, automated water telemetry, and transparent maintenance logs for public health and water accessibility.",
        openCitizenTelemetry: "Open Citizen Telemetry",

        // Footer
        supportEmergency: "Support & Emergency",
        dispensingHoursLabel: "Dispensing Hours:",
        dispensingHoursTime: "6:00 AM – 9:00 PM Daily",
        operatorAccessBtn: "Operator Access →",
        backToTop: "Top",

        // Hero Telemetry Badges
        tdsPurityLabel: "TDS PURITY",
        tankCapacityLabel: "TANK CAPACITY",

        // Status Details & Telemetry
        litersUnit: "Liters",
        litersShort: "L",
        inTankText: "in tank",
        approxInTank: "Approx.",
        defaultOperatorTitle: "Local Panchayat Operator",
        mainRoadLoc: "Village Main Road",
        justNow: "Just now",

        // Stations Directory
        noStationsMatch: "No stations match your filter",
        tryAnotherSearch: "Try searching with another village name or clearing your status filter.",
        resetFiltersBtn: "Reset Filters",

        // Maintenance Section
        allSystemsOperational: "All Systems Operational",
        noOpenTickets: "No open maintenance tickets found for this filter.",
        routineMaintenanceDesc: "Routine filtration check and maintenance procedure.",
        assignedTechnician: "Assigned Technician",

        // Modal Form Options & Placeholders
        issueLowPressure: "Low Water Flow / Pressure Drop",
        issueTasteOdor: "Strange Taste / High Salinity / Odor",
        issueTapLeak: "Dispenser Tap Leakage / Spillage",
        issueCardMachine: "Smart Card / Token Reader Error",
        issuePowerOutage: "RO Station Power Failure",
        issueOther: "Other Operational Issue",
        namePlaceholder: "e.g. Ramesh Kumar",
        phonePlaceholder: "e.g. 94420 00000",
        descPlaceholder: "Please describe what you observed at the station...",
        stateTamilNadu: "Tamil Nadu",
        howItWorksLead: "Water Beacon helps you check your village RO water availability and purification quality before you leave home.",
        brandTitle: "Water Beacon",
        brandWater: "Water",
        brandBeacon: "Beacon",
        operatorPortalBrand: "Water Beacon",
        avatarTN: "TN",
        avatarRO: "RO",
        toastSuccess: "Success",
        toastError: "Error",
        toastNotice: "Notice",
        toastInfo: "Information",
        submittingBtn: "Submitting...",
        reportSuccessToast: "Report received. Local Panchayat maintenance team has been alerted.",
        reportErrorToast: "Unable to submit report. Please check details and try again.",
        statusRefreshedToast: "Water status refreshed with live server telemetry.",
        notAvailable: "N/A",
        // Entry / Welcome Page
        entryHeadline: "Smart Water Monitoring for Every Community",
        entrySubtitle: "Check RO water availability before you travel. Stay informed about your nearest community RO water stations.",
        entryTag: "PANCHAYAT WATER INTELLIGENCE PLATFORM",
        publicAccessTitle: "Public Access",
        publicAccessDesc: "Check nearby RO stations and real-time water availability.",
        continuePublicBtn: "Continue as Public User",
        featNoLogin: "No login required",
        featViewStations: "View RO stations",
        featCheckAvail: "Check water availability",
        featViewLevels: "View water levels",
        featCheckUpdated: "Check the last updated time",
        featSearchFilter: "Search and filter stations by village",
        featAllPublicInfo: "Access all public information",
        
        adminAccessTitle: "Admin / Operator Access",
        adminAccessDesc: "Secure access to manage RO stations, update water availability, and monitor maintenance.",
        adminLoginBtn: "Admin / Operator Login",
        featSecureAuth: "Secure authentication",
        featManageStations: "Manage RO stations",
        featUpdateStatus: "Update water status",
        featUpdateLevels: "Update water levels",
        featManageMaint: "Manage maintenance records",
        featStationHistory: "View station history",
        
        howWorksTitle: "How Water Beacon Works",
        howWorksSubtitle: "Simple 3-step community drinking water verification before you travel.",
        step1Title: "1. Find Your RO Station",
        step1Desc: "Search for your village or nearby RO station.",
        step2Title: "2. Check Water Availability",
        step2Desc: "View whether water is available, empty, or under maintenance.",
        step3Title: "3. Visit with Confidence",
        step3Desc: "Travel only after checking the latest station status.",
        
        whyTitle: "Why Water Beacon?",
        whySubtitle: "Engineered for transparent rural drinking water governance.",
        whyFeature1Title: "Real-Time Water Status",
        whyFeature1Desc: "Verified station status, purity (TDS), and water tank levels updated promptly by operators.",
        whyFeature2Title: "Easy Station Search",
        whyFeature2Desc: "Instant search across all villages, districts, and local community RO units.",
        whyFeature3Title: "Tamil and English Support",
        whyFeature3Desc: "Full bilingual system localization designed for rural villagers and operators alike.",
        whyFeature4Title: "Updated Maintenance Information",
        whyFeature4Desc: "Transparent service logs, scheduled filter changes, and booster pump repairs.",
        whyFeature5Title: "Simple and Accessible Interface",
        whyFeature5Desc: "Fast, lightweight mobile interface optimized for rural internet connectivity.",
        whyFeature6Title: "Community-Focused Monitoring",
        whyFeature6Desc: "Citizen reporting channel allows villagers to alert maintenance teams directly.",
        
        aboutIntroTitle: "About Water Beacon",
        aboutIntroDesc: "Water Beacon helps people check community RO water availability before travelling to a water station. By bridging local Panchayat operators and citizens through accessible telemetry, we prevent unnecessary travel and ensure equitable drinking water access across rural communities.",

        // Admin Login
        adminPortalTitle: "Admin & Operator Portal",
        adminPortalSubtitle: "Sign in with your authorized credentials to manage community RO stations",
        usernameLabel: "Username",
        passwordLabel: "Password",
        orQuickPin: "Or Quick PIN Access",
        enterPinPlaceholder: "Operator Access PIN",
        usernamePlaceholder: "e.g. admin or operator",
        passwordPlaceholder: "Enter your password",
        loginSubmitBtn: "Sign In to Dashboard",
        returnWelcomeBtn: "Return to Welcome Page",
        demoCredentialsLabel: "Authorized Access",
        adminDemo: "Restricted administrative console",
        operatorDemo: "Enter your assigned operator PIN",
        invalidCreds: "Invalid credentials. Please verify your username and password or PIN.",
        loginSuccess: "Signed in successfully!",
        loggingIn: "Authenticating...",

        // Admin & Operator Dashboard
        adminDashboardTitle: "Water Beacon Control Center",
        dashboardSubtitle: "Panchayat RO Drinking Water Network Administration",
        tabTelemetry: "Live Station Controller",
        tabStations: "Station Management",
        tabUsers: "Operator Accounts",
        tabMaintenance: "Maintenance Scheduler",
        tabReports: "Citizen Reports",
        tabAudit: "Station Audit Trail",
        roleAdmin: "ADMINISTRATOR (District Level)",
        roleOperator: "FIELD OPERATOR (Station Level)",
        btnAddNewStation: "Add New RO Station",
        btnAddNewUser: "Add New Operator",
        btnSaveStation: "Save Station",
        btnDeleteStation: "Delete Station",
        btnEdit: "Edit",
        btnDelete: "Delete",
        btnSignOut: "Sign Out",
        btnPublicView: "Public Website",
        allStationsNotice: "District Administrator Mode: Full control across all village stations and operators.",
        assignedStationNotice: "Field Operator Mode: Restricted to your assigned Panchayat water station.",
        statTotalStations: "Total Stations",
        statDispensingActive: "Dispensing (Active)",
        statUnderMaint: "Under Maintenance",
        statPendingReports: "Citizen Issues",
        stationNameLabel: "RO Station Name",
        villageNameLabel: "Village Name",
        districtLabel: "District",
        localityLabel: "Locality / Address",
        tankCapacityLiters: "Tank Capacity (Liters)",
        initialWaterLevel: "Water Level (%)",
        initialTds: "Water Purity TDS (PPM)",
        operatorNameLabel: "Operator Full Name",
        operatorPhoneLabel: "Operator Phone Number",
        roleLabel: "User Role",
        assignedVillageLabel: "Assigned Village Station",
        actionCol: "Actions",
        statusCol: "Status",
        lastUpdatedCol: "Last Updated",
        confirmDeleteStation: "Are you sure you want to delete this RO station? All associated status logs and records will be deleted.",
        confirmDeleteUser: "Are you sure you want to delete this operator account?",
        stationSavedSuccess: "Station details saved successfully.",
        stationDeletedSuccess: "Station deleted successfully.",
        userSavedSuccess: "Operator account saved successfully.",
        userDeletedSuccess: "Operator account removed.",
        errorSavingStation: "Error saving station. Please check required fields.",
        errorSavingUser: "Error saving user account.",
        statusUpdatedSuccess: "Status update broadcasted to network successfully.",
        maintScheduledSuccess: "Maintenance ticket scheduled successfully.",
        reportUpdatedSuccess: "Report status updated successfully.",
        noAssignedStations: "No stations assigned to your account.",
        filterRoleAll: "All Roles",
        filterRoleAdmin: "Administrators",
        filterRoleOperator: "Operators",
        selectRolePrompt: "Select Role",
        selectVillagePromptAdmin: "Select Village (Leave empty for Admin)",
        unassignedVillage: "None (District Admin)",
        passwordLeaveBlankHint: "(Leave blank to keep existing password)",
        reportStatusPending: "Pending Review",
        reportStatusInvestigating: "Investigating",
        reportStatusResolved: "Resolved",

        // Operator Portal - Header & Nav
        operatorConsoleTag: "Field Operator Console",
        opNavDashboard: "Dashboard",
        opNavIssues: "Issues",
        publicViewBtn: "Public View",
        signOutBtn: "Sign Out",

        // Operator Portal - Single Plant Overview
        opPlantOverviewTitle: "Village RO Water Plant Overview",
        opCurrentAvailability: "Machine Availability",
        opTankLevel: "Overhead Tank Level",
        opWaterPurity: "Water Purity (TDS)",
        opLastUpdatedTime: "Last Status Updated",
        opPlantLocation: "Plant Location",

        // Operator Portal - Telemetry Controller
        opUpdateControllerTitle: "Live Station Telemetry & Status Controller",
        opUpdateControllerSubtitle: "Broadcast immediate status updates to citizen portals and displays.",
        opSelectMachineLabel: "Select Village RO Machine",
        opSetStatusLabel: "Set Live Dispensing Status",
        statusAvailable: "AVAILABLE",
        statusOutOfWater: "OUT OF WATER",
        statusMaintenance: "MAINTENANCE",
        statusRepair: "REPAIR",
        statusClosed: "CLOSED",
        opTankLevelLabel: "Overhead Tank Water Level (%)",
        opTdsPurityLabel: "Water Purity TDS (PPM)",
        opLoggedByLabel: "Logged By (Operator Name)",
        opRemarksLabel: "Status Reason / Operator Notes",
        opRemarksPlaceholder: "e.g. Regular morning filtration cycle completed. Water tank full.",
        btnBroadcastStatus: "Broadcast Status Update to Network",
        broadcastingText: "Broadcasting to Public Network...",

        // Operator Portal - Recent Activity / Audit Log
        opRecentActivityTitle: "Recent Machine Status Activity (Audit Trail)",
        refreshLogs: "Refresh Logs",
        thMachine: "Station / Machine",
        thStatusSet: "Status Set",
        thRemarks: "Remarks / Reason",
        thLoggedBy: "Logged By",
        thTimestamp: "Timestamp",
        noAuditLogs: "No status change logs recorded yet for this station.",

        // Operator Portal - Dedicated Issues Section
        opIssuesPageTitle: "Citizen Reported Issues",
        opIssuesPageSubtitle: "Review, investigate, and resolve drinking water complaints submitted by community residents.",
        filterAll: "All Issues",
        filterPending: "Pending",
        filterInvestigating: "Investigating",
        filterResolved: "Resolved",
        noIssuesTitle: "No Citizen Issues Reported",
        noIssuesSubtitle: "All community RO water dispensing operations are running smoothly without any reported complaints.",
        btnReviewIssue: "Review & Update",
        btnMarkInvestigating: "Mark Investigating",
        btnMarkResolved: "Mark Resolved ✓",
        btnReopenIssue: "Reopen Issue",
        issueReportedBy: "Reported By",
        issuePhone: "Phone",
        issueDate: "Reported Date",
        issueCategory: "Category",
        issueDescription: "Description",
        issueStatus: "Status",
        issueDetailsModalTitle: "Citizen Issue Details & Status Resolution",
        closeBtn: "Close",

        // Operator Portal - Dynamic Toasts & Alerts
        opToastLoginSuccess: "Signed in successfully as Panchayat Operator.",
        opToastLogout: "Operator signed out successfully.",
        opToastStatusSuccess: "Machine status successfully updated and broadcasted to public portal.",
        opToastStatusError: "Failed to update machine status. Please try again.",
        opToastReportUpdated: "Issue status updated successfully.",
        opToastReportError: "Failed to update issue status.",
        opToastAuditRefreshed: "Recent activity logs refreshed."


    },

    ta: {
        // Navbar
        home: "முகப்பு",
        waterStatus: "குடிநீர் நிலை",
        exploreStations: "அனைத்து நிலையங்கள்",
        maintenance: "பராமரிப்பு",
        howItWorks: "எப்படி செயல்படுகிறது",
        about: "எங்களைப் பற்றி",
        operatorMode: "பணியாளர் தளம்",
        updateStatus: "நிலையை மாற்று",

        // Hero
        liveMonitoring: "நேரடி RO குடிநீர் கண்காணிப்பு",
        knowBefore: "செல்வதற்கு முன்,",
        youGo: "தெரிந்துகொள்ளுங்கள்...",
        heroTitle: "செல்வதற்கு முன் தெரிந்துகொள்ளுங்கள்...",
        heroDescription: "வீட்டை விட்டு புறப்படுவதற்கு முன் உங்கள் கிராமத்தில் RO குடிநீர் கிடைப்பதை நேரடியாக சரிபார்க்கவும். உள்ளூர் பணியாளர்களால் நம்பகமாக புதுப்பிக்கப்படுகிறது.",
        villagePlaceholder: "உங்கள் கிராமத்தின் பெயரை உள்ளிடவும்",
        checkAvailability: "நிலையை சரிபார்க்கவும்",
        checking: "சரிபார்க்கிறது...",
        villageFocused: "கிராமங்களை மையமாகக் கொண்டது",
        builtForCommunities: "உள்ளூர் சமூகங்களுக்காக உருவாக்கப்பட்டது",
        currentStatus: "தற்போதைய நிலை",
        roMachine: "RO இயந்திரம்",
        lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
        liveUpdates: "நேரடி புதுப்பிப்புகள்",
        updatedByOperator: "பணியாளரால் புதுப்பிக்கப்பட்டது",
        readyForCollection: "தண்ணீர் பெற தயாராக உள்ளது",
        waterLevel: "தண்ணீர் அளவு",
        totalStations: "RO நிலையங்கள்",
        uptimeRate: "இயக்க நேரம்",
        capacityLitres: "கொள்ளளவு (லிட்டர்)",
        villagesCovered: "கிராமங்கள்",

        // Status
        liveWaterStatus: "நேரடி குடிநீர் நிலை",
        waterAvailability: "குடிநீர் கிடைக்கும் நிலை",
        atAGlance: "ஒரே பார்வையில்.",
        statusDescription: "உங்கள் கிராம RO நிலையத்தின் தண்ணீர் இருப்பு, TDS தரம் மற்றும் நேரடி நிலவரம்.",
        roWaterStation: "RO குடிநீர் நிலையம்",
        selectVillagePrompt: "கிராம RO நிலையத்தை தேர்ந்தெடுக்கவும்:",
        waterLevelLabel: "தொட்டி தண்ணீர் அளவு",
        tdsLabel: "குடிநீர் தரம் (TDS)",
        tdsSubtext: "PPM (தூய குடிநீர் அளவு)",
        capacityLabel: "சேமிப்பு கொள்ளளவு",
        location: "இடம்",
        district: "மாவட்டம்",
        operatorLabel: "உள்ளூர் பணியாளர்",
        lastUpdatedLabel: "கடைசி புதுப்பிப்பு",
        refreshStatusBtn: "நிலையை புதுப்பி",
        reportIssueBtn: "புகார் தெரிவிக்க",
        updateStatusBtn: "பணியாளர் புதுப்பிப்பு",

        // Status Outcomes
        waterAvailable: "குடிநீர் கிடைக்கிறது",
        waterAvailableMessage: "சுத்திகரிக்கப்பட்ட குடிநீர் தற்போது தடையின்றி கிடைக்கிறது.",
        outOfWater: "தண்ணீர் இல்லை",
        outOfWaterMessage: "தொட்டியில் தண்ணீர் தீர்ந்துவிட்டது. தண்ணீர் ஏற்றப்படும்.",
        underMaintenance: "பராமரிப்பில் உள்ளது",
        maintenanceMessage: "வடிகட்டி மாற்றுதல் மற்றும் UV சுத்தம் செய்யும் பணி நடைபெறுகிறது.",
        underRepair: "பழுதுபார்க்கப்படுகிறது",
        repairMessage: "மோட்டார் அல்லது பம்ப் பழுதுபார்க்கும் பணி நடக்கிறது.",
        temporarilyClosed: "தற்காலிகமாக மூடப்பட்டுள்ளது",
        closedMessage: "மின்சார தடை காரணமாக நிலையம் தற்காலிகமாக மூடப்பட்டுள்ளது.",

        // Status Helpers
        statusUnavailable: "நிலை கிடைக்கவில்லை",
        unableToConnect: "சேவையகத்துடன் இணைக்க முடியவில்லை",
        offline: "ஆஃப்லைன்",
        unknown: "தெரியவில்லை",
        serverConnectionError: "இணைக்க முடியவில்லை",
        machineUnavailable: "இயந்திரம் ஆஃப்லைன்",
        locationUnavailable: "இடம் கிடைக்கவில்லை",
        villageNotFound: "கிராமம் பட்டியலில் இல்லை. கீழே உள்ள பட்டியலில் தேர்வு செய்யவும்.",
        searchError: "தேடலில் பிழை ஏற்பட்டது.",

        // Stations Explorer
        explorerTitle: "RO நிலையங்களின் பட்டியல்",
        explorerSubtitle: "மாவட்டத்திலுள்ள அனைத்து கிராம RO நிலையங்களையும் உடனுக்குடன் கவனியுங்கள்.",
        searchStationInput: "கிராமம் அல்லது நிலையத்தின் பெயரை தேடவும்...",
        filterAll: "அனைத்தும்",
        filterAvailable: "கிடைப்பவை",
        filterMaintenance: "பராமரிப்பில்",
        filterOutOfWater: "தண்ணீர் இல்லாதவை",
        exportCsvBtn: "CSV பதிவிறக்கம்",
        viewStationBtn: "நேரடி பார்வை",

        // Maintenance Section
        maintenanceTitle: "பராமரிப்பு மற்றும் பழுது விவரங்கள்",
        maintenanceSubtitle: "வெளிப்படையான சேவை பதிவுகள், ஃபில்டர் மாற்றங்கள் மற்றும் தீர்வு விவரங்கள்.",
        logMaintenanceBtn: "புதிய பராமரிப்பு பதிவு",
        filterAllTickets: "அனைத்தும்",
        filterActiveTickets: "நடைபெறுபவை",
        filterCompletedTickets: "முடிக்கப்பட்டவை",
        issueTypeCol: "சிக்கல் / பணி",
        machineCol: "நிலையம் / கிராமம்",
        startedCol: "பதிவு தேதி",
        statusCol: "நிலை",
        technicianCol: "பணியாளர்",
        actionCol: "செயல்",
        markDone: "முடிக்கப்பட்டது",
        viewAllMaintRecords: "அனைத்து பராமரிப்பு பதிவுகளையும் பார்க்கவும்",
        showRecentMaintOnly: "சமீபத்திய பதிவை மட்டும் காட்டவும்",

        // How It Works
        howItWorksTitle: "எப்படி செயல்படுகிறது",
        howItWorksSubtitle: "RO நிலையத்திற்கு செல்வதற்கு முன் குடிநீர் நிலையை தெரிந்துகொள்ளுங்கள்.",
        step1Title: "கிராமத்தை தேடுங்கள்",
        step1Desc: "உங்கள் கிராமத்தின் பெயரை உள்ளிடவும் அல்லது பட்டியலிலிருந்து தேர்வு செய்யவும்.",
        step2Title: "குடிநீர் நிலை மற்றும் தரத்தை பார்க்கவும்",
        step2Desc: "தண்ணீர் உள்ளதா, தொட்டி அளவு எவ்வளவு, TDS தரம் சரியானதா என அறியலாம்.",
        step3Title: "திட்டமிட்டு செல்லுங்கள்",
        step3Desc: "வீண் அலைச்சல் இன்றி குடிநீர் இருக்கும் போது நேரில் சென்று பெற்றுக்கொள்ளலாம்.",
        simpleReliable: "எளிமையானது. நம்பகமானது.",
        reliableDesc: "ஊராட்சி பணியாளர்களால் சரிபார்க்கப்பட்ட நேரடி நிலவரம்.",

        // About
        aboutTitle: "வாட்டர் பீக்கன் பற்றி",
        aboutDescription: "வாட்டர் பீக்கன் என்பது கிராம மக்கள் வீண் அலைச்சலின்றி RO குடிநீர் கிடைப்பதை வீட்டில் இருந்தே அறிய உதவும் நேரடி தளமாகும்.",
        feature1Title: "செல்வதற்கு முன் தெரிந்துகொள்ளுங்கள்",
        feature1Desc: "வெயிலில் சென்று ஏமாற்றம் அடையாமல் முன்கூட்டியே அறியலாம்.",
        feature2Title: "உள்ளூர் நேரடி புதுப்பிப்புகள்",
        feature2Desc: "ஊராட்சி RO பணியாளர்களால் உடனடியாக புதுப்பிக்கப்படும் தகவல்.",
        feature3Title: "மக்கள் புகார் வசதி",
        feature3Desc: "குடிநீர் சுவை, கசிவு அல்லது இயந்திர குறைபாடுகளை உடனடியாக தெரிவிக்கலாம்.",

        // Footer
        footerTagline: "ஸ்மார்ட் RO குடிநீர் கண்காணிப்பு தளம்",
        footerRights: "வாட்டர் பீக்கன். தூய குடிநீர் பாதுகாப்பு மற்றும் கிராம நலனுக்காக உருவாக்கப்பட்டது.",
        emergencyHelpline: "குடிநீர் உதவி எண்: 1800-425-1000",
        quickLinks: "முக்கிய இணைப்புகள்",
        waterInitiative: "தமிழ்நாடு ஊரக தூய குடிநீர் திட்டம்",

        // Modals
        reportModalTitle: "குடிநீர் புகார் தெரிவிக்க",
        reportModalDesc: "RO இயந்திர பழுது அல்லது குடிநீர் தரம் குறித்து பராமரிப்பு குழுவிற்கு தெரிவியுங்கள்.",
        operatorModalTitle: "பணியாளர் நிலை மாற்றும் தளம்",
        operatorModalDesc: "ஊராட்சி பணியாளர்கள்: தொட்டி தண்ணீர் அளவு மற்றும் குடிநீர் நிலையை புதுப்பிக்கவும்.",
        maintModalTitle: "புதிய பராமரிப்பு பதிவு",
        maintModalDesc: "வடிகட்டி மாற்றம், மோட்டார் பழுது அல்லது வழக்கமான சேவைக்கான பதிவு.",
        submitBtn: "சமர்ப்பிக்க",
        cancelBtn: "ரத்து செய்",
        saveChangesBtn: "சேமித்து வெளியிடவும்",

        // Additional labels for forms & status badges
        roLocation: "RO நிலைய இடம்",
        yourFullName: "உங்கள் பெயர்",
        contactPhone: "தொடர்பு எண்",
        issueCategory: "சிக்கலின் வகை",
        detailedDescription: "விவரம்",
        statusOpen: "திறந்துள்ளது",
        statusInProgress: "நடைபெறுகிறது",
        statusCompleted: "முடிக்கப்பட்டது",

        // About Section
        makingWater: "குடிநீர் பெறுவதை",
        accessEasier: "எளிதாக்குகிறது.",
        smartNetworkTitle: "கிராமப்புற ஸ்மார்ட் RO கட்டமைப்பு",
        smartNetworkDesc: "நேரடி நிலவர கண்காணிப்பு, தானியங்கி குடிநீர் அளவீடு மற்றும் வெளிப்படையான பராமரிப்பு பதிவுகள்.",
        openCitizenTelemetry: "100% வெளிப்படையான நேரடி நிலவரம்",

        // Footer
        supportEmergency: "உதவி மற்றும் அவசர தொடர்பு",
        dispensingHoursLabel: "குடிநீர் வழங்கும் நேரம்:",
        dispensingHoursTime: "காலை 6:00 – இரவு 9:00 வரை",
        operatorAccessBtn: "பணியாளர் தளம் →",
        backToTop: "மேலே",

        // Hero Telemetry Badges
        tdsPurityLabel: "குடிநீர் தரம் (TDS)",
        tankCapacityLabel: "தொட்டி கொள்ளளவு",

        // Status Details & Telemetry
        litersUnit: "லிட்டர்",
        litersShort: "லி",
        inTankText: "தொட்டியில் உள்ளது",
        approxInTank: "தோராயமாக",
        defaultOperatorTitle: "உள்ளூர் ஊராட்சி பணியாளர்",
        mainRoadLoc: "கிராம முக்கிய சாலை",
        justNow: "சமீபத்தில்",

        // Stations Directory
        noStationsMatch: "தேடலுக்குரிய நிலையங்கள் இல்லை",
        tryAnotherSearch: "வேறு கிராமத்தின் பெயரை உள்ளிடவும் அல்லது வடிகட்டியை மாற்றவும்.",
        resetFiltersBtn: "வடிகட்டியை மீட்டமை",

        // Maintenance Section
        allSystemsOperational: "அனைத்து இயந்திரங்களும் சீராக இயங்குகின்றன",
        noOpenTickets: "தற்போது எந்த பராமரிப்பு பணிகளும் நிலுவையில் இல்லை.",
        routineMaintenanceDesc: "வழக்கமான வடிகட்டி ஆய்வு மற்றும் பராமரிப்பு பணி.",
        assignedTechnician: "தொழில்நுட்ப பணியாளர்",

        // Modal Form Options & Placeholders
        issueLowPressure: "குறைந்த நீர் அழுத்தம் / நீர் வரத்து குறைவு",
        issueTasteOdor: "வித்தியாசமான சுவை / உப்புத்தன்மை / துர்நாற்றம்",
        issueTapLeak: "குழாய் கசிவு / நீர் விரயம்",
        issueCardMachine: "ஸ்மார்ட் கார்டு / டோக்கன் ரீடர் கோளாறு",
        issuePowerOutage: "நிலையத்தில் மின்சார தடை",
        issueOther: "இதர செயல்பாட்டு குறைபாடுகள்",
        namePlaceholder: "எ.கா. ரமேஷ் குமார்",
        phonePlaceholder: "எ.கா. 94420 00000",
        descPlaceholder: "நிலையத்தில் நீங்கள் கவனித்த குறைபாட்டை விவரிக்கவும்...",
        stateTamilNadu: "தமிழ்நாடு",
        howItWorksLead: "வாட்டர் பீக்கன் வீட்டை விட்டு புறப்படும் முன் கிராமத்தின் RO குடிநீர் இருப்பு மற்றும் தரத்தை எளிதாக அறிய உதவுகிறது.",
        brandTitle: "வாட்டர் பீக்கன்",
        brandWater: "வாட்டர்",
        brandBeacon: "பீக்கன்",
        operatorPortalBrand: "வாட்டர் பீக்கன்",
        avatarTN: "த.நா",
        avatarRO: "RO",
        toastSuccess: "வெற்றி",
        toastError: "பிழை",
        toastNotice: "அறிவிப்பு",
        toastInfo: "தகவல்",
        submittingBtn: "சமர்ப்பிக்கப்படுகிறது...",
        reportSuccessToast: "புகார் பெறப்பட்டது. உள்ளூர் ஊராட்சி பராமரிப்பு குழுவிற்கு தகவல் தெரிவிக்கப்பட்டுள்ளது.",
        reportErrorToast: "புகாரை சமர்ப்பிக்க முடியவில்லை. விவரங்களை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
        statusRefreshedToast: "நேரடி சேவையகத்திலிருந்து குடிநீர் நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        notAvailable: "இல்லை",
        // Entry / Welcome Page
        entryHeadline: "ஒவ்வொரு சமூகத்திற்கும் சிறந்த நீர் கண்காணிப்பு",
        entrySubtitle: "பயணிக்கும் முன் RO குடிநீர் இருப்பை அறிந்து கொள்ளுங்கள். உங்கள் அருகிலுள்ள சமூக RO குடிநீர் நிலையங்கள் பற்றிய நேரடித் தகவலைப் பெறுங்கள்.",
        entryTag: "ஊராட்சி குடிநீர் நேரடி நிலவர தளம்",
        publicAccessTitle: "பொது அணுகல்",
        publicAccessDesc: "அருகிலுள்ள RO நிலையங்கள் மற்றும் நீர் இருப்பை அறிந்து கொள்ளுங்கள்.",
        continuePublicBtn: "பொதுப் பயனராக தொடரவும்",
        featNoLogin: "உள்நுழைவு தேவையில்லை",
        featViewStations: "RO நிலையங்களைப் பார்க்கலாம்",
        featCheckAvail: "குடிநீர் இருப்பை அறியலாம்",
        featViewLevels: "தொட்டி நீர் அளவைக் காணலாம்",
        featCheckUpdated: "கடைசியாக புதுப்பிக்கப்பட்ட நேரம்",
        featSearchFilter: "கிராம வாரியாக தேடலாம்",
        featAllPublicInfo: "அனைத்து பொதுத் தகவல்களும்",
        
        adminAccessTitle: "நிர்வாகி / இயக்குநர் அணுகல்",
        adminAccessDesc: "RO நிலையங்களை நிர்வகிக்கவும், நீர் இருப்பை புதுப்பிக்கவும் பாதுகாப்பான அணுகல்.",
        adminLoginBtn: "நிர்வாகி / இயக்குநர் உள்நுழைவு",
        featSecureAuth: "பாதுகாப்பான உள்நுழைவு",
        featManageStations: "RO நிலையங்களை நிர்வகிக்கலாம்",
        featUpdateStatus: "குடிநீர் நிலையை புதுப்பிக்கலாம்",
        featUpdateLevels: "நீர் அளவை மாற்றலாம்",
        featManageMaint: "பராமரிப்பு பதிவுகளை நிர்வகிக்கலாம்",
        featStationHistory: "நிலைய வரலாற்று பதிவுகளைக் காணலாம்",
        
        howWorksTitle: "வாட்டர் பீக்கன் எவ்வாறு செயல்படுகிறது?",
        howWorksSubtitle: "வீட்டை விட்டு புறப்படும் முன் 3 எளிய படிகளில் குடிநீர் நிலவரத்தை அறியலாம்.",
        step1Title: "1. உங்கள் RO நிலையத்தைக் கண்டறியுங்கள்",
        step1Desc: "உங்கள் கிராமம் அல்லது அருகிலுள்ள RO குடிநீர் நிலையத்தைத் தேடுங்கள்.",
        step2Title: "2. குடிநீர் இருப்பை சரிபாருங்கள்",
        step2Desc: "குடிநீர் கிடைக்கிறதா, தீர்ந்துவிட்டதா அல்லது பராமரிப்பில் உள்ளதா என்பதைப் பாருங்கள்.",
        step3Title: "3. நம்பிக்கையுடன் நேரில் செல்லுங்கள்",
        step3Desc: "சமீபத்திய குடிநீர் நிலவரத்தை உறுதி செய்த பிறகே நேரில் செல்லுங்கள்.",
        
        whyTitle: "ஏன் வாட்டர் பீக்கன்?",
        whySubtitle: "கிராமப்புற குடிநீர் மேலாண்மையில் வெளிப்படைத்தன்மையை உறுதி செய்ய வடிவமைக்கப்பட்டது.",
        whyFeature1Title: "நேரடி குடிநீர் நிலை",
        whyFeature1Desc: "பணியாளர்களால் உடனுக்குடன் புதுப்பிக்கப்படும் குடிநீர் இருப்பு, TDS தரம் மற்றும் தொட்டி நீர் அளவு.",
        whyFeature2Title: "எளிய நிலையத் தேடல்",
        whyFeature2Desc: "அனைத்து கிராமங்கள் மற்றும் மாவட்டங்களில் உள்ள RO நிலையங்களை நொடியில் தேடலாம்.",
        whyFeature3Title: "தமிழ் மற்றும் ஆங்கில ஆதரவு",
        whyFeature3Desc: "கிராம மக்கள் மற்றும் பணியாளர்கள் எளிதாகப் பயன்படுத்த முழுமையான இருமொழி வசதி.",
        whyFeature4Title: "பராமரிப்பு நிலவர தகவல்",
        whyFeature4Desc: "வடிகட்டி மாற்றம், மோட்டார் பழுது உள்ளிட்ட பராமரிப்பு பணிகள் குறித்த வெளிப்படையான பதிவுகள்.",
        whyFeature5Title: "எளிய மற்றும் நவீன இடைமுகம்",
        whyFeature5Desc: "எந்தவொரு செல்போனிலும் எளிதாக இயங்கும் நவீன மற்றும் வேகமான வடிவமைப்பு.",
        whyFeature6Title: "சமூக நலன் சார்ந்த கண்காணிப்பு",
        whyFeature6Desc: "குடிநீர் குறைபாடுகளை உடனடியாக பராமரிப்பு குழுவிற்கு தெரிவிக்கும் மக்கள் புகார் வசதி.",
        
        aboutIntroTitle: "வாட்டர் பீக்கன் பற்றி",
        aboutIntroDesc: "வாட்டர் பீக்கன் பொதுமக்கள் குடிநீர் நிலையங்களுக்கு நேரில் செல்வதற்கு முன் RO குடிநீர் இருப்பை எளிதாக அறிய உதவுகிறது. ஊராட்சி பணியாளர்கள் மற்றும் கிராம மக்களை நேரடித் தகவல் மூலம் இணைப்பதன் மூலம் தேவையற்ற அலைச்சலைத் தவிர்த்து, அனைவருக்கும் பாதுகாப்பான குடிநீர் கிடைப்பதை உறுதி செய்கிறது.",

        // Admin Login
        adminPortalTitle: "நிர்வாகி & பணியாளர் தளம்",
        adminPortalSubtitle: "சமூக RO குடிநீர் நிலையங்களை நிர்வகிக்க உங்கள் அங்கீகரிக்கப்பட்ட கணக்கில் உள்நுழையவும்",
        usernameLabel: "பயனர் பெயர்",
        passwordLabel: "கடவுச்சொல்",
        orQuickPin: "அல்லது விரைவு PIN அணுகல்",
        enterPinPlaceholder: "இயக்குநர் அணுகல் PIN",
        usernamePlaceholder: "எ.கா. admin அல்லது operator",
        passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
        loginSubmitBtn: "டாஷ்போர்டில் உள்நுழையவும்",
        returnWelcomeBtn: "முகப்புப் பக்கத்திற்குத் திரும்பவும்",
        demoCredentialsLabel: "அங்கீகரிக்கப்பட்ட அணுகல்",
        adminDemo: "கட்டுப்படுத்தப்பட்ட நிர்வாகத் தளம்",
        operatorDemo: "உங்கள் ஒதுக்கப்பட்ட PIN எண்ணை உள்ளிடவும்",
        invalidCreds: "தவறான விவரங்கள். பயனர் பெயர் மற்றும் கடவுச்சொல் அல்லது PIN ஐ சரிபார்க்கவும்.",
        loginSuccess: "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!",
        loggingIn: "சரிபார்க்கப்படுகிறது...",

        // Admin & Operator Dashboard
        adminDashboardTitle: "வாட்டர் பீக்கன் கட்டுப்பாட்டு மையம்",
        dashboardSubtitle: "ஊராட்சி RO குடிநீர் கட்டமைப்பு மேலாண்மை",
        tabTelemetry: "நேரடி நிலை கட்டுப்படுத்தி",
        tabStations: "RO நிலையங்கள் மேலாண்மை",
        tabUsers: "பணியாளர்கள் கணக்குகள்",
        tabMaintenance: "பராமரிப்பு திட்டம்",
        tabReports: "பொதுமக்கள் புகார்கள்",
        tabAudit: "நிலைய வரலாற்று பதிவுகள்",
        roleAdmin: "மாவட்ட நிர்வாகி",
        roleOperator: "களப் பணியாளர்",
        btnAddNewStation: "புதிய RO நிலையத்தை சேர்க்க",
        btnAddNewUser: "புதிய பணியாளரை சேர்க்க",
        btnSaveStation: "நிலையத்தை சேமிக்க",
        btnDeleteStation: "நிலையத்தை நீக்குக",
        btnEdit: "திருத்து",
        btnDelete: "நீக்கு",
        btnSignOut: "வெளியேறு",
        btnPublicView: "பொதுப்பார்வை இணையதளம்",
        allStationsNotice: "மாவட்ட நிர்வாகி முறைமை: அனைத்து கிராம நிலையங்கள் மற்றும் பணியாளர்கள் மீதான முழு கட்டுப்பாடு.",
        assignedStationNotice: "களப் பணியாளர் முறைமை: உங்கள் ஊராட்சி குடிநீர் நிலையத்திற்கான கட்டுப்பாட்டு வசதி.",
        statTotalStations: "மொத்த RO நிலையங்கள்",
        statDispensingActive: "குடிநீர் வழங்குபவை",
        statUnderMaint: "பராமரிப்பில் உள்ளவை",
        statPendingReports: "தீர்க்கப்படாத புகார்கள்",
        stationNameLabel: "RO நிலையப் பெயர்",
        villageNameLabel: "கிராமப் பெயர்",
        districtLabel: "மாவட்டம்",
        localityLabel: "அமைவிடம் / முகவரி",
        tankCapacityLiters: "தொட்டி கொள்ளளவு (லிட்டர்)",
        initialWaterLevel: "நீர் அளவு (%)",
        initialTds: "குடிநீர் தரம் TDS (PPM)",
        operatorNameLabel: "பணியாளர் முழுப் பெயர்",
        operatorPhoneLabel: "பணியாளர் தொலைபேசி எண்",
        roleLabel: "பயனர் நிலை / பொறுப்பு",
        assignedVillageLabel: "ஒதுக்கப்பட்ட கிராம நிலையம்",
        actionCol: "செயல்கள்",
        statusCol: "நிலை",
        lastUpdatedCol: "கடைசியாக புதுப்பிக்கப்பட்டது",
        confirmDeleteStation: "இந்த RO நிலையத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இதன் அனைத்து பதிவுகளும் நீக்கப்படும்.",
        confirmDeleteUser: "இந்த பணியாளர் கணக்கை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
        stationSavedSuccess: "RO நிலைய விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன.",
        stationDeletedSuccess: "RO நிலையம் வெற்றிகரமாக நீக்கப்பட்டது.",
        userSavedSuccess: "பணியாளர் கணக்கு வெற்றிகரமாக சேமிக்கப்பட்டது.",
        userDeletedSuccess: "பணியாளர் கணக்கு நீக்கப்பட்டது.",
        errorSavingStation: "நிலையத்தை சேமிப்பதில் பிழை. விவரங்களை சரிபார்க்கவும்.",
        errorSavingUser: "பணியாளர் கணக்கை சேமிப்பதில் பிழை.",
        statusUpdatedSuccess: "குடிநீர் நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        maintScheduledSuccess: "பராமரிப்பு பதிவு வெற்றிகரமாக உருவாக்கப்பட்டது.",
        reportUpdatedSuccess: "புகாரின் நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        noAssignedStations: "உங்கள் கணக்கிற்கு எந்த நிலையமும் ஒதுக்கப்படவில்லை.",
        filterRoleAll: "அனைத்து பொறுப்புகளும்",
        filterRoleAdmin: "நிர்வாகிகள்",
        filterRoleOperator: "பணியாளர்கள்",
        selectRolePrompt: "பொறுப்பைத் தேர்ந்தெடுக்கவும்",
        selectVillagePromptAdmin: "கிராமத்தைத் தேர்ந்தெடுக்கவும் (நிர்வாகிக்கு காலியாக விடவும்)",
        unassignedVillage: "எதுவுமில்லை (மாவட்ட நிர்வாகி)",
        passwordLeaveBlankHint: "(தற்போதுள்ள கடவுச்சொல்லை வைத்திருக்க காலியாக விடவும்)",
        reportStatusPending: "நிலுவையில் உள்ளது",
        reportStatusInvestigating: "ஆய்வு செய்யப்படுகிறது",
        reportStatusResolved: "தீர்க்கப்பட்டது",

        // Operator Portal - Header & Nav
        operatorConsoleTag: "கள இயக்குநர் முனையம்",
        opNavDashboard: "கட்டுப்பாட்டுப் பலகை",
        opNavIssues: "குடிமக்கள் புகார்கள்",
        publicViewBtn: "பொதுப் பார்வை",
        signOutBtn: "வெளியேறு",

        // Operator Portal - Single Plant Overview
        opPlantOverviewTitle: "கிராம RO குடிநீர் நிலைய கண்ணோட்டம்",
        opCurrentAvailability: "இயந்திர நிலை",
        opTankLevel: "மேல்நிலைத் தொட்டி நீர் அளவு",
        opWaterPurity: "நீர் தூய்மை (TDS)",
        opLastUpdatedTime: "கடைசியாக புதுப்பிக்கப்பட்டது",
        opPlantLocation: "நிலைய அமைவிடம்",

        // Operator Portal - Telemetry Controller
        opUpdateControllerTitle: "நேரலை நிலைய தொலை அளவீடு & நிலை கட்டுப்பாடு",
        opUpdateControllerSubtitle: "பொதுமக்கள் போர்டல் மற்றும் டிஜிட்டல் திரைகளுக்கு உடனடி நிலைப் புதுப்பிப்பை அனுப்புங்கள்.",
        opSelectMachineLabel: "கிராம RO இயந்திரத்தைத் தேர்ந்தெடுக்கவும்",
        opSetStatusLabel: "நேரலை நீர் விநியோக நிலையை அமைக்கவும்",
        statusAvailable: "நீர் கிடைக்கிறது",
        statusOutOfWater: "நீர் இல்லை",
        statusMaintenance: "பராமரிப்பில்",
        statusRepair: "பழுதுபார்ப்பில்",
        statusClosed: "மூடப்பட்டுள்ளது",
        opTankLevelLabel: "மேல்நிலைத் தொட்டி நீர் அளவு (%)",
        opTdsPurityLabel: "நீர் தூய்மை TDS (PPM)",
        opLoggedByLabel: "பதிவு செய்தவர் (இயக்குநர் பெயர்)",
        opRemarksLabel: "நிலைக் காரணம் / இயக்குநர் குறிப்புகள்",
        opRemarksPlaceholder: "எ.கா: காலை நேர சுழற்சி முடிந்தது. தண்ணீர் தொட்டி முழுமையாக உள்ளது.",
        btnBroadcastStatus: "நெட்வொர்க்கிற்கு நிலை புதுப்பிப்பை ஒளிபரப்பவும்",
        broadcastingText: "நெட்வொர்க்கிற்கு அனுப்பப்படுகிறது...",

        // Operator Portal - Recent Activity / Audit Log
        opRecentActivityTitle: "சமீபத்திய இயந்திர நிலை செயல்பாடுகள் (தணிக்கை பதிவு)",
        refreshLogs: "பதிவுகளை புதுப்பி",
        thMachine: "நிலையம் / இயந்திரம்",
        thStatusSet: "அமைக்கப்பட்ட நிலை",
        thRemarks: "குறிப்புகள் / காரணம்",
        thLoggedBy: "பதிவு செய்தவர்",
        thTimestamp: "நேரம்",
        noAuditLogs: "இந்த நிலையத்திற்கு இதுவரை நிலை மாற்றப் பதிவுகள் இல்லை.",

        // Operator Portal - Dedicated Issues Section
        opIssuesPageTitle: "குடிமக்கள் புகார்கள் & சிக்கல்கள்",
        opIssuesPageSubtitle: "பொதுமக்கள் தெரிவித்த குடிநீர் புகார்களை ஆய்வு செய்து தீர்வு காணவும்.",
        filterAll: "அனைத்து புகார்கள்",
        filterPending: "நிலுவையில்",
        filterInvestigating: "ஆய்வில்",
        filterResolved: "தீர்க்கப்பட்டது",
        noIssuesTitle: "புகார்கள் எதுவும் இல்லை",
        noIssuesSubtitle: "அனைத்து சமூக RO குடிநீர் விநியோக அமைப்புகளும் எந்த புகாரும் இன்றி சீராக இயங்குகின்றன.",
        btnReviewIssue: "ஆய்வு செய்து புதுப்பி",
        btnMarkInvestigating: "ஆய்வில் என குறிக்கவும்",
        btnMarkResolved: "தீர்க்கப்பட்டது என குறிக்கவும் ✓",
        btnReopenIssue: "மீண்டும் திறக்கவும்",
        issueReportedBy: "புகாரளித்தவர்",
        issuePhone: "தொலைபேசி",
        issueDate: "புகாரளிக்கப்பட்ட தேதி",
        issueCategory: "பிரிவு",
        issueDescription: "விளக்கம்",
        issueStatus: "நிலை",
        issueDetailsModalTitle: "குடிமக்கள் புகார் விவரங்கள் & நிலை தீர்வு",
        closeBtn: "மூடு",

        // Operator Portal - Dynamic Toasts & Alerts
        opToastLoginSuccess: "ஊராட்சி இயக்குநராக வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.",
        opToastLogout: "இயக்குநர் வெற்றிகரமாக வெளியேறினார்.",
        opToastStatusSuccess: "இயந்திர நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டு பொதுப் பக்கத்திற்கு அனுப்பப்பட்டது.",
        opToastStatusError: "இயந்திர நிலையை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        opToastReportUpdated: "புகாரின் நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        opToastReportError: "புகாரின் நிலையை புதுப்பிக்க முடியவில்லை.",
        opToastAuditRefreshed: "சமீபத்திய செயல்பாட்டு பதிவுகள் புதுப்பிக்கப்பட்டன."


    }
};

window.translations = translations;

let currentLanguage = localStorage.getItem("waterBeaconLanguage") || "en";

function applyLanguage(lang) {
    if (!translations[lang]) {
        lang = "en";
    }

    currentLanguage = lang;
    localStorage.setItem("waterBeaconLanguage", lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    if (document.body) {
        document.body.classList.toggle("lang-ta", lang === "ta");
    }

    // Translate text nodes
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Translate placeholder attributes
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Translate titles
    document.querySelectorAll("[data-i18n-title]").forEach(element => {
        const key = element.getAttribute("data-i18n-title");
        if (translations[lang] && translations[lang][key]) {
            element.title = translations[lang][key];
        }
    });

    const langText = document.getElementById("language-text");
    if (langText) {
        langText.textContent = lang === "ta" ? "தமிழ்" : "EN";
    }
    const welcomeLangText = document.getElementById("welcome-lang-text");
    if (welcomeLangText) {
        welcomeLangText.textContent = lang === "ta" ? "தமிழ்" : "English";
    }
    const adminLangText = document.getElementById("admin-lang-text");
    if (adminLangText) {
        adminLangText.textContent = lang === "ta" ? "தமிழ்" : "English";
    }
    const opLangText = document.getElementById("op-lang-text");
    if (opLangText) {
        opLangText.textContent = lang === "ta" ? "தமிழ்" : "English";
    }
    const opAuthLangText = document.getElementById("op-auth-lang-text");
    if (opAuthLangText) {
        opAuthLangText.textContent = lang === "ta" ? "தமிழ்" : "English";
    }

    // Trigger custom event so any dynamic components re-render their labels
        // Dynamic Browser Title Localization
    if (window.location.pathname.includes("operator") || document.title.includes("Operator") || document.title.includes("இயக்குநர்")) {
        document.title = (lang === "ta") ? "வாட்டர் பீக்கன் | இயக்குநர் மற்றும் தொழில்நுட்ப தளம்" : "Operator & Technician Portal | Water Beacon";
    } else if (window.location.pathname.includes("public") || window.location.pathname.includes("home") || document.title.includes("Availability & Purity") || document.title.includes("குடிநீர் கண்காணிப்பு")) {
        document.title = (lang === "ta") ? "வாட்டர் பீக்கன் | நேரடி சமூக RO குடிநீர் கண்காணிப்பு" : "Water Beacon | Smart Community RO Water Availability & Purity Monitoring";
    } else {
        document.title = (lang === "ta") ? "வாட்டர் பீக்கன் நல்வரவு | ஸ்மார்ட் சமூக RO குடிநீர் கண்காணிப்பு" : "Welcome to Water Beacon | Smart Community RO Water Monitoring";
    }

    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
}

function getTranslation(key, fallback = "") {
    return translations[currentLanguage]?.[key] || translations["en"]?.[key] || fallback || key;
}

window.t = getTranslation;
window.applyLanguage = applyLanguage;

// Dynamic Telemetry Data Dictionaries for Tamil Localization
const villageTranslations = {
    ta: {
        "Semmarikulam": "செம்மரிகுளம்",
        "Srivaikuntam": "ஸ்ரீவைகுண்டம்",
        "Tiruchendur": "திருச்செந்தூர்",
        "Udangudi": "உடன்குடி",
        "Authoor": "ஆத்தூர்",
        "Kayalpattinam": "காயல்பட்டினம்",
        "Nazareth": "நாசரேத்",
        "Sathankulam": "சாத்தான்குளம்",
        "Alwarthirunagari": "ஆழ்வார்திருநகரி"
    }
};

const districtTranslations = {
    ta: {
        "Thoothukudi": "தூத்துக்குடி",
        "Tirunelveli": "திருநெல்வேலி",
        "Tenkasi": "தென்காசி",
        "Kanniyakumari": "கன்னியாகுமரி",
        "Madurai": "மதுரை"
    }
};

const locationTranslations = {
    ta: {
        "Village Main Road": "கிராம முக்கிய சாலை",
        "North Car Street": "வடக்கு ரத வீதி",
        "Temple Car Street West": "மேற்கு ரத வீதி (கோவில் அருகில்)",
        "Bazaar Street, Near Bus Stand": "பஜார் வீதி, பேருந்து நிலையம் அருகில்",
        "Main Market Area": "முதன்மை சந்தைப் பகுதி",
        "Coastal Road Junction": "கடற்கரை சாலை சந்திப்பு",
        "Near Railway Feeder Road": "ரயில்வே இணைப்பு சாலை அருகில்",
        "Panchayat Office Complex": "ஊராட்சி மன்ற வளாகம்",
        "Main Road": "முக்கிய சாலை",
        "Near Bus Stand": "பேருந்து நிலையம் அருகில்",
        "Market Street": "சந்தை வீதி"
    }
};

const machineTranslations = {
    ta: {
        "Main RO Water Machine": "முதன்மை RO குடிநீர் நிலையம்",

        "Semmarikulam Main RO Water Machine": "செம்மரிகுளம் முதன்மை RO குடிநீர் நிலையம்",

        "Semmarikulam Station": "செம்மரிகுளம் நிலையம்",

        "Village RO Plant": "கிராம RO குடிநீர் நிலையம்",
        "Srivaikuntam Riverbank RO Plant": "ஸ்ரீவைகுண்டம் ஆற்றுப்படுகை RO நிலையம்",
        "Tiruchendur Pilgrim RO Center": "திருச்செந்தூர் பக்தர்கள் RO மையம்",
        "Udangudi Central RO Unit": "உடன்குடி மத்திய RO நிலையம்",
        "Authoor Betel Leaf RO Facility": "ஆத்தூர் வெற்றிலைப் பகுதி RO நிலையம்",
        "Kayalpattinam RO Station 1": "காயல்பட்டினம் RO நிலையம் 1",
        "Nazareth Model RO Station": "நாசரேத் மாதிரி RO நிலையம்",
        "Sathankulam Community RO Plant": "சாத்தான்குளம் சமூக RO சுத்திகரிப்பு நிலையம்",
        "RO Machine": "RO குடிநீர் நிலையம்",
        "RO Unit": "RO சுத்திகரிப்பு பிரிவு"
    }
};

const operatorTranslations = {
    ta: {
        "Muthu K (Panchayat Operator)": "முத்து கே (ஊராட்சி பணியாளர்)",
        "Muthu K": "முத்து கே",
        "Suresh Kumar": "சுரேஷ் குமார்",
        "Kannan V": "கண்ணன் வி",
        "Selvam R": "செல்வம் ஆர்",
        "Mariappan P": "மாரியப்பன் பி",
        "Ahmed Bilal": "அஹ்மத் பிலால்",
        "David Johnson": "டேவிட் ஜான்சன்",
        "Murugan S": "முருகன் எஸ்",
        "Unit Test Tech": "தொழில்நுட்ப பணியாளர்",
        "Local Panchayat Operator": "உள்ளூர் ஊராட்சி பணியாளர்",

        "Panchayat Operator": "ஊராட்சி பணியாளர்",

        "Service Technician": "சேவை தொழில்நுட்ப வல்லுநர்",

        "Test Inspector": "ஆய்வு மேற்பார்வையாளர்",

        "Operator Test Suite": "பணியாளர் தளம்",

        "Operator": "இயக்குநர் / பணியாளர்",

        "Admin": "நிர்வாகி",

        "Technician": "தொழில்நுட்ப வல்லுநர்"
    }
};

const issueTranslations = {
    ta: {
        "Filter Cleaning Test": "வடிகட்டி ஆய்வு சோதனை",
        "Routine test verification of intake mesh": "வடிகட்டி வலை மற்றும் நீர் உறிஞ்சும் குழாய் ஆய்வு",
        "Membrane Replacement": "RO சவ்வு (Membrane) மாற்றுதல்",
        "Scheduled membrane replacement and chemical backwash": "திட்டமிடப்பட்ட சவ்வு மாற்றுதல் மற்றும் ரசாயன சுத்திகரிப்பு பணி",
        "Pressure Booster Pump Servicing": "உயர் அழுத்த பூஸ்டர் பம்ப் பராமரிப்பு",
        "Booster pump bearing lubrication and seal check": "பூஸ்டர் பம்ப் பேரிங் லூப்ரிகேஷன் மற்றும் சீல் ஆய்வு",
        "UV Lamp Disinfection Check": "UV விளக்கு கிருமிநாசினி ஆய்வு",
        "UV lamp intensity verification and chamber descaling": "UV விளக்கு ஒளித்திறன் மற்றும் சேம்பர் உப்பு நீக்கம்",
        "TDS Calibration & Sensor Check": "TDS சென்சார் மற்றும் அளவீடு சோதனை",
        "TDS probe recalibration and digital display sync": "TDS சென்சார் அளவீடு மற்றும் டிஜிட்டல் திரை ஒருங்கிணைப்பு",
        "Low Water Flow / Pressure Drop": "குறைந்த நீர் அழுத்தம் / நீர் வரத்து குறைவு",
        "Strange Taste / High Salinity / Odor": "வித்தியாசமான சுவை / உப்புத்தன்மை / துர்நாற்றம்",
        "Dispenser Tap Leakage / Spillage": "குழாய் கசிவு / நீர் விரயம்",
        "Smart Card / Token Reader Error": "ஸ்மார்ட் கார்டு / டோக்கன் ரீடர் கோளாறு",
        "RO Station Power Failure": "நிலையத்தில் மின்சார தடை",
        "Other Operational Issue": "இதர செயல்பாட்டு குறைபாடுகள்",
        "Low Pressure": "குறைந்த நீர் அழுத்தம்",
        "Water Taste or Odor": "சுவை அல்லது துர்நாற்றம்",
        "Dispenser Tap Leak": "குழாய் கசிவு",
        "Card Machine Down": "கார்டு மெஷின் கோளாறு",
        "Station Power Outage": "மின்சார தடை",
        "Other": "இதர குறைபாடு",
        "Routine maintenance procedure.": "வழக்கமான வடிகட்டி ஆய்வு மற்றும் பராமரிப்பு பணி."
    }
};

window.translateVillage = function(name) {
    if (!name) return "";
    const lang = currentLanguage;
    if (lang === "ta" && villageTranslations.ta[name]) {
        return villageTranslations.ta[name];
    }
    return name;
};

window.translateDistrict = function(district) {
    if (!district) return "";
    const lang = currentLanguage;
    if (lang === "ta" && districtTranslations.ta[district]) {
        return districtTranslations.ta[district];
    }
    return district;
};

window.translateLocation = function(loc) {
    if (!loc) return "";
    const lang = currentLanguage;
    if (lang === "ta" && locationTranslations.ta[loc]) {
        return locationTranslations.ta[loc];
    }
    return loc;
};

window.translateMachine = function(machine, villageName = "") {
    if (!machine) return "";
    const lang = currentLanguage;
    if (lang !== "ta") return machine;
    if (typeof window.translateStationName === "function") {
        return window.translateStationName(machine, villageName);
    }
    if (machineTranslations.ta[machine]) {
        return machineTranslations.ta[machine];
    }
    return machine;
};

window.translateOperator = function(op) {
    if (!op) return "";
    const lang = currentLanguage;
    if (lang === "ta" && operatorTranslations.ta[op]) {
        return operatorTranslations.ta[op];
    }
    return op;
};

window.translateIssue = function(issue) {
    if (!issue) return "";
    const lang = currentLanguage;
    if (lang === "ta" && issueTranslations.ta[issue]) {
        return issueTranslations.ta[issue];
    }
    return issue;
};

window.translateDescription = function(desc) {
    if (!desc) return "";
    const lang = currentLanguage;
    if (lang === "ta" && issueTranslations.ta[desc]) {
        return issueTranslations.ta[desc];
    }
    return desc;
};

window.translateState = function(state) {
    if (!state) return "";
    const lang = currentLanguage;
    if (lang === "ta" && (state === "Tamil Nadu" || state === "TamilNadu")) {
        return "தமிழ்நாடு";
    }
    return state;
};

window.getStatusLabel = function(status) {
    const lang = currentLanguage || "en";
    const map = {
        AVAILABLE: translations[lang]?.waterAvailable || "Water Available",
        OUT_OF_WATER: translations[lang]?.outOfWater || "Out of Water",
        UNDER_MAINTENANCE: translations[lang]?.underMaintenance || "Under Maintenance",
        REPAIR: translations[lang]?.underRepair || "Under Repair",
        TEMPORARILY_CLOSED: translations[lang]?.temporarilyClosed || "Temporarily Closed"
    };
    return map[status] || status || translations[lang]?.unknown || "Unknown";
};


// Comprehensive Remarks & Audit Log Dictionaries
const remarksTranslations = {
    ta: {
        "Status changed to AVAILABLE": "குடிநீர் வழங்கும் நிலை: நீர் கிடைக்கிறது",
        "Status changed to OUT_OF_WATER": "குடிநீர் வழங்கும் நிலை: தண்ணீர் இல்லை",
        "Status changed to UNDER_MAINTENANCE": "குடிநீர் வழங்கும் நிலை: பராமரிப்பில் உள்ளது",
        "Status changed to REPAIR": "குடிநீர் வழங்கும் நிலை: பழுதுபார்க்கப்படுகிறது",
        "Status changed to TEMPORARILY_CLOSED": "குடிநீர் வழங்கும் நிலை: தற்காலிகமாக மூடப்பட்டுள்ளது",
        "Regular morning filtration cycle completed. Water tank full.": "காலை நேர சுழற்சி முடிந்தது. மேல்நிலைத் தொட்டி முழுமையாக உள்ளது.",
        "Morning filtration cycle completed": "காலை நேர சுத்திகரிப்பு சுழற்சி வெற்றிகரமாக முடிந்தது",
        "Maintenance completed. Water restored to safe operation.": "பராமரிப்பு பணிகள் முடிவடைந்தது. பாதுகாப்பான குடிநீர் வழங்கல் மீண்டும் தொடங்கியது.",
        "Maintenance logged: Filter Cleaning Test": "பராமரிப்பு பதிவு: வடிகட்டி ஆய்வு சோதனை",
        "Automated unit test ran dry tank check": "கணினி ஆய்வு: தொட்டி நீர்மட்ட சோதனை",
        "Restored after unit test": "ஆய்வுக்குப் பின் இயல்பு நிலைக்கு மீட்டமைக்கப்பட்டது",
        "Routine maintenance procedure.": "வழக்கமான வடிகட்டி ஆய்வு மற்றும் பராமரிப்பு பணி.",
        "Routine test verification of intake mesh": "வடிகட்டி வலை மற்றும் நீர் உறிஞ்சும் குழாய் வழக்கமான ஆய்வு.",
        "Overhead tank refilled to capacity.": "மேல்நிலைத் தொட்டி முழு கொள்ளளவிற்கு நிரப்பப்பட்டது.",
        "Purity checked. Normal operation.": "நீர் தூய்மை ஆய்வு செய்யப்பட்டது. சீரான செயல்பாடு.",
        "Filter Cleaning Test": "வடிகட்டி ஆய்வு சோதனை",
        "Intake pump checked": "நீர் உறிஞ்சும் மோட்டார் பம்ப் ஆய்வு செய்யப்பட்டது",
        "UV lamp sterilization verified": "UV கிருமிநாசினி விளக்கு பரிசோதிக்கப்பட்டது",
        "Tank refill completed": "தொட்டி நீர் நிரப்பும் பணி முடிந்தது",
        "High water demand peak hour": "அதிக குடிநீர் தேவைக்கான உச்ச நேரம்",
        "Low pressure due to clogged pre-filter": "முன் வடிகட்டி அடைப்பு காரணமாக குறைந்த நீர் அழுத்தம்",
        "Membrane Replacement": "RO சவ்வு (Membrane) மாற்றுதல்",
        "Pressure Booster Pump Servicing": "உயர் அழுத்த பூஸ்டர் பம்ப் பராமரிப்பு"
    }
};

window.translateRemarks = function(remarks) {
    if (!remarks) return "—";
    const lang = currentLanguage;
    if (lang !== "ta") return remarks;

    if (remarksTranslations.ta[remarks]) {
        return remarksTranslations.ta[remarks];
    }
    if (issueTranslations.ta[remarks]) {
        return issueTranslations.ta[remarks];
    }

    const statusMatch = remarks.match(/^Status changed to\s+([A-Z_]+)/i);
    if (statusMatch) {
        const st = statusMatch[1].toUpperCase();
        const stLabel = window.getStatusLabel(st);
        return `குடிநீர் நிலை மாற்றப்பட்டது: ${stLabel}`;
    }

    const maintMatch = remarks.match(/^Maintenance logged:\s*(.*)/i);
    if (maintMatch) {
        const task = maintMatch[1];
        const taskTa = window.translateIssue(task);
        return `பராமரிப்பு பதிவு: ${taskTa}`;
    }

    return remarks;
};

window.translateStationName = function(machineName, villageName = "") {
    if (!machineName) return "";
    const lang = currentLanguage;
    if (lang !== "ta") return machineName;

    if (machineTranslations.ta[machineName]) {
        return machineTranslations.ta[machineName];
    }
    if (villageName && machineTranslations.ta[`${villageName} ${machineName}`]) {
        return machineTranslations.ta[`${villageName} ${machineName}`];
    }

    let translated = machineName;
    for (const [enV, taV] of Object.entries(villageTranslations.ta)) {
        translated = translated.replace(new RegExp(enV, "g"), taV);
    }
    translated = translated
        .replace(/Main RO Water Machine/g, "முதன்மை RO குடிநீர் நிலையம்")
        .replace(/RO Water Machine/g, "RO குடிநீர் நிலையம்")
        .replace(/RO Plant/g, "RO சுத்திகரிப்பு நிலையம்")
        .replace(/RO Station/g, "RO நிலையம்")
        .replace(/RO Center/g, "RO மையம்")
        .replace(/RO Unit/g, "RO பிரிவு")
        .replace(/RO Facility/g, "RO மையம்");

    return translated;
};

// Immediate root attribute setup
document.documentElement.lang = currentLanguage;
document.documentElement.setAttribute("data-lang", currentLanguage);
if (document.body) {
    document.body.classList.toggle("lang-ta", currentLanguage === "ta");
}
document.addEventListener("DOMContentLoaded", () => {
    if (document.body) {
        document.body.classList.toggle("lang-ta", currentLanguage === "ta");
    }
});
