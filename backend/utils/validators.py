import re
from fastapi import HTTPException, status
from datetime import datetime

PHONE_RE = re.compile(r"^[0-9]{10}$")
PIN_RE = re.compile(r"^[0-9]{6}$")
AADHAAR_RE = re.compile(r"^[0-9]{12}$")
PAN_RE = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
REGNO_RE = re.compile(r"^[0-9]{10}$")

def validate_common(phone_no, pin_code, PIN):
    if not PHONE_RE.match(phone_no):
        raise HTTPException(status_code=400, detail="phone_no must be 10 digits")
    if not PIN_RE.match(pin_code):
        raise HTTPException(status_code=400, detail="pin_code must be 6 digits")
    if not PIN_RE.match(PIN):
        raise HTTPException(status_code=400, detail="PIN must be 6 digits")

def validate_individual(aadhar, pan, first_name, last_name, gender, dob):
    from datetime import datetime
    missing = []
    for f, v in [("aadhar", aadhar), ("pan", pan), ("first_name", first_name),
                 ("last_name", last_name), ("gender", gender), ("dob", dob)]:
        if not v:
            missing.append(f)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    if not AADHAAR_RE.match(aadhar):
        raise HTTPException(status_code=400, detail="aadhar must be 12 digits")
    if not PAN_RE.match(pan):
        raise HTTPException(status_code=400, detail="pan must match PAN format (ABCDE1234F)")
    try:
        datetime.strptime(dob, "%Y-%m-%d")
    except Exception:
        raise HTTPException(status_code=400, detail="dob must be YYYY-MM-DD format")

def validate_organisation(reg_no, org_name, org_type):
    missing = []
    for f, v in [("registration_number", reg_no),
                 ("organisation_name", org_name), ("org_type", org_type)]:
        if not v:
            missing.append(f)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    if not REGNO_RE.match(reg_no):
        raise HTTPException(status_code=400, detail="registration_number must be 10 digits")
def validate_account_type(account_type):
    account_type = account_type.strip().lower()
    if account_type not in ("individual", "organisation"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Type must be either 'Individual' or 'Organisation'")
    return account_type