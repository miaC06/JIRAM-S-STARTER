from datetime import datetime, timedelta
from typing import List, Optional, Union
import jwt
from passlib.context import CryptContext

# ===============================================================
# 🔐 Security Configuration
# ===============================================================
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ===============================================================
# 🧩 Password Utilities
# ===============================================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt."""
    return pwd_context.hash(password)


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
