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
