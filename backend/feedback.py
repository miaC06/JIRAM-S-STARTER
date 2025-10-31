# Create a new router file in your backend/app/api/routers folder
New-Item -Path ".\app\api\routers\feedback.py" -ItemType File -Force

# Add a router skeleton to the new file
@"
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("/")
def list_feedback(db: Session = Depends(get_db)):
    return {"message": "List of feedback"}
"@ | Set-Content -Path ".\app\api\routers\feedback.py"

Write-Host "✅ feedback.py created successfully with base router setup."
