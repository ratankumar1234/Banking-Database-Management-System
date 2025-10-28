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
    return mysql.connector.connect(**DB_CONFIG)

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="your_password",
            database="Bank_Management_System"
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None