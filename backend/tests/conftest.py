import os

# Force these regardless of what's already exported in the shell - tests
# must never run against a real database just because a developer has
# DATABASE_URL set for local backend work (setdefault() wouldn't override it).
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET"] = "test-secret"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.deps import get_db
from app.main import app


@pytest.fixture()
def db_session_factory():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return factory


@pytest.fixture(autouse=True)
def _reset_rate_limits():
    # The rate limiter's attempt log is module-level state in app.routers.auth,
    # shared across every test in the same process; TestClient always presents
    # the same fake IP, so without this, unrelated tests would trip each
    # other's limits and start failing with 429s instead of the status they're
    # actually asserting on.
    from app.routers.auth import _ATTEMPT_LOG

    _ATTEMPT_LOG.clear()
    yield


@pytest.fixture()
def client(db_session_factory):
    def override_get_db():
        db = db_session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def register_and_login(client, email="climber@example.com", password="Str0ng!Pass"):
    client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": email, "password": password},
    )
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response
