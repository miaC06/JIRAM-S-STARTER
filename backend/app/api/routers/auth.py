from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator, Field
import re

from app.database import get_db
from app import models
from app.core.security import verify_password, create_access_token, hash_password

# ===============================================================
# 🔐 Authentication Router
# ===============================================================
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ===============================================================
# 📋 Pydantic Schemas
# ===============================================================
class UserRegistration(BaseModel):
    username: str = Field(..., min_length=6, max_length=15)
    email: str = Field(..., min_length=6, max_length=20)
    password: str = Field(..., min_length=6, max_length=20)
    role: str = Field(default="CIVILIAN")

    @validator('username')
    def validate_username(cls, v):
        # Must only contain letters, numbers, and hyphens
        if not re.match(r'^[a-zA-Z0-9-]+$', v):
            raise ValueError('Username must only contain letters, numbers, and hyphens')
        
        # Count letters
        letter_count = sum(1 for c in v if c.isalpha())
        if letter_count < 4:
            raise ValueError('Username must contain at least 4 letters')
        
        return v
    
    @validator('email')
    def validate_email(cls, v):
        # Length validation
        if len(v) < 6 or len(v) > 20:
            raise ValueError('Email must be 6-20 characters')
        
        # Basic email format validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        
        # Count letters (only alphabetic characters)
        letter_count = sum(1 for c in v if c.isalpha())
        if letter_count < 4:
            raise ValueError('Email must contain at least 4 letters')
        
        return v.lower()
    
    @validator('role')
    def validate_role(cls, v):
        allowed_roles = ['CIVILIAN', 'REGISTRAR', 'JUDGE', 'PROSECUTOR']
        if v.upper() not in allowed_roles:
            raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v.upper()

# ===============================================================
# 🔑 Login Endpoint
# ===============================================================
@router.post("/token")
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT token + user info.
    - username = email (as per OAuth2PasswordRequestForm standard)
    - password is validated against the stored bcrypt hash
    """

    # Find user by email (form.username)
    user = db.query(models.User).filter(models.User.email == form.username).first()

    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create JWT access token
    access_token = create_access_token(
        subject=user.email,
        roles=[user.role],
    )

    # Return token and user details
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }


# ===============================================================
# 🧩 Registration Endpoint
# ===============================================================
@router.post("/register")
def register_user(
    user_data: UserRegistration,
    db: Session = Depends(get_db)
):
    """
    Register a new user with validation:
    - Username: 6-15 chars, letters/numbers/hyphens, min 4 letters
    - Email: 6-20 chars, valid format, min 4 letters
    - Password: 6-20 chars
    - Role: CIVILIAN, REGISTRAR, JUDGE, or PROSECUTOR
    """

    # Check if username already exists
    existing_username = db.query(models.User).filter(
        models.User.username == user_data.username
    ).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Check if email already exists
    existing_email = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Securely hash password
    hashed_password = hash_password(user_data.password)

    # Create and save new user
    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "✅ User registered successfully",
        "email": new_user.email,
        "role": new_user.role
    }
