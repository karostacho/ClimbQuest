from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# bcrypt silently truncates beyond 72 bytes, so anything longer than that
# gives a false sense of a longer effective password.
MAX_PASSWORD_BYTES = 72

# Matches the length of ROCK_GRADES in frontend/src/data/grades.ts - routes
# are always logged against the rock-climbing scale, never bouldering.
MIN_GRADE_INDEX = 1
MAX_GRADE_INDEX = 77


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr = Field(max_length=255)
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if len(value.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} bytes long")
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.islower() for c in value):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isupper() for c in value):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.isdigit() for c in value):
            raise ValueError("Password must contain a digit")
        if not any(not c.isalnum() for c in value):
            raise ValueError("Password must contain a special character")
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str


class RouteCreate(BaseModel):
    route_name: str = Field(min_length=1, max_length=200)
    grade_index: int = Field(ge=MIN_GRADE_INDEX, le=MAX_GRADE_INDEX)
    climb_date: date
    comment: str | None = None

    @field_validator("climb_date")
    @classmethod
    def not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Climb date cannot be in the future")
        return value


class RouteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    route_name: str
    grade_index: int
    climb_date: date
    comment: str | None
    created_at: datetime
