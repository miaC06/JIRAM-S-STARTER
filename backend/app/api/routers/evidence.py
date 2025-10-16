import os
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import SessionLocal
from app.models import Case, Evidence, User
from pydantic import BaseModel

# -------------------------------------------------------
# Router Configuration
# -------------------------------------------------------
router = APIRouter(prefix="/evidence", tags=["Evidence"])

# Folder for evidence uploads
EVIDENCE_DIR = "uploaded_evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)


# -------------------------------------------------------
# Dependency: Database session
# -------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------------------------------
# Pydantic Schemas
# -------------------------------------------------------
class EvidenceResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    case_title: Optional[str]
    uploader_email: str
    upload_date: str
    category: Optional[str]
    status: str
    remarks: Optional[str]

    class Config:
        orm_mode = True


class EvidenceReview(BaseModel):
    status: str  # e.g., "APPROVED", "REJECTED", "UNDER_REVIEW"
    remarks: Optional[str] = None


# -------------------------------------------------------
# Upload Evidence
# -------------------------------------------------------
@router.post("/", response_model=EvidenceResponse)
async def upload_evidence(
    case_id: int = Form(...),
    uploader_email: str = Form(...),
    category: str = Form("General"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload new evidence (photo, video, pdf, docx, etc.) for a case.
    Civilians and Prosecutors can upload evidence.
    """
    user = db.query(User).filter(User.email == uploader_email).first()
    case = db.query(Case).filter(Case.id == case_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Uploader not found")
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Save file to disk
    safe_filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = os.path.join(EVIDENCE_DIR, safe_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    new_evidence = Evidence(
        case_id=case.id,
        uploader_id=user.id,
        filename=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        category=category,
        status="PENDING",
    )

    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    return {
        "id": new_evidence.id,
        "filename": new_evidence.filename,
        "file_type": new_evidence.file_type,
        "case_title": case.title,
        "uploader_email": user.email,
        "upload_date": new_evidence.upload_date.isoformat(),
        "category": new_evidence.category,
        "status": new_evidence.status,
        "remarks": new_evidence.remarks,
    }


# -------------------------------------------------------
# View Evidence
# -------------------------------------------------------
@router.get("/", response_model=List[EvidenceResponse])
def list_all_evidence(db: Session = Depends(get_db)):
    """
    Registrar, Prosecutor, or Judge: View all evidence in the system.
    """
    ev_list = db.query(Evidence).all()
    return [
        {
            "id": e.id,
            "filename": e.filename,
            "file_type": e.file_type,
            "case_title": e.case.title if e.case else None,
            "uploader_email": e.uploader.email if e.uploader else None,
            "upload_date": e.upload_date.isoformat(),
            "category": e.category,
            "status": e.status,
            "remarks": e.remarks,
        }
        for e in ev_list
    ]


@router.get("/case/{case_id}", response_model=List[EvidenceResponse])
def get_case_evidence(case_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all evidence files associated with a given case.
    """
    ev_list = db.query(Evidence).filter(Evidence.case_id == case_id).all()
    if not ev_list:
        raise HTTPException(status_code=404, detail="No evidence found for this case")

    return [
        {
            "id": e.id,
            "filename": e.filename,
            "file_type": e.file_type,
            "case_title": e.case.title if e.case else None,
            "uploader_email": e.uploader.email if e.uploader else None,
            "upload_date": e.upload_date.isoformat(),
            "category": e.category,
            "status": e.status,
            "remarks": e.remarks,
        }
        for e in ev_list
    ]


@router.get("/uploader/{email}", response_model=List[EvidenceResponse])
def get_user_evidence(email: str, db: Session = Depends(get_db)):
    """
    Retrieve evidence uploaded by a specific user (Civilian, Prosecutor, etc.)
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ev_list = db.query(Evidence).filter(Evidence.uploader_id == user.id).all()
    return [
        {
            "id": e.id,
            "filename": e.filename,
            "file_type": e.file_type,
            "case_title": e.case.title if e.case else None,
            "uploader_email": user.email,
            "upload_date": e.upload_date.isoformat(),
            "category": e.category,
            "status": e.status,
            "remarks": e.remarks,
        }
        for e in ev_list
    ]


# -------------------------------------------------------
# Review / Approve / Reject Evidence
# -------------------------------------------------------
@router.put("/{evidence_id}/review", response_model=EvidenceResponse)
def review_evidence(
    evidence_id: int,
    data: EvidenceReview,
    db: Session = Depends(get_db),
):
    """
    Judge or Registrar updates evidence review status.
    """
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")

    ev.status = data.status
    ev.remarks = data.remarks
    db.commit()
    db.refresh(ev)

    return {
        "id": ev.id,
        "filename": ev.filename,
        "file_type": ev.file_type,
        "case_title": ev.case.title if ev.case else None,
        "uploader_email": ev.uploader.email if ev.uploader else None,
        "upload_date": ev.upload_date.isoformat(),
        "category": ev.category,
        "status": ev.status,
        "remarks": ev.remarks,
    }


# -------------------------------------------------------
# Delete Evidence
# -------------------------------------------------------
@router.delete("/{evidence_id}")
def delete_evidence(evidence_id: int, db: Session = Depends(get_db)):
    """
    Allow authorized users to delete uploaded evidence.
    """
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")

    if os.path.exists(ev.file_path):
        os.remove(ev.file_path)

    db.delete(ev)
    db.commit()
    return {"message": "Evidence deleted successfully"}
