from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.core.security import verify_password, create_access_token

# Define API router with prefix /auth
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token")
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT token + user info (email, role).
    - username = email (as per OAuth2PasswordRequestForm standard)
    - password is validated against the stored hash
    """

    # Fetch user by email
    user = db.query(models.User).filter(models.User.email == form.username).first()

    # Validate user and password
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Generate JWT token
    access_token = create_access_token(
        subject=user.email,
        roles=[user.role]  # Pass role into token for claims
    )

    # ✅ Return token along with user info for frontend redirection
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "role": user.role,
        },
    }
