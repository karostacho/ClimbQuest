from tests.conftest import register_and_login


def test_create_and_list_routes(client):
    register_and_login(client, email="climber1@example.com")

    create_response = client.post(
        "/api/routes",
        json={
            "route_name": "Perfecto Mundo",
            "grade_index": 63,
            "climb_date": "2026-06-01",
            "comment": "Soft for the grade",
        },
    )
    assert create_response.status_code == 201

    list_response = client.get("/api/routes")
    assert list_response.status_code == 200
    routes = list_response.json()
    assert len(routes) == 1
    assert routes[0]["route_name"] == "Perfecto Mundo"


def test_routes_require_authentication(client):
    assert client.get("/api/routes").status_code == 401
    assert (
        client.post(
            "/api/routes",
            json={"route_name": "X", "grade_index": 1, "climb_date": "2026-01-01"},
        ).status_code
        == 401
    )


def test_sorting_by_grade(client):
    register_and_login(client, email="climber2@example.com")
    client.post(
        "/api/routes",
        json={"route_name": "Low", "grade_index": 10, "climb_date": "2026-01-01"},
    )
    client.post(
        "/api/routes",
        json={"route_name": "High", "grade_index": 50, "climb_date": "2026-01-02"},
    )

    ascending = client.get("/api/routes", params={"sort_by": "grade", "order": "asc"}).json()
    assert [route["route_name"] for route in ascending] == ["Low", "High"]

    descending = client.get("/api/routes", params={"sort_by": "grade", "order": "desc"}).json()
    assert [route["route_name"] for route in descending] == ["High", "Low"]


def test_list_routes_only_includes_current_users_routes(client):
    # The single highest-impact regression this app could have: one user's
    # journal leaking into another's.
    register_and_login(client, email="alice@example.com")
    client.post(
        "/api/routes",
        json={"route_name": "Alice's route", "grade_index": 15, "climb_date": "2026-01-01"},
    )

    register_and_login(client, email="bob@example.com")
    client.post(
        "/api/routes",
        json={"route_name": "Bob's route", "grade_index": 25, "climb_date": "2026-01-02"},
    )

    bob_routes = client.get("/api/routes").json()
    assert [route["route_name"] for route in bob_routes] == ["Bob's route"]

    register_and_login(client, email="alice@example.com")
    alice_routes = client.get("/api/routes").json()
    assert [route["route_name"] for route in alice_routes] == ["Alice's route"]


def test_delete_route_ownership_is_enforced(client):
    register_and_login(client, email="owner@example.com")
    created = client.post(
        "/api/routes",
        json={"route_name": "Owner's route", "grade_index": 20, "climb_date": "2026-01-01"},
    ).json()
    route_id = created["id"]

    # Log in as a different user and try to delete the first user's route.
    register_and_login(client, email="intruder@example.com")
    delete_response = client.delete(f"/api/routes/{route_id}")
    assert delete_response.status_code == 404

    # The owner still sees it untouched.
    register_and_login(client, email="owner@example.com")
    routes = client.get("/api/routes").json()
    assert any(route["id"] == route_id for route in routes)


def test_owner_can_delete_own_route(client):
    register_and_login(client, email="owner2@example.com")
    created = client.post(
        "/api/routes",
        json={"route_name": "Temp route", "grade_index": 5, "climb_date": "2026-01-01"},
    ).json()

    delete_response = client.delete(f"/api/routes/{created['id']}")
    assert delete_response.status_code == 204

    routes = client.get("/api/routes").json()
    assert routes == []


def test_owner_can_update_own_route(client):
    register_and_login(client, email="editor@example.com")
    created = client.post(
        "/api/routes",
        json={"route_name": "Original name", "grade_index": 10, "climb_date": "2026-01-01"},
    ).json()

    update_response = client.put(
        f"/api/routes/{created['id']}",
        json={"route_name": "Updated name", "grade_index": 40, "climb_date": "2026-02-01", "comment": "edited"},
    )
    assert update_response.status_code == 200
    body = update_response.json()
    assert body["route_name"] == "Updated name"
    assert body["grade_index"] == 40
    assert body["comment"] == "edited"

    routes = client.get("/api/routes").json()
    assert len(routes) == 1
    assert routes[0]["route_name"] == "Updated name"


def test_update_route_ownership_is_enforced(client):
    register_and_login(client, email="owner3@example.com")
    created = client.post(
        "/api/routes",
        json={"route_name": "Owner's route", "grade_index": 20, "climb_date": "2026-01-01"},
    ).json()
    route_id = created["id"]

    register_and_login(client, email="intruder2@example.com")
    response = client.put(
        f"/api/routes/{route_id}",
        json={"route_name": "Hijacked", "grade_index": 1, "climb_date": "2026-01-01"},
    )
    assert response.status_code == 404

    register_and_login(client, email="owner3@example.com")
    routes = client.get("/api/routes").json()
    assert routes[0]["route_name"] == "Owner's route"


def test_update_nonexistent_route_404(client):
    register_and_login(client, email="ghost-editor@example.com")
    response = client.put(
        "/api/routes/999999",
        json={"route_name": "Nope", "grade_index": 1, "climb_date": "2026-01-01"},
    )
    assert response.status_code == 404


def test_grade_index_out_of_range_rejected(client):
    register_and_login(client, email="grade@example.com")
    response = client.post(
        "/api/routes",
        json={"route_name": "Bad grade", "grade_index": 999, "climb_date": "2026-01-01"},
    )
    assert response.status_code == 422


def test_future_climb_date_rejected(client):
    register_and_login(client, email="future@example.com")
    response = client.post(
        "/api/routes",
        json={"route_name": "Time traveler", "grade_index": 10, "climb_date": "2099-01-01"},
    )
    assert response.status_code == 422


def test_overlong_route_name_rejected(client):
    register_and_login(client, email="long@example.com")
    response = client.post(
        "/api/routes",
        json={"route_name": "x" * 201, "grade_index": 10, "climb_date": "2026-01-01"},
    )
    assert response.status_code == 422
