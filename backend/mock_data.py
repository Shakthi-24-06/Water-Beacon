"""
Water Beacon - Fallback / In-Memory Dataset
Provides sample data when MySQL database is unreachable (e.g. cloud preview on Vercel without cloud DB).
"""
import copy
from datetime import datetime, timedelta

MOCK_VILLAGES_RAW = [
    {
        "id": 1,
        "name": "Udangudi",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 1,
        "machine_name": "Udangudi Central RO Unit",
        "location": "Bazaar Street, Near Bus Stand",
        "status": "AVAILABLE",
        "water_level_pct": 90,
        "tds_level": 115,
        "tank_capacity_liters": 6000,
        "operator_name": "Selvam R (Panchayat Operator)",
        "operator_phone": "+91 94422 11001",
        "last_updated": datetime.now().isoformat()
    },
    {
        "id": 2,
        "name": "Sathankulam",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 2,
        "machine_name": "Sathankulam Community RO Plant",
        "location": "Panchayat Office Complex",
        "status": "UNDER_MAINTENANCE",
        "water_level_pct": 45,
        "tds_level": 140,
        "tank_capacity_liters": 5000,
        "operator_name": "Murugan S",
        "operator_phone": "+91 94423 22002",
        "last_updated": (datetime.now() - timedelta(minutes=45)).isoformat()
    },
    {
        "id": 3,
        "name": "Nazareth",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 3,
        "machine_name": "Nazareth Model RO Station",
        "location": "Near Railway Feeder Road",
        "status": "AVAILABLE",
        "water_level_pct": 95,
        "tds_level": 105,
        "tank_capacity_liters": 8000,
        "operator_name": "David Johnson",
        "operator_phone": "+91 94424 33003",
        "last_updated": (datetime.now() - timedelta(minutes=15)).isoformat()
    },
    {
        "id": 4,
        "name": "Tiruchendur",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 4,
        "machine_name": "Tiruchendur Pilgrim RO Center",
        "location": "Temple Car Street West",
        "status": "AVAILABLE",
        "water_level_pct": 80,
        "tds_level": 112,
        "tank_capacity_liters": 10000,
        "operator_name": "Kannan V",
        "operator_phone": "+91 94425 44004",
        "last_updated": (datetime.now() - timedelta(minutes=30)).isoformat()
    },
    {
        "id": 5,
        "name": "Kayalpattinam",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 5,
        "machine_name": "Kayalpattinam Coastal RO Point",
        "location": "Coastal Road Junction",
        "status": "OUT_OF_WATER",
        "water_level_pct": 0,
        "tds_level": 160,
        "tank_capacity_liters": 5000,
        "operator_name": "Ahmed Bilal",
        "operator_phone": "+91 94426 55005",
        "last_updated": (datetime.now() - timedelta(hours=2)).isoformat()
    },
    {
        "id": 6,
        "name": "Authoor",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 6,
        "machine_name": "Authoor Betel Leaf RO Facility",
        "location": "Main Market Area",
        "status": "REPAIR",
        "water_level_pct": 25,
        "tds_level": 150,
        "tank_capacity_liters": 4000,
        "operator_name": "Mariappan P",
        "operator_phone": "+91 94427 66006",
        "last_updated": (datetime.now() - timedelta(hours=3)).isoformat()
    },
    {
        "id": 7,
        "name": "Alwarthirunagari",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 7,
        "machine_name": "Alwarthirunagari Smart RO Hub",
        "location": "South Car Street",
        "status": "AVAILABLE",
        "water_level_pct": 88,
        "tds_level": 118,
        "tank_capacity_liters": 5000,
        "operator_name": "Muthu K",
        "operator_phone": "+91 94421 88200",
        "last_updated": (datetime.now() - timedelta(minutes=10)).isoformat()
    },
    {
        "id": 8,
        "name": "Eral",
        "district": "Thoothukudi",
        "state": "Tamil Nadu",
        "machine_id": 8,
        "machine_name": "Eral Riverbank RO Unit",
        "location": "Bridge Approach Road",
        "status": "AVAILABLE",
        "water_level_pct": 72,
        "tds_level": 125,
        "tank_capacity_liters": 6000,
        "operator_name": "Subramanian S",
        "operator_phone": "+91 94428 77007",
        "last_updated": (datetime.now() - timedelta(minutes=20)).isoformat()
    }
]

# Mutable runtime state
MOCK_MACHINES = copy.deepcopy(MOCK_VILLAGES_RAW)

