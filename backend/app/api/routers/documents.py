# backend/app/api/routers/documents.py
import os
from datetime import datetime
from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session

from pydantic import BaseModel
from app.database import SessionLocal
from app.models import Case, Document, User


# ---------------------------------------------------------------------
# Router Setup
# ---------------------------------------------------------------------
router = APIRouter(prefix="/documents", tags=["Documents"])

# Directory where uploaded files will be stored
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------------------------------------------------
# Database Dependency
# ---------------------------------------------------------------------
def get_db():
    """
    Provides a SQLAlchemy session for each request.
    Ensures proper cleanup after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------
# Pydantic Schemas (Python 3.9 compatible)
# ---------------------------------------------------------------------
class DocumentResponse(BaseModel):
    id: int
    filename: str
    case_title: Optional[str]
    uploader_email: Optional[str]
    upload_date: str
    file_type: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2


# ---------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------
@router.post("/", response_model=DocumentResponse)
async def upload_document(
    case_id: int = Form(...),
    uploader_email: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a new document for a specific case.
    Civilian, Prosecutor, Judge, or Registrar can upload.
    """
    user = db.query(User).filter(User.email == uploader_email).first()
    case = db.query(Case).filter(Case.id == case_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Uploader not found")
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Prevent directory traversal & name collisions
    safe_filename = os.path.basename(file.filename)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

    # Save uploaded file to disk
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Create DB record
    new_doc = Document(
        filename=safe_filename,
        file_path=file_path,
        uploader_id=user.id,
        case_id=case.id,
        file_type=file.content_type,
        description=description,
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "id": new_doc.id,
        "filename": new_doc.filename,
        "case_title": case.title,
        "uploader_email": user.email,
        "upload_date": new_doc.upload_date.isoformat(),
        "file_type": new_doc.file_type,
        "description": new_doc.description,
    }


@router.get("/", response_model=List[DocumentResponse])
def list_all_documents(db: Session = Depends(get_db)):
    """
    Registrar or Judge: View all uploaded documents in the system.
    """
    docs = db.query(Document).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "case_title": d.case.title if d.case else None,
            "uploader_email": d.uploader.email if d.uploader else None,
            "upload_date": d.upload_date.isoformat(),
            "file_type": d.file_type,
            "description": d.description,
        }
        for d in docs
    ]


@router.get("/case/{case_id}", response_model=List[DocumentResponse])
def get_case_documents(case_id: int, db: Session = Depends(get_db)):
    """
    View all documents for a particular case.
    """
    docs = db.query(Document).filter(Document.case_id == case_id).all()
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found for this case")

    return [
        {
            "id": d.id,
            "filename": d.filename,
            "case_title": d.case.title if d.case else None,
            "uploader_email": d.uploader.email if d.uploader else None,
            "upload_date": d.upload_date.isoformat(),
            "file_type": d.file_type,
            "description": d.description,
        }
        for d in docs
    ]


@router.get("/uploader/{email}", response_model=List[DocumentResponse])
def get_user_documents(email: str, db: Session = Depends(get_db)):
    """
    View all documents uploaded by a specific user.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    docs = db.query(Document).filter(Document.uploader_id == user.id).all()

    return [
        {
            "id": d.id,
            "filename": d.filename,
            "case_title": d.case.title if d.case else None,
            "uploader_email": user.email,
            "upload_date": d.upload_date.isoformat(),
            "file_type": d.file_type,
            "description": d.description,
        }
        for d in docs
    ]


@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    """
    Allow authorized users to delete an uploaded document.
    """
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove file from disk if present
    if doc.file_path and os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully"}
