from fastapi import APIRouter, Form, HTTPException
from database import get_db_connection as get_connection

router = APIRouter(
    prefix="/customer-details",
    tags=["Customer Details"]
)

@router.post("/")
def get_customer_details(username: str = Form(...)):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)

    # 1️⃣ Get CIF_No and Type from Login table
    cursor.execute("SELECT CIF_No, Type FROM Login WHERE User_ID = %s", (username,))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cif_no = user["CIF_No"]
    user_type = user["Type"]

    # 2️⃣ Get Customer details
    cursor.execute("SELECT * FROM Customer WHERE CIF_No = %s", (cif_no,))
    customer = cursor.fetchone()

    # 3️⃣ Get Individual or Organisation details based on type
    if user_type == "Individual":
        cursor.execute("SELECT * FROM Individual WHERE CIF_No = %s", (cif_no,))
        specific_details = cursor.fetchone()
    elif user_type == "Organisation":
        cursor.execute("SELECT * FROM Organisation WHERE CIF_No = %s", (cif_no,))
        specific_details = cursor.fetchone()
    else:
        specific_details = None

    # 4️⃣ Get all Accounts for the customer
    cursor.execute("SELECT * FROM Account WHERE CIF_No = %s", (cif_no,))
    accounts = cursor.fetchall()

    cursor.close()
    conn.close()

    # 5️⃣ Combine and return data
    return {
        "Customer": customer,
        "Specific_Details": specific_details,
        "Accounts": accounts
    }
