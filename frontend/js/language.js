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
        brandWater: "Water",
        brandBeacon: "Beacon",
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
        notAvailable: "N/A"
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
        aboutTitle: "Water Beacon பற்றி",
        aboutDescription: "Water Beacon என்பது கிராம மக்கள் வீண் அலைச்சலின்றி RO குடிநீர் கிடைப்பதை வீட்டில் இருந்தே அறிய உதவும் நேரடி தளமாகும்.",
        feature1Title: "செல்வதற்கு முன் தெரிந்துகொள்ளுங்கள்",
        feature1Desc: "வெயிலில் சென்று ஏமாற்றம் அடையாமல் முன்கூட்டியே அறியலாம்.",
        feature2Title: "உள்ளூர் நேரடி புதுப்பிப்புகள்",
        feature2Desc: "ஊராட்சி RO பணியாளர்களால் உடனடியாக புதுப்பிக்கப்படும் தகவல்.",
        feature3Title: "மக்கள் புகார் வசதி",
        feature3Desc: "குடிநீர் சுவை, கசிவு அல்லது இயந்திர குறைபாடுகளை உடனடியாக தெரிவிக்கலாம்.",

        // Footer
        footerTagline: "ஸ்மார்ட் RO குடிநீர் கண்காணிப்பு தளம்",
        footerRights: "Water Beacon. தூய குடிநீர் பாதுகாப்பு மற்றும் கிராம நலனுக்காக உருவாக்கப்பட்டது.",
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
        howItWorksLead: "வீட்டை விட்டு கிளம்புவதற்கு முன் கிராமத்தின் RO குடிநீர் இருப்பு மற்றும் தரத்தை எளிதாக அறிய உதவுகிறது.",
        brandWater: "வாட்டர்",
        brandBeacon: "பீக்கன்",
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
        notAvailable: "இல்லை"
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

    // Trigger custom event so any dynamic components re-render their labels
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
        "Local Panchayat Operator": "உள்ளூர் ஊராட்சி பணியாளர்"
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

window.translateMachine = function(machine) {
    if (!machine) return "";
    const lang = currentLanguage;
    if (lang === "ta" && machineTranslations.ta[machine]) {
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
