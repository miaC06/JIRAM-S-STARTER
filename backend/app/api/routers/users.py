from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/users", tags=["Users"])

# Example endpoints:
@router.get("/", response_model=List[str])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [user.email for user in users]
