# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import create_account, login, customer_details

app = FastAPI(title="Bank Management Account Service")

# Allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(create_account.router)
app.include_router(login.router)
app.include_router(customer_details.router)
@app.get("/")
def root():
    return {"message": "Bank Management API is running!"}
