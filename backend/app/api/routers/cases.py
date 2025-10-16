import os
import shutil
from datetime import datetime
from typing import List, Optional

from fastapi import (
    APIRouter, Depends, HTTPException, UploadFile, File, Form, status
)
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Case, CaseNote, Evidence
from app.core.security import hash_password

# -------------------------------
# Router Configuration
# -------------------------------
router = APIRouter(prefix="/cases", tags=["Cases"])

# -------------------------------
# DB Dependency
# -------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# Pydantic Schemas
# -------------------------------
from pydantic import BaseModel

class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CaseResponse(CaseBase):
    id: int
    status: str
    created_by: Optional[str]
    assigned_to: Optional[str]

    class Config:
        orm_mode = True

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None

class CaseNoteCreate(BaseModel):
    case_id: int
    author_id: int
    note: str

class CaseNoteResponse(BaseModel):
    id: int
    note: str
    author_name: str
    created_at: str

    class Config:
        orm_mode = True

# -------------------------------
# CASE MANAGEMENT ROUTES
# -------------------------------

@router.post("/file", response_model=CaseResponse)
def file_new_case(
    title: str = Form(...),
    description: str = Form(...),
    user_email: str = Form(...),
    db: Session = Depends(get_db)
):
    """Civilian files a new case."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_case = Case(
        title=title,
        description=description,
        status="PENDING",
        created_by_id=user.id
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return {
        "id": new_case.id,
        "title": new_case.title,
        "description": new_case.description,
        "status": new_case.status,
        "created_by": user.email,
        "assigned_to": None,
    }


@router.get("/", response_model=List[CaseResponse])
def get_all_cases(db: Session = Depends(get_db)):
    """Registrar: View all cases."""
    cases = db.query(Case).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "created_by": c.created_by.email if c.created_by else None,
            "assigned_to": c.assigned_to.email if c.assigned_to else None,
        }
        for c in cases
    ]


@router.get("/mine/{email}", response_model=List[CaseResponse])
def get_user_cases(email: str, db: Session = Depends(get_db)):
    """Get all cases for a specific user (created or assigned)."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cases = db.query(Case).filter(
        (Case.created_by_id == user.id) | (Case.assigned_to_id == user.id)
    ).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "created_by": c.created_by.email if c.created_by else None,
            "assigned_to": c.assigned_to.email if c.assigned_to else None,
        }
        for c in cases
    ]


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: int, data: CaseUpdate, db: Session = Depends(get_db)):
    """Registrar/Judge/Prosecutor updates case status or assignment."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if data.status:
        case.status = data.status
    if data.assigned_to_id:
        case.assigned_to_id = data.assigned_to_id

    db.commit()
    db.refresh(case)

    return {
        "id": case.id,
        "title": case.title,
        "description": case.description,
        "status": case.status,
        "created_by": case.created_by.email if case.created_by else None,
        "assigned_to": case.assigned_to.email if case.assigned_to else None,
    }

# -------------------------------
# CASE NOTES (COMMENTS)
# -------------------------------
@router.post("/notes", response_model=CaseNoteResponse)
def add_case_note(note_data: CaseNoteCreate, db: Session = Depends(get_db)):
    """Add a note/comment to a case (Judge or Prosecutor)."""
    case = db.query(Case).filter(Case.id == note_data.case_id).first()
    author = db.query(User).filter(User.id == note_data.author_id).first()

    if not case or not author:
        raise HTTPException(status_code=404, detail="Case or author not found")

    note = CaseNote(
        case_id=case.id,
        author_id=author.id,
        note=note_data.note,
        created_at=datetime.utcnow()
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "id": note.id,
        "note": note.note,
        "author_name": author.email,
        "created_at": note.created_at.isoformat(),
    }


@router.get("/{case_id}/notes", response_model=List[CaseNoteResponse])
def get_case_notes(case_id: int, db: Session = Depends(get_db)):
    """Retrieve all notes for a specific case."""
    notes = db.query(CaseNote).filter(CaseNote.case_id == case_id).all()
    return [
        {
            "id": n.id,
            "note": n.note,
            "author_name": n.author.email,
            "created_at": n.created_at.isoformat(),
        }
        for n in notes
    ]

# -------------------------------
# EVIDENCE UPLOAD & RETRIEVAL
# -------------------------------
EVIDENCE_DIR = "uploads/evidence"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

@router.post("/{case_id}/upload-evidence")
def upload_evidence(
    case_id: int,
    uploader_email: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload evidence file for a case (Civilian or Prosecutor)."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    user = db.query(User).filter(User.email == uploader_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Uploader not found")

    file_path = os.path.join(EVIDENCE_DIR, f"{datetime.utcnow().timestamp()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_evidence = Evidence(
        case_id=case.id,
        uploader_id=user.id,
        filename=file.filename,
        filepath=file_path,
        uploaded_at=datetime.utcnow()
    )

    db.add(new_evidence)
    db.commit()

    return {"message": "Evidence uploaded successfully", "filename": file.filename}


@router.get("/{case_id}/evidence")
def get_case_evidence(case_id: int, db: Session = Depends(get_db)):
    """Retrieve all uploaded evidence for a case."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    evidence = db.query(Evidence).filter(Evidence.case_id == case.id).all()

    return [
        {
            "id": e.id,
            "filename": e.filename,
            "uploaded_by": e.uploader.email,
            "uploaded_at": e.uploaded_at.isoformat(),
            "filepath": e.filepath,
        }
        for e in evidence
    ]
