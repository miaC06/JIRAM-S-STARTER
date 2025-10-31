from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models import User, Case

router = APIRouter(prefix="/users", tags=["Users"])


# ===============================================================
# Pydantic Schemas
# ===============================================================
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_cases_count: int
    
    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None


# ===============================================================
# List All Users (Registrar Only)
# ===============================================================
@router.get("/all", response_model=List[UserResponse])
def list_all_users(
    registrar_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Registrar: View all users in the system with stats.
    """
    # Verify registrar
    registrar = db.query(User).filter(User.email == registrar_email).first()
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")
    
    if registrar.role != "REGISTRAR":
        raise HTTPException(status_code=403, detail="Only registrars can view all users")
    
    # Get all users
    users = db.query(User).all()
    
    result = []
    for user in users:
        # Count cases created by this user
        cases_count = db.query(Case).filter(Case.created_by_id == user.id).count()
        
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": getattr(user, 'is_active', True),  # Default to True if column doesn't exist
            "created_cases_count": cases_count
        })
    
    return result


# ===============================================================
# Get Users by Role
# ===============================================================
@router.get("/role/{role}", response_model=List[dict])
def get_users_by_role(
    role: str,
    db: Session = Depends(get_db)
):
    """
    Get all users with a specific role (for case assignments).
    """
    valid_roles = ["CIVILIAN", "REGISTRAR", "JUDGE", "PROSECUTOR"]
    role_upper = role.upper()
    
    if role_upper not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")
    
    users = db.query(User).filter(User.role == role_upper).all()
    
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]


# ===============================================================
# Get Single User Details
# ===============================================================
@router.get("/{user_id}", response_model=UserResponse)
def get_user_details(
    user_id: int,
    registrar_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Registrar: Get detailed info about a specific user.
    """
    # Verify registrar
    registrar = db.query(User).filter(User.email == registrar_email).first()
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")
    
    if registrar.role != "REGISTRAR":
        raise HTTPException(status_code=403, detail="Only registrars can view user details")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Count cases
    cases_count = db.query(Case).filter(Case.created_by_id == user.id).count()
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "is_active": getattr(user, 'is_active', True),
        "created_cases_count": cases_count
    }


# ===============================================================
# Disable/Enable User
# ===============================================================
@router.put("/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    registrar_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Registrar: Enable or disable a user account.
    """
    # Verify registrar
    registrar = db.query(User).filter(User.email == registrar_email).first()
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")
    
    if registrar.role != "REGISTRAR":
        raise HTTPException(status_code=403, detail="Only registrars can manage users")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow disabling self
    if user.id == registrar.id:
        raise HTTPException(status_code=400, detail="Cannot disable your own account")
    
    # Toggle is_active status (add column if it doesn't exist)
    current_status = getattr(user, 'is_active', True)
    new_status = not current_status
    
    # Try to set the status
    try:
        user.is_active = new_status
        db.commit()
        db.refresh(user)
        
        status_text = "enabled" if new_status else "disabled"
        return {
            "message": f"User {status_text} successfully",
            "user_id": user.id,
            "email": user.email,
            "is_active": new_status
        }
    except Exception as e:
        # If is_active column doesn't exist, we'll need to add it
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail="Unable to update user status. Database may need migration."
        )


# ===============================================================
# Delete User (Permanent)
# ===============================================================
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    registrar_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Registrar: Permanently delete a user account.
    WARNING: This will cascade delete all related data.
    """
    # Verify registrar
    registrar = db.query(User).filter(User.email == registrar_email).first()
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")
    
    if registrar.role != "REGISTRAR":
        raise HTTPException(status_code=403, detail="Only registrars can delete users")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow deleting self
    if user.id == registrar.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    # Store info before deletion
    user_email = user.email
    user_role = user.role
    
    # Delete user (will cascade due to model relationships)
    db.delete(user)
    db.commit()
    
    return {
        "message": "User deleted successfully",
        "deleted_user": {
            "id": user_id,
            "email": user_email,
            "role": user_role
        }
    }


# ===============================================================
# Update User Role
# ===============================================================
@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    new_role: str = Query(..., regex="^(CIVILIAN|REGISTRAR|JUDGE|PROSECUTOR)$"),
    registrar_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Registrar: Change a user's role.
    """
    # Verify registrar
    registrar = db.query(User).filter(User.email == registrar_email).first()
    if not registrar:
        raise HTTPException(status_code=404, detail="Registrar not found")
    
    if registrar.role != "REGISTRAR":
        raise HTTPException(status_code=403, detail="Only registrars can change user roles")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow changing own role
    if user.id == registrar.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    old_role = user.role
    user.role = new_role.upper()
    
    db.commit()
    db.refresh(user)
    
    return {
        "message": "User role updated successfully",
        "user_id": user.id,
        "email": user.email,
        "old_role": old_role,
        "new_role": user.role
    }
