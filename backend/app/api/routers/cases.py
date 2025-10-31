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
from pydantic import BaseModel

# ===============================================================
# 🔧 Router Configuration
# ===============================================================
router = APIRouter(prefix="/cases", tags=["Cases"])

# ===============================================================
# 💾 Database Dependency
# ===============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================================================
# 📦 Pydantic Schemas
# ===============================================================
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "General"
    notes: Optional[str] = None


class CaseResponse(CaseBase):
    id: int
    status: str
    created_by: Optional[str]
    assigned_to: Optional[str]
    created_at: Optional[str] = None

    class Config:
        orm_mode = True


class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None


class CaseCivilianUpdate(BaseModel):
    """Update schema for civilians (before review)"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None


class CaseStatusResponse(BaseModel):
    id: int
    title: str
    status: str
    feedback: List[dict] = []  # Admin feedback from case notes
    created_at: str

    class Config:
        orm_mode = True


class CaseNoteCreate(BaseModel):
    case_id: int
    author_id: int
    note: str


class AdminCaseUpdate(BaseModel):
    """Admin update schema - can change status and assignment"""
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None


class AdminFeedbackCreate(BaseModel):
    """Admin feedback schema"""
    case_id: int
    author_email: str
    note: str


class CaseDetailResponse(BaseModel):
    """Complete case details for admin view"""
    id: int
    title: str
    description: Optional[str]
    category: str
    notes: Optional[str]
    status: str
    created_at: str
    created_by: dict
    assigned_to: Optional[dict]
    evidences: List[dict]
    case_notes: List[dict]


class CaseNoteResponse(BaseModel):
    id: int
    note: str
    author_name: str
    created_at: str

    class Config:
        orm_mode = True


# ===============================================================
# ⚖️ CASE MANAGEMENT ROUTES
# ===============================================================
@router.post("/", response_model=CaseResponse)
def create_case(
    case_data: CaseBase,
    user_email: str,
    db: Session = Depends(get_db)
):
    """Civilian creates a new case (JSON endpoint)."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_case = Case(
        title=case_data.title,
        description=case_data.description,
        category=case_data.category or "General",
        notes=case_data.notes,
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
        "category": new_case.category,
        "notes": new_case.notes,
        "status": new_case.status,
        "created_by": user.email,
        "assigned_to": None,
        "created_at": new_case.created_at.isoformat() if new_case.created_at else None,
    }


