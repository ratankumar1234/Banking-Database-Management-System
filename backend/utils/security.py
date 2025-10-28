from passlib.hash import bcrypt
from fastapi import HTTPException

def hash_password(password: str) -> str:
    """Hashes a plain password using bcrypt."""
    if len(password.encode("utf-8")) > 72:
        password = password[:72]
    try:
        full_hash = bcrypt.hash(password)
        return full_hash
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password hashing failed: {str(e)}")
    
    
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the hashed password."""
    try:
        return bcrypt.verify(plain_password, hashed_password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password verification failed: {str(e)}")
