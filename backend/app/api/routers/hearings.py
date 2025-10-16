from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Case, Hearing, User

router = APIRouter(prefix="/hearings", tags=["Hearings"])

# ---------------------------
# DB DEPENDENCY
# ---------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# SCHEMAS
# ---------------------------
from pydantic import BaseModel

class HearingCreate(BaseModel):
    case_id: int
    scheduled_date: datetime
    location: str
    registrar_email: str
    judge_id: Optional[int] = None


class HearingResponse(BaseModel):
    id: int
    case_title: str
    judge_name: Optional[str]
    registrar_name: str
    scheduled_date: str
    location: str
    status: str
    notes: Optional[str]

    class Config:
        orm_mode = True


class HearingUpdate(BaseModel):
    scheduled_date: Optional[datetime] = None
    location: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    judge_id: Optional[int] = None


# ---------------------------
# ROUTES
# ---------------------------

@router.post("/", response_model=HearingResponse)
def schedule_hearing(data: HearingCreate, db: Session = Depends(get_db)):
    """
    Registrar schedules a hearing for a specific case.
    Optionally assigns a judge.
    """
    case = db.query(Case).filter(Case.id == data.case_id).first()
    registrar = db.query(User).filter(User.email == data.registrar_email).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")

    hearing = Hearing(
        case_id=data.case_id,
        registrar_id=registrar.id,
        judge_id=data.judge_id,
        scheduled_date=data.scheduled_date,
        location=data.location,
        status="SCHEDULED"
    )

    db.add(hearing)
    db.commit()
    db.refresh(hearing)

    return {
        "id": hearing.id,
        "case_title": case.title,
        "judge_name": hearing.judge.email if hearing.judge else None,
        "registrar_name": registrar.email,
        "scheduled_date": hearing.scheduled_date.isoformat(),
        "location": hearing.location,
        "status": hearing.status,
        "notes": hearing.notes,
    }


@router.get("/", response_model=List[HearingResponse])
def get_all_hearings(db: Session = Depends(get_db)):
    """Registrar: View all hearings in the system."""
    hearings = db.query(Hearing).all()
    return [
        {
            "id": h.id,
            "case_title": h.case.title,
            "judge_name": h.judge.email if h.judge else None,
            "registrar_name": h.registrar.email if h.registrar else None,
            "scheduled_date": h.scheduled_date.isoformat(),
            "location": h.location,
            "status": h.status,
            "notes": h.notes,
        }
        for h in hearings
    ]


@router.get("/case/{case_id}", response_model=List[HearingResponse])
def get_case_hearings(case_id: int, db: Session = Depends(get_db)):
    """View all hearings related to a specific case."""
    hearings = db.query(Hearing).filter(Hearing.case_id == case_id).all()
    if not hearings:
        raise HTTPException(status_code=404, detail="No hearings found for this case")

    return [
        {
            "id": h.id,
            "case_title": h.case.title,
            "judge_name": h.judge.email if h.judge else None,
            "registrar_name": h.registrar.email if h.registrar else None,
            "scheduled_date": h.scheduled_date.isoformat(),
            "location": h.location,
            "status": h.status,
            "notes": h.notes,
        }
        for h in hearings
    ]


@router.get("/judge/{judge_id}", response_model=List[HearingResponse])
def get_judge_hearings(judge_id: int, db: Session = Depends(get_db)):
    """View all hearings assigned to a particular judge."""
    hearings = db.query(Hearing).filter(Hearing.judge_id == judge_id).all()
    return [
        {
            "id": h.id,
            "case_title": h.case.title,
            "judge_name": h.judge.email if h.judge else None,
            "registrar_name": h.registrar.email if h.registrar else None,
            "scheduled_date": h.scheduled_date.isoformat(),
            "location": h.location,
            "status": h.status,
            "notes": h.notes,
        }
        for h in hearings
    ]


@router.put("/{hearing_id}", response_model=HearingResponse)
def update_hearing(hearing_id: int, data: HearingUpdate, db: Session = Depends(get_db)):
    """
    Update hearing details (Registrar or Judge).
    Can update date, location, notes, or status.
    """
    hearing = db.query(Hearing).filter(Hearing.id == hearing_id).first()
    if not hearing:
        raise HTTPException(status_code=404, detail="Hearing not found")

    if data.scheduled_date:
        hearing.scheduled_date = data.scheduled_date
    if data.location:
        hearing.location = data.location
    if data.status:
        hearing.status = data.status
    if data.notes:
        hearing.notes = data.notes
    if data.judge_id:
        hearing.judge_id = data.judge_id

    db.commit()
    db.refresh(hearing)

    return {
        "id": hearing.id,
        "case_title": hearing.case.title,
        "judge_name": hearing.judge.email if hearing.judge else None,
        "registrar_name": hearing.registrar.email if hearing.registrar else None,
        "scheduled_date": hearing.scheduled_date.isoformat(),
        "location": hearing.location,
        "status": hearing.status,
        "notes": hearing.notes,
    }


@router.delete("/{hearing_id}")
def delete_hearing(hearing_id: int, db: Session = Depends(get_db)):
    """Allow Registrar to delete or cancel a hearing."""
    hearing = db.query(Hearing).filter(Hearing.id == hearing_id).first()
    if not hearing:
        raise HTTPException(status_code=404, detail="Hearing not found")

    db.delete(hearing)
    db.commit()

    return {"message": "Hearing deleted successfully"}
