"""
Water Beacon - Vercel Serverless Function Entrypoint
Exposes the Flask `app` instance for Vercel's Python serverless runtime.
"""
import os
import sys

# Ensure project root and backend directory are in sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

for directory in [ROOT_DIR, BACKEND_DIR]:
    if directory not in sys.path:
        sys.path.insert(0, directory)

from backend.app import app

# Vercel serverless function expects `app` at module level
if __name__ == "__main__":
    app.run()
