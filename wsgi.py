"""
Water Beacon - WSGI Entrypoint
"""
import os
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

for directory in [ROOT_DIR, BACKEND_DIR]:
    if directory not in sys.path:
        sys.path.insert(0, directory)

from app import app

if __name__ == "__main__":
    app.run()
