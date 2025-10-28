from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection as get_connection
from utils.security import verify_password

router = APIRouter(
    prefix="/login",
    tags=["Login"]
)

# Schema for login request
class LoginRequest(BaseModel):
    username: str
    password: str
    type: str

@router.post("/")
def login_user(login_data: LoginRequest):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM Login
        WHERE User_ID = %s  AND `Type` = %s
    """
    cursor.execute(query, (login_data.username, login_data.type))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user and verify_password(login_data.password, user["Password"]):
        return {"message": "Login successful", "CIF_No": user["CIF_No"], "Type": user["Type"]}
    else:
        raise HTTPException(status_code=401, detail="Invalid username, password, or type")
