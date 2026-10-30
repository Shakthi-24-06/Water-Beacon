"""
Water Beacon - Root Application Entrypoint
Exposes the Flask `app` instance from backend/app.py for Flask CLI, WSGI servers, and automated deployment runners.
"""
import os
import sys

# Ensure root directory and backend directory are on sys.path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

for directory in [ROOT_DIR, BACKEND_DIR]:
    if directory not in sys.path:
        sys.path.insert(0, directory)

from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "127.0.0.1")
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ["1", "true", "yes"]
    app.run(host=host, port=port, debug=debug)
