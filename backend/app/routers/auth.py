import time
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.deps import get_current_user, get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserOut
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Secure cookies require HTTPS; only opt out for explicit local dev, so an
# unset/misconfigured ENVIRONMENT fails safe (secure) rather than open.
COOKIE_KWARGS = dict(
    httponly=True,
    secure=settings.environment != "development",
    samesite="lax",
    path="/",
)

# Best-effort in-memory rate limit on login/register. This resets on every
# cold start and isn't shared across concurrent instances, so it's not a
# substitute for a real distributed limiter under sustained attack - but it's
# free, dependency-free, and still throttles a single warm instance getting
# hammered, which is the common case for a small app like this.
_ATTEMPT_LOG: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_ATTEMPTS = 10

# Computed once at import so a login attempt against a non-existent email
# still runs a real bcrypt comparison, keeping response timing close to the
# found-user path instead of leaking account existence via latency.
_DUMMY_PASSWORD_HASH = hash_password("not-a-real-password-used-only-for-timing")


def _enforce_rate_limit(key: str) -> None:
    now = time.monotonic()
    attempts = _ATTEMPT_LOG[key]
    attempts[:] = [t for t in attempts if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(attempts) >= RATE_LIMIT_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many attempts, please try again later",
        )
    attempts.append(now)


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, request: Request, db: Session = Depends(get_db)) -> User:
    _enforce_rate_limit(f"register:{_client_ip(request)}")

    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")

    user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        # Two concurrent registrations for the same email both pass the
        # SELECT check above; the loser hits the unique index here instead
        # of the check-then-insert race turning into an unhandled 500.
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")
    db.refresh(user)
    return user


@router.post("/login", response_model=UserOut)
def login(payload: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)) -> User:
    _enforce_rate_limit(f"login:{_client_ip(request)}:{payload.email}")

    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None:
        verify_password(payload.password, _DUMMY_PASSWORD_HASH)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if payload.remember_me:
        expire_minutes = settings.jwt_remember_me_expire_minutes
        cookie_max_age = expire_minutes * 60
    else:
        expire_minutes = settings.jwt_session_expire_minutes
        # No max_age/expires: a true browser-session cookie, cleared when the
        # browser closes. The JWT's own expiry (still set below) is the
        # backstop for anyone who leaves the browser open across days.
        cookie_max_age = None

    token = create_access_token(user.id, expire_minutes=expire_minutes)
    response.set_cookie(
        settings.cookie_name,
        token,
        max_age=cookie_max_age,
        **COOKIE_KWARGS,
    )
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie(settings.cookie_name, path="/")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
