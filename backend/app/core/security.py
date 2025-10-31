from datetime import datetime, timedelta
from typing import List, Optional, Union
import jwt
import hashlib

# ===============================================================
# 🔐 Security Configuration
# ===============================================================
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ===============================================================
# 🧩 Password Utilities (Simple SHA256 - No Bcrypt)
# ===============================================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one using SHA256."""
    hashed = hashlib.sha256(plain_password.encode()).hexdigest()
    return hashed == hashed_password


def hash_password(password: str) -> str:
    """Hash a plain password using SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()


# ===============================================================
# 🎟️ JWT Token Generation
# ===============================================================
def create_access_token(
    subject: Union[str, int],
    roles: List[str],
    expires_minutes: Optional[int] = None
) -> str:
    """Create a signed JWT access token."""
    expire = datetime.utcnow() + timedelta(
        minutes=expires_minutes or ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode = {"sub": str(subject), "roles": roles, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