@router.post("/file", response_model=CaseResponse)
def file_new_case(
    title: str = Form(...),
    description: str = Form(...),
    user_email: str = Form(...),
    category: str = Form("General"),
    notes: str = Form(None),
    db: Session = Depends(get_db)
):
    """Civilian files a new case (Form endpoint for backward compatibility)."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_case = Case(
        title=title,
        description=description,
        category=category,
        notes=notes,
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
        "category": new_case.category,
        "notes": new_case.notes,
        "status": new_case.status,
        "created_by": user.email,
        "assigned_to": None,
        "created_at": new_case.created_at.isoformat() if new_case.created_at else None,
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
            "category": c.category,
            "notes": c.notes,
            "status": c.status,
            "created_by": c.created_by.email if c.created_by else None,
            "assigned_to": c.assigned_to.email if c.assigned_to else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
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
            "category": c.category,
            "notes": c.notes,
            "status": c.status,
            "created_by": c.created_by.email if c.created_by else None,
            "assigned_to": c.assigned_to.email if c.assigned_to else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
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
        "category": case.category,
        "notes": case.notes,
        "status": case.status,
        "created_by": case.created_by.email if case.created_by else None,
        "assigned_to": case.assigned_to.email if case.assigned_to else None,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


@router.put("/{case_id}/civilian", response_model=CaseResponse)
def update_case_by_civilian(
    case_id: int,
    data: CaseCivilianUpdate,
    user_email: str,
    db: Session = Depends(get_db)
):
    """Civilian updates their own case (only before review)."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Only allow update if case is created by this user
    if case.created_by_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this case")

    # Only allow update if case is not yet reviewed
    if case.status not in ["PENDING", "Filed"]:
        raise HTTPException(status_code=400, detail="Cannot update case after review has started")

    if data.title:
        case.title = data.title
    if data.description:
        case.description = data.description
    if data.category:
        case.category = data.category
    if data.notes:
        case.notes = data.notes

    db.commit()
    db.refresh(case)

    return {
        "id": case.id,
        "title": case.title,
        "description": case.description,
        "category": case.category,
        "notes": case.notes,
        "status": case.status,
        "created_by": case.created_by.email if case.created_by else None,
        "assigned_to": case.assigned_to.email if case.assigned_to else None,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    user_email: str,
    db: Session = Depends(get_db)
):
    """Delete a case (only by creator, and only before review)."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Only allow deletion if case is created by this user
    if case.created_by_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this case")

    # Only allow deletion if case is not yet reviewed
    if case.status not in ["PENDING", "Filed"]:
        raise HTTPException(status_code=400, detail="Cannot delete case after review has started")

    db.delete(case)
    db.commit()

    return {"message": "Case deleted successfully", "case_id": case_id}


@router.get("/{case_id}/status", response_model=CaseStatusResponse)
def get_case_status(
    case_id: int,
    db: Session = Depends(get_db)
):
    """Get case status with admin feedback."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Get all case notes as feedback
    feedback = [
        {
            "author": note.author.email if note.author else "Admin",
            "note": note.note,
            "created_at": note.created_at.isoformat() if note.created_at else None,
        }
        for note in case.case_notes
    ]

    return {
        "id": case.id,
        "title": case.title,
        "status": case.status,
        "feedback": feedback,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


# ===============================================================
# 🗒️ CASE NOTES (COMMENTS)
# ===============================================================
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


# ===============================================================
# 📂 EVIDENCE UPLOAD & RETRIEVAL
# ===============================================================
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

    # Build safe file path
    safe_name = os.path.basename(file.filename)
    file_path = os.path.join(EVIDENCE_DIR, f"{datetime.utcnow().timestamp()}_{safe_name}")

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create DB record
    new_evidence = Evidence(
        case_id=case.id,
        uploader_id=user.id,                # ✅ matches model
        filename=safe_name,
        filetype=file.content_type,         # ✅ store MIME type
        file_path=file_path,                # ✅ consistent field name
        uploaded_at=datetime.utcnow()
    )

    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    return {
        "message": "Evidence uploaded successfully",
        "filename": new_evidence.filename,
        "uploaded_by": user.email,
        "filetype": new_evidence.filetype
    }


# ===============================================================
# 👔 ADMIN ENDPOINTS
# ===============================================================

@router.get("/admin/all", response_model=List[CaseResponse])
def admin_get_all_cases(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Admin: Get all cases with optional filters."""
    query = db.query(Case)
    
    # Filter by status
    if status and status != "all":
        query = query.filter(Case.status == status)
    
    # Search by title or description
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Case.title.ilike(search_term)) | 
            (Case.description.ilike(search_term))
        )
    
    cases = query.order_by(Case.created_at.desc()).all()
    
    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "notes": c.notes,
            "status": c.status,
            "created_by": c.created_by.email if c.created_by else None,
            "assigned_to": c.assigned_to.email if c.assigned_to else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in cases
    ]


@router.get("/admin/{case_id}", response_model=CaseDetailResponse)
def admin_get_case_details(
    case_id: int,
    db: Session = Depends(get_db)
):
    """Admin: Get complete case details including evidence and notes."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get evidences
    evidences = [
        {
            "id": e.id,
            "filename": e.filename,
            "filetype": e.filetype,
            "file_path": e.file_path,
            "category": e.category,
            "status": e.status,
            "uploaded_at": e.uploaded_at.isoformat() if e.uploaded_at else None,
            "uploader": e.uploader.email if e.uploader else None,
        }
        for e in case.evidences
    ]
    
    # Get case notes (feedback)
    case_notes = [
        {
            "id": n.id,
            "note": n.note,
            "author": n.author.email if n.author else "Admin",
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in case.case_notes
    ]
    
    return {
        "id": case.id,
        "title": case.title,
        "description": case.description,
        "category": case.category,
        "notes": case.notes,
        "status": case.status,
        "created_at": case.created_at.isoformat() if case.created_at else None,
        "created_by": {
            "id": case.created_by.id,
            "email": case.created_by.email,
            "role": case.created_by.role,
        } if case.created_by else None,
        "assigned_to": {
            "id": case.assigned_to.id,
            "email": case.assigned_to.email,
            "role": case.assigned_to.role,
        } if case.assigned_to else None,
        "evidences": evidences,
        "case_notes": case_notes,
    }


@router.put("/admin/{case_id}", response_model=CaseResponse)
def admin_update_case(
    case_id: int,
    update_data: AdminCaseUpdate,
    admin_email: str,
    db: Session = Depends(get_db)
):
    """Admin: Update case status and assignment."""
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    # Check if user has admin role
    if admin.role not in ["PROSECUTOR", "JUDGE", "REGISTRAR"]:
        raise HTTPException(status_code=403, detail="Not authorized - admin role required")
    
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Track if status is being changed to REVIEWED
    old_status = case.status
    status_changed_to_reviewed = False
    
    # Update fields
    if update_data.status:
        case.status = update_data.status
        if update_data.status.upper() == "REVIEWED" and old_status.upper() != "REVIEWED":
            status_changed_to_reviewed = True
    
    if update_data.assigned_to_id:
        case.assigned_to_id = update_data.assigned_to_id
    
    db.commit()
    db.refresh(case)
    
    # Auto-create hearing if status changed to REVIEWED
    if status_changed_to_reviewed:
        from app.models import Hearing
        from datetime import timedelta
        
        # Check if hearing already exists for this case
        existing_hearing = db.query(Hearing).filter(Hearing.case_id == case.id).first()
        
        if not existing_hearing:
            # Schedule hearing 7 days from now
            scheduled_date = datetime.utcnow() + timedelta(days=7)
            
            # Create hearing with registrar who updated the case
            new_hearing = Hearing(
                case_id=case.id,
                registrar_id=admin.id,  # The admin who changed status
                judge_id=None,  # To be assigned later
                scheduled_date=scheduled_date,
                location="Main Court Room",
                notes=f"Hearing automatically scheduled after case review by {admin.email}",
                status="Scheduled"
            )
            
            db.add(new_hearing)
            db.commit()
            db.refresh(new_hearing)
    
    return {
        "id": case.id,
        "title": case.title,
        "description": case.description,
        "category": case.category,
        "notes": case.notes,
        "status": case.status,
        "created_by": case.created_by.email if case.created_by else None,
        "assigned_to": case.assigned_to.email if case.assigned_to else None,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


@router.post("/admin/feedback")
def admin_add_feedback(
    feedback: AdminFeedbackCreate,
    db: Session = Depends(get_db)
):
    """Admin: Add feedback/note to a case."""
    admin = db.query(User).filter(User.email == feedback.author_email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    # Check if user has admin role
    if admin.role not in ["PROSECUTOR", "JUDGE", "REGISTRAR"]:
        raise HTTPException(status_code=403, detail="Not authorized - admin role required")
    
    case = db.query(Case).filter(Case.id == feedback.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    note = CaseNote(
        case_id=feedback.case_id,
        author_id=admin.id,
        note=feedback.note,
        created_at=datetime.utcnow()
    )
    
    db.add(note)
    db.commit()
    db.refresh(note)
    
    return {
        "id": note.id,
        "note": note.note,
        "author": admin.email,
        "created_at": note.created_at.isoformat(),
        "message": "Feedback added successfully"
    }


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
            "uploaded_by": e.uploader.email if e.uploader else None,
            "uploaded_at": e.uploaded_at.isoformat(),
            "file_path": e.file_path,
            "filetype": e.filetype,
        }
        for e in evidence
    ]
