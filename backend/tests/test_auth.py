from app.models import User
from tests.conftest import register_and_login


def test_register_then_login(client):
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "a@example.com", "password": "Str0ng!Pass"},
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "a@example.com"

    login_response = client.post(
        "/api/auth/login", json={"email": "a@example.com", "password": "Str0ng!Pass"}
    )
    assert login_response.status_code == 200
    assert "climbquest_token" in login_response.cookies


def test_register_duplicate_email_rejected(client):
    payload = {"name": "Climber", "email": "dup@example.com", "password": "Str0ng!Pass"}
    assert client.post("/api/auth/register", json=payload).status_code == 201
    assert client.post("/api/auth/register", json=payload).status_code == 409


def test_login_wrong_password_rejected(client):
    client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "b@example.com", "password": "Str0ng!Pass"},
    )
    response = client.post(
        "/api/auth/login", json={"email": "b@example.com", "password": "WrongPass1!"}
    )
    assert response.status_code == 401


def test_login_unknown_email_rejected(client):
    response = client.post(
        "/api/auth/login", json={"email": "nobody@example.com", "password": "WrongPass1!"}
    )
    assert response.status_code == 401


def test_weak_password_rejected(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "c@example.com", "password": "weak"},
    )
    assert response.status_code == 422


def test_overlong_password_rejected(client):
    # 74 ASCII bytes, over bcrypt's 72-byte truncation point.
    response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "longpw@example.com", "password": "Aa1!" + "x" * 70},
    )
    assert response.status_code == 422


def test_overlong_name_rejected(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "x" * 121, "email": "longname@example.com", "password": "Str0ng!Pass"},
    )
    assert response.status_code == 422


def test_email_is_case_insensitive_for_login_and_uniqueness(client):
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "MixedCase@Example.com", "password": "Str0ng!Pass"},
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "mixedcase@example.com"

    # Same address, different case, should be treated as the same account.
    duplicate_response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "mixedcase@example.com", "password": "Str0ng!Pass"},
    )
    assert duplicate_response.status_code == 409

    login_response = client.post(
        "/api/auth/login", json={"email": "MIXEDCASE@EXAMPLE.COM", "password": "Str0ng!Pass"}
    )
    assert login_response.status_code == 200


def test_me_requires_authentication(client):
    assert client.get("/api/auth/me").status_code == 401

    register_and_login(client, email="d@example.com")
    me_response = client.get("/api/auth/me")
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "d@example.com"


def test_malformed_cookie_rejected(client):
    client.cookies.set("climbquest_token", "not-a-real-jwt")
    assert client.get("/api/auth/me").status_code == 401


def test_logout_clears_the_session(client):
    register_and_login(client, email="e@example.com")
    assert client.get("/api/auth/me").status_code == 200

    assert client.post("/api/auth/logout").status_code == 204
    assert client.get("/api/auth/me").status_code == 401


def test_default_login_sets_a_session_cookie(client):
    client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "session@example.com", "password": "Str0ng!Pass"},
    )
    response = client.post(
        "/api/auth/login", json={"email": "session@example.com", "password": "Str0ng!Pass"}
    )
    assert response.status_code == 200
    set_cookie = response.headers.get("set-cookie")
    assert set_cookie is not None
    # No Max-Age/Expires: a true session cookie, cleared when the browser
    # closes, rather than persisting across days by default.
    assert "Max-Age" not in set_cookie


def test_remember_me_sets_a_persistent_cookie(client):
    client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "remember@example.com", "password": "Str0ng!Pass"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "remember@example.com", "password": "Str0ng!Pass", "remember_me": True},
    )
    assert response.status_code == 200
    set_cookie = response.headers.get("set-cookie")
    assert set_cookie is not None
    assert "Max-Age" in set_cookie


def test_token_for_a_deleted_user_is_rejected(client, db_session_factory):
    # Covers get_current_user's "user not found" branch: the JWT is still
    # valid, but the account it points at no longer exists (e.g. deleted
    # directly, out of band from any endpoint this app currently exposes).
    register_and_login(client, email="ghost@example.com")
    assert client.get("/api/auth/me").status_code == 200

    db = db_session_factory()
    db.query(User).filter(User.email == "ghost@example.com").delete()
    db.commit()
    db.close()

    assert client.get("/api/auth/me").status_code == 401
