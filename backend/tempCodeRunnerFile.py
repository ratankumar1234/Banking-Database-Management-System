import mysql.connector
from mysql.connector import Error
DB_CONFIG = {
    "host": "LocalHost",
    "port": 3306,
    "user": "root",
    "password": "mysqlbankdb",
    "database": "bank_management_system"
}
def get_db_connection():
    """Create and return a new database connection."""
    conn = mysql.connector.connect(**DB_CONFIG)
    if conn.is_connected():
        print("Database connection established.")
    return conn
get_db_connection()