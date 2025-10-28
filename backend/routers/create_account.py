from fastapi import APIRouter, Form, HTTPException, status
from fastapi.responses import JSONResponse
from mysql.connector import Error, IntegrityError
from typing import Optional
from datetime import datetime
from database import get_db_connection
from utils.validators import validate_common, validate_individual, validate_organisation
from utils.security import hash_password

router = APIRouter(prefix="/accounts", tags=["Accounts"])
@router.post("/create")
def create_account(
    email: str = Form(...),
    phone_no: str = Form(...),
    street: str = Form(None),
    town: str = Form(None),
    district: str = Form(None),
    state: str = Form(None),
    country: str = Form("India"),
    pin_code: str = Form(...),
    Type: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    PIN: str = Form(...),
    aadhar: Optional[str] = Form(None),
    pan: Optional[str] = Form(None),
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    dob: Optional[str] = Form(None),
    registration_number: Optional[str] = Form(None),
    organisation_name: Optional[str] = Form(None),
    org_type: Optional[str] = Form(None),
    cif_owner: Optional[str] = Form(None)
):
    account_type = Type.strip().lower()
    if account_type not in ("individual", "organisation"):
        raise HTTPException(status_code=400, detail="Type must be Individual or Organisation")

    # --- Validate ---
    validate_common(phone_no, pin_code, PIN)
    if account_type == "individual":
        validate_individual(aadhar, pan, first_name, last_name, gender, dob)
    else:
        validate_organisation(registration_number, organisation_name, org_type)

    hashed_pw = hash_password(password)
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(buffered=True)

        # Duplicate checks
        cursor.execute("SELECT User_ID FROM Login WHERE User_ID=%s", (username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="username already exists")

        # Insert into Customer
        cursor.execute("""
            INSERT INTO Customer
              (Email, Phone_No, Street, Town, District, State, Country, PIN_Code, Type)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (email, phone_no, street, town, district, state, country, pin_code, Type.capitalize()))
        cif_no = cursor.lastrowid

        # Type-based insert
        if account_type == "individual":
            cursor.execute("""
                INSERT INTO Individual
                  (Aadhaar, PAN, First_Name, Last_Name, Gender, CIF_No, Date_Of_Birth)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (aadhar, pan, first_name, last_name, gender, cif_no, dob))
        else:
            cursor.execute("""
                INSERT INTO Organisation
                  (Reg_No, Org_Name, Org_Type, CIF_No, CIF_Owner, Contact_Number, Email)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (registration_number, organisation_name, org_type, cif_no, cif_owner, phone_no, email))

        # Insert Login
        cursor.execute("""
            INSERT INTO Login (User_ID, CIF_No, Password, PIN, Type)
            VALUES (%s,%s,%s,%s,%s)
        """, (username, cif_no, hashed_pw, PIN, Type.capitalize()))

        conn.commit()
        return JSONResponse(status_code=201, content={"status": "success", "CIF_No": cif_no})

    except IntegrityError as ie:
        if conn: conn.rollback()
        raise HTTPException(status_code=400, detail=f"Integrity error: {ie}")
    except Error as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()
