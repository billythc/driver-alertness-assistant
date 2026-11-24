
from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def create_active_shift():
    started_at = (datetime.now() - timedelta(hours=1)).isoformat(timespec="seconds")
    response = client.post("/shifts", params={"started_at": started_at})
    assert response.status_code == 200
    return response.json()["shift_id"]


def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Application is running"


def test_create_shift():
    shift_id = create_active_shift()
    assert shift_id > 0


def test_caffeine_tracking():
    shift_id = create_active_shift()

    response = client.post(
        f"/shifts/{shift_id}/caffeine",
        params={
            "amount_mg": 80,
            "logged_at": datetime.now().isoformat(timespec="seconds")
        }
    )

    assert response.status_code == 200

    result = client.get(f"/shifts/{shift_id}/caffeine")
    assert result.status_code == 200
    assert result.json()["total_caffeine_mg"] == 80


def test_hydration_tracking():
    shift_id = create_active_shift()

    response = client.post(
        f"/shifts/{shift_id}/hydration",
        params={
            "amount_ml": 500,
            "logged_at": datetime.now().isoformat(timespec="seconds")
        }
    )

    assert response.status_code == 200

    result = client.get(f"/shifts/{shift_id}/hydration")
    assert result.status_code == 200
    assert result.json()["total_water_ml"] == 500


def test_sleep_tracking():
    response = client.post(
        "/sleep",
        params={
            "sleep_hours": 7,
            "logged_at": datetime.now().isoformat(timespec="seconds"),
            "notes": "Test sleep record"
        }
    )

    assert response.status_code == 200
    assert response.json()["sleep_hours"] == 7


def test_alertness_warning():
    response = client.post(
        "/alertness-check",
        params={
            "alertness_level": 1,
            "feeling_sleepy": True,
            "difficulty_focusing": False
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "warning"


def test_dashboard():
    shift_id = create_active_shift()

    response = client.get(f"/dashboard/{shift_id}")

    assert response.status_code == 200
    assert response.json()["shift_id"] == shift_id


def test_invalid_alertness_level():
    response = client.post(
        "/alertness-check",
        params={
            "alertness_level": 6,
            "feeling_sleepy": False,
            "difficulty_focusing": False
        }
    )

    assert response.status_code == 400
