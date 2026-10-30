import os
from urllib.parse import urlparse

# Default database configuration with environment variable support (supports DB_*, TIDB_*, and DATABASE_URL)
DB_CONFIG = {
    "host": os.environ.get("DB_HOST") or os.environ.get("TIDB_HOST") or "localhost",
    "user": os.environ.get("DB_USER") or os.environ.get("TIDB_USER") or "root",
    "password": os.environ.get("DB_PASSWORD") or os.environ.get("TIDB_PASSWORD") or "WaterDB@2026",
    "database": os.environ.get("DB_NAME") or os.environ.get("DB_DATABASE") or os.environ.get("TIDB_DATABASE") or "smart_ro_water_system",
    "port": int(os.environ.get("DB_PORT") or os.environ.get("TIDB_PORT") or 3306),
    "connect_timeout": int(os.environ.get("DB_CONNECT_TIMEOUT", 5))
}

# Support cloud connection strings (e.g. Aiven, TiDB Cloud, Railway, Supabase)
database_url = os.environ.get("DATABASE_URL") or os.environ.get("MYSQL_URL")
if database_url:
    try:
        parsed = urlparse(database_url)
        if parsed.hostname:
            DB_CONFIG["host"] = parsed.hostname
        if parsed.username:
            DB_CONFIG["user"] = parsed.username
        if parsed.password:
            DB_CONFIG["password"] = parsed.password
        if parsed.port:
            DB_CONFIG["port"] = int(parsed.port)
        if parsed.path and len(parsed.path) > 1:
            DB_CONFIG["database"] = parsed.path.lstrip("/")
    except Exception:
        pass

# Optional SSL configuration for managed cloud MySQL databases
is_remote_host = DB_CONFIG["host"] not in ["localhost", "127.0.0.1"]
ssl_explicit_off = os.environ.get("DB_SSL", "").lower() in ["false", "0", "off", "no"]

if (is_remote_host or os.environ.get("DB_SSL", "").lower() in ["true", "1", "required"]) and not ssl_explicit_off:
    DB_CONFIG["ssl_disabled"] = False
    if os.environ.get("DB_SSL_CA"):
        DB_CONFIG["ssl_ca"] = os.environ.get("DB_SSL_CA")