MOCK_MAINTENANCE_LOGS = [
    {
        "id": 1,
        "machine_id": 2,
        "village_name": "Sathankulam",
        "machine_name": "Sathankulam Community RO Plant",
        "issue_type": "Filter Replacement",
        "description": "Routine semi-annual sediment and activated carbon pre-filter replacement.",
        "status": "IN_PROGRESS",
        "started_at": (datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
        "expected_end_at": (datetime.now() + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S"),
        "completed_at": None,
        "updated_by": "Murugan S"
    },
    {
        "id": 2,
        "machine_id": 6,
        "village_name": "Authoor",
        "machine_name": "Authoor Betel Leaf RO Facility",
        "issue_type": "Booster Pump Overhaul",
        "description": "High-pressure pump servicing and valve seal replacement.",
        "status": "OPEN",
        "started_at": (datetime.now() - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
        "expected_end_at": (datetime.now() + timedelta(hours=6)).strftime("%Y-%m-%d %H:%M:%S"),
        "completed_at": None,
        "updated_by": "Mariappan P"
    },
    {
        "id": 3,
        "machine_id": 5,
        "village_name": "Kayalpattinam",
        "machine_name": "Kayalpattinam Coastal RO Point",
        "issue_type": "Feed Pipe Inspection",
        "description": "Checking pipeline intake pressure and restoring inlet flow.",
        "status": "OPEN",
        "started_at": (datetime.now() - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S"),
        "expected_end_at": (datetime.now() + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
        "completed_at": None,
        "updated_by": "Ahmed Bilal"
    }
]

MOCK_COMMUNITY_REPORTS = []


def mock_get_villages(search=""):
    results = []
    search = search.lower() if search else ""
    for v in MOCK_MACHINES:
        if not search or (search in v["name"].lower() or search in v["district"].lower() or search in v["machine_name"].lower()):
            results.append({
                "id": v["id"],
                "name": v["name"],
                "district": v["district"],
                "state": v["state"],
                "machine_id": v["machine_id"],
                "machine_name": v["machine_name"],
                "status": v["status"],
                "water_level_pct": v["water_level_pct"],
                "tds_level": v["tds_level"],
                "tank_capacity_liters": v["tank_capacity_liters"],
                "last_updated": v["last_updated"]
            })
    return results


def mock_get_machines(status_filter="", search=""):
    results = []
    search = search.lower() if search else ""
    status_filter = status_filter.upper() if status_filter else ""

    for m in MOCK_MACHINES:
        if status_filter and m["status"] != status_filter:
            continue
        if search:
            match = (search in m["name"].lower() or
                     search in m["machine_name"].lower() or
                     search in m["location"].lower() or
                     search in m["district"].lower())
            if not match:
                continue

        results.append({
            "id": m["machine_id"],
            "village_id": m["id"],
            "village_name": m["name"],
            "district": m["district"],
            "state": m["state"],
            "machine_name": m["machine_name"],
            "location": m["location"],
            "status": m["status"],
            "water_level_pct": m["water_level_pct"],
            "tds_level": m["tds_level"],
            "tank_capacity_liters": m["tank_capacity_liters"],
            "operator_name": m["operator_name"],
            "operator_phone": m["operator_phone"],
            "last_updated": m["last_updated"]
        })

    # Sort available first
    results.sort(key=lambda x: (0 if x["status"] == "AVAILABLE" else 1, x["village_name"]))
    return results


def mock_get_machine_by_id(machine_id):
    for m in MOCK_MACHINES:
        if m["machine_id"] == machine_id or m["id"] == machine_id:
            return {
                "id": m["machine_id"],
                "village_id": m["id"],
                "village_name": m["name"],
                "district": m["district"],
                "state": m["state"],
                "machine_name": m["machine_name"],
                "location": m["location"],
                "status": m["status"],
                "water_level_pct": m["water_level_pct"],
                "tds_level": m["tds_level"],
                "tank_capacity_liters": m["tank_capacity_liters"],
                "operator_name": m["operator_name"],
                "operator_phone": m["operator_phone"],
                "last_updated": m["last_updated"]
            }
    return None


def mock_update_machine_status(machine_id, data):
    for m in MOCK_MACHINES:
        if m["machine_id"] == machine_id or m["id"] == machine_id:
            if "status" in data:
                m["status"] = data["status"]
            if "water_level_pct" in data:
                try:
                    m["water_level_pct"] = int(data["water_level_pct"])
                except Exception:
                    pass
            if "tds_level" in data:
                try:
                    m["tds_level"] = int(data["tds_level"])
                except Exception:
                    pass
            m["last_updated"] = datetime.now().isoformat()
            return True, m
    return False, None


def mock_get_stats_overview():
    total = len(MOCK_MACHINES)
    available = sum(1 for m in MOCK_MACHINES if m["status"] == "AVAILABLE")
    maintenance = sum(1 for m in MOCK_MACHINES if m["status"] in ["UNDER_MAINTENANCE", "REPAIR"])
    out_of_water = sum(1 for m in MOCK_MACHINES if m["status"] == "OUT_OF_WATER")
    avg_tds = round(sum(m["tds_level"] for m in MOCK_MACHINES) / total) if total > 0 else 115

    return {
        "total_stations": total,
        "available_stations": available,
        "maintenance_stations": maintenance,
        "out_of_water_stations": out_of_water,
        "average_tds": avg_tds,
        "villages_covered": total,
        "availability_percentage": round((available / total) * 100, 1) if total > 0 else 0
    }


def mock_get_maintenance_records():
    return copy.deepcopy(MOCK_MAINTENANCE_LOGS)
