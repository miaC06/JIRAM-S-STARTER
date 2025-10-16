from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.database import SessionLocal
from app.models import Payment, User, Case

router = APIRouter(prefix="/payments", tags=["Payments"])


# -------------------------------------------------------
# Database Dependency
# -------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------------------------------
# Schemas
# -------------------------------------------------------
class PaymentCreate(BaseModel):
    case_id: int
    payer_email: str
    amount: float
    payment_type: str  # e.g., "FILING_FEE", "FINE", "PENALTY"
    reference: Optional[str] = None


class PaymentResponse(BaseModel):
    id: int
    payer_email: str
    case_title: Optional[str]
    amount: float
    payment_type: str
    status: str
    date: str
    reference: Optional[str]

    class Config:
        orm_mode = True


class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    reference: Optional[str] = None


# -------------------------------------------------------
# ROUTES
# -------------------------------------------------------

@router.post("/", response_model=PaymentResponse)
def make_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db)
):
    """
    Civilian makes a payment for a case.
    """
    payer = db.query(User).filter(User.email == data.payer_email).first()
    case = db.query(Case).filter(Case.id == data.case_id).first()

    if not payer:
        raise HTTPException(status_code=404, detail="Payer not found")
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    new_payment = Payment(
        case_id=case.id,
        payer_id=payer.id,
        amount=data.amount,
        payment_type=data.payment_type,
        status="PENDING",
        reference=data.reference or f"REF-{datetime.utcnow().timestamp()}",
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return {
        "id": new_payment.id,
        "payer_email": payer.email,
        "case_title": case.title,
        "amount": new_payment.amount,
        "payment_type": new_payment.payment_type,
        "status": new_payment.status,
        "date": new_payment.date.isoformat(),
        "reference": new_payment.reference,
    }


@router.get("/", response_model=List[PaymentResponse])
def get_all_payments(db: Session = Depends(get_db)):
    """
    Registrar or Admin: View all payments in the system.
    """
    payments = db.query(Payment).all()
    return [
        {
            "id": p.id,
            "payer_email": p.payer.email if p.payer else None,
            "case_title": p.case.title if p.case else None,
            "amount": p.amount,
            "payment_type": p.payment_type,
            "status": p.status,
            "date": p.date.isoformat(),
            "reference": p.reference,
        }
        for p in payments
    ]


@router.get("/case/{case_id}", response_model=List[PaymentResponse])
def get_case_payments(case_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all payments related to a case.
    """
    payments = db.query(Payment).filter(Payment.case_id == case_id).all()
    if not payments:
        raise HTTPException(status_code=404, detail="No payments found for this case")

    return [
        {
            "id": p.id,
            "payer_email": p.payer.email if p.payer else None,
            "case_title": p.case.title if p.case else None,
            "amount": p.amount,
            "payment_type": p.payment_type,
            "status": p.status,
            "date": p.date.isoformat(),
            "reference": p.reference,
        }
        for p in payments
    ]


@router.get("/payer/{email}", response_model=List[PaymentResponse])
def get_user_payments(email: str, db: Session = Depends(get_db)):
    """
    Retrieve all payments made by a user.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    payments = db.query(Payment).filter(Payment.payer_id == user.id).all()

    return [
        {
            "id": p.id,
            "payer_email": user.email,
            "case_title": p.case.title if p.case else None,
            "amount": p.amount,
            "payment_type": p.payment_type,
            "status": p.status,
            "date": p.date.isoformat(),
            "reference": p.reference,
        }
        for p in payments
    ]


@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, data: PaymentUpdate, db: Session = Depends(get_db)):
    """
    Registrar confirms or updates payment details (status, reference).
    """
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if data.status:
        payment.status = data.status
    if data.reference:
        payment.reference = data.reference

    db.commit()
    db.refresh(payment)

    return {
        "id": payment.id,
        "payer_email": payment.payer.email if payment.payer else None,
        "case_title": payment.case.title if payment.case else None,
        "amount": payment.amount,
        "payment_type": payment.payment_type,
        "status": payment.status,
        "date": payment.date.isoformat(),
        "reference": payment.reference,
    }


@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    """
    Delete a payment record (Admin or Registrar only).
    """
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    db.delete(payment)
    db.commit()
    return {"message": "Payment deleted successfully"}
