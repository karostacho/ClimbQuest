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


def test_weak_password_rejected(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "Climber", "email": "c@example.com", "password": "weak"},
    )
    assert response.status_code == 422


def test_me_requires_authentication(client):
    assert client.get("/api/auth/me").status_code == 401

    register_and_login(client, email="d@example.com")
    me_response = client.get("/api/auth/me")
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "d@example.com"
