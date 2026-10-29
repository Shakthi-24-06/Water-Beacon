import os
import sys
import mysql.connector

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from config import DB_CONFIG

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)
