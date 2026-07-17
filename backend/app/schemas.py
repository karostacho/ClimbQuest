from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
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


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str


class RouteCreate(BaseModel):
    route_name: str
    grade_index: int
    climb_date: date
    comment: str | None = None


class RouteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    route_name: str
    grade_index: int
    climb_date: date
    comment: str | None
    created_at: datetime
