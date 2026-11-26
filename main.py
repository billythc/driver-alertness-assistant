import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from database import (
    save_shift,
    get_shifts,
    get_active_shift,
    end_shift,
    get_shift_by_id,
    save_break,
    end_break,
    get_break_by_id,
    get_breaks_for_shift,
    get_active_break,
    save_caffeine,
    get_caffeine_for_shift,
    save_hydration,
    get_hydration_for_shift,
    save_sleep,
    get_sleep_logs,
    save_alertness_check,
    get_alertness_checks
)


app = FastAPI(title="Driver Alertness Assistant")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.environ.get(
            "FRONTEND_URL",
            "http://localhost:5173,http://localhost:5174,http://localhost:5175"
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# GENERAL HELPERS

def parse_time(value):
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Invalid date/time format. Use YYYY-MM-DDTHH:MM:SS."
        )


def require_shift(shift_id):
    shift = get_shift_by_id(shift_id)

    if shift is None:
        raise HTTPException(
            status_code=404,
            detail="Shift not found."
        )

    return shift


# HOME

@app.get("/")
def home():
    return {
        "message": "Welcome to Driver Alertness Assistant!",
        "status": "Application is running",
        "developer": "Williams"
    }


# BREAK RECOMMENDATIONS

@app.get("/break-recommendation")
def break_recommendation(working_hours: float):
    if working_hours < 2:
        recommendation = "Monitor your alertness."
    elif working_hours < 4:
        recommendation = "Consider taking a short break."
    else:
        recommendation = "Take a break before continuing."

    return {
        "working_hours": working_hours,
        "recommendation": recommendation
    }


@app.get("/shift-duration")
def shift_duration(started_at: str):
    start_time = parse_time(started_at)

    hours_worked = (
        datetime.now() - start_time
    ).total_seconds() / 3600

    return {
        "shift_started_at": started_at,
        "hours_worked": round(hours_worked, 2)
    }


@app.get("/shift-status")
def shift_status(started_at: str):
    start_time = parse_time(started_at)

    hours_worked = (
        datetime.now() - start_time
    ).total_seconds() / 3600

    if hours_worked < 2:
        recommendation = "Monitor your alertness."
    elif hours_worked < 4:
        recommendation = "Consider taking a short break."
    else:
        recommendation = "Take a break before continuing."

    return {
        "hours_worked": round(hours_worked, 2),
        "recommendation": recommendation
    }


# AUTOMATIC SESSION DETECTION

@app.get("/active-session")
def active_session():
    shift = get_active_shift()

    if shift is None:
        return {
            "active": False,
            "shift": None,
            "break": None
        }

    active_break = get_active_break(shift[0])

    return {
        "active": True,
        "shift": {
            "shift_id": shift[0],
            "started_at": shift[1],
            "ended_at": shift[2],
            "status": "active"
        },
        "break": {
            "break_id": active_break[0],
            "started_at": active_break[2],
            "status": "active"
        } if active_break else None
    }


# SHIFTS

@app.post("/shifts")
def create_shift(started_at: str):
    parse_time(started_at)

    existing_shift = get_active_shift()

    if existing_shift:
        raise HTTPException(
            status_code=400,
            detail=f"Shift #{existing_shift[0]} is already active."
        )

    shift_id = save_shift(started_at)

    return {
        "message": "Shift saved successfully!",
        "shift_id": shift_id,
        "started_at": started_at
    }


@app.get("/shifts")
def list_shifts():
    shifts = get_shifts()

    return {
        "total_shifts": len(shifts),
        "shifts": shifts
    }


@app.put("/shifts/{shift_id}/end")
def finish_shift(shift_id: int, ended_at: str):
    shift = require_shift(shift_id)

    if shift[2] is not None:
        raise HTTPException(
            status_code=400,
            detail="Shift has already ended."
        )

    end_time = parse_time(ended_at)
    start_time = parse_time(shift[1])

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="Shift end time must be after start time."
        )

    for existing_break in get_breaks_for_shift(shift_id):
        if existing_break[3] is None:
            raise HTTPException(
                status_code=400,
                detail="Cannot end shift while a break is active. End the break first."
            )

    end_shift(shift_id, ended_at)

    return {
        "message": "Shift ended successfully!",
        "shift_id": shift_id,
        "ended_at": ended_at
    }


@app.get("/shifts/{shift_id}/duration")
def calculate_shift_duration(shift_id: int):
    shift = require_shift(shift_id)

    if shift[2] is None:
        return {
            "message": "This shift has not ended yet."
        }

    start_time = parse_time(shift[1])
    end_time = parse_time(shift[2])

    hours_worked = (
        end_time - start_time
    ).total_seconds() / 3600

    return {
        "shift_id": shift_id,
        "started_at": shift[1],
        "ended_at": shift[2],
        "hours_worked": round(hours_worked, 2)
    }


# BREAKS

@app.post("/shifts/{shift_id}/breaks")
def create_break(shift_id: int, started_at: str):
    shift = require_shift(shift_id)

    if shift[2] is not None:
        raise HTTPException(
            status_code=400,
            detail="Cannot add a break to an ended shift."
        )

    break_start = parse_time(started_at)
    start_time = parse_time(shift[1])

    if break_start < start_time:
        raise HTTPException(
            status_code=400,
            detail="Break cannot start before the shift."
        )

    existing_break = get_active_break(shift_id)

    if existing_break:
        raise HTTPException(
            status_code=400,
            detail="There is already an active break for this shift."
        )

    break_id = save_break(shift_id, started_at)

    return {
        "message": "Break started successfully!",
        "break_id": break_id,
        "shift_id": shift_id,
        "started_at": started_at
    }


@app.put("/breaks/{break_id}/end")
def finish_break(break_id: int, ended_at: str):
    break_record = get_break_by_id(break_id)

    if break_record is None:
        raise HTTPException(
            status_code=404,
            detail="Break not found."
        )

    if break_record[3] is not None:
        raise HTTPException(
            status_code=400,
            detail="This break has already ended."
        )

    end_time = parse_time(ended_at)
    start_time = parse_time(break_record[2])

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after break start time."
        )

    shift = require_shift(break_record[1])

    if shift[2] is not None and end_time > parse_time(shift[2]):
        raise HTTPException(
            status_code=400,
            detail="Break cannot end after the shift."
        )

    end_break(break_id, ended_at)

    return {
        "message": "Break ended successfully!",
        "break_id": break_id,
        "ended_at": ended_at
    }


@app.get("/breaks/{break_id}/duration")
def calculate_break_duration(break_id: int):
    break_record = get_break_by_id(break_id)

    if break_record is None:
        raise HTTPException(
            status_code=404,
            detail="Break not found."
        )

    if break_record[3] is None:
        return {
            "message": "This break has not ended yet."
        }

    start_time = parse_time(break_record[2])
    end_time = parse_time(break_record[3])

    minutes_taken = (
        end_time - start_time
    ).total_seconds() / 60

    return {
        "break_id": break_id,
        "started_at": break_record[2],
        "ended_at": break_record[3],
        "minutes_taken": round(minutes_taken, 2)
    }


@app.get("/shifts/{shift_id}/breaks")
def list_shift_breaks(shift_id: int):
    require_shift(shift_id)

    breaks = get_breaks_for_shift(shift_id)

    return {
        "shift_id": shift_id,
        "total_breaks": len(breaks),
        "breaks": breaks
    }


@app.get("/shifts/{shift_id}/total-break-time")
def calculate_total_break_time(shift_id: int):
    require_shift(shift_id)

    breaks = get_breaks_for_shift(shift_id)
    total_seconds = 0

    for break_record in breaks:
        if break_record[3] is not None:
            start_time = parse_time(break_record[2])
            end_time = parse_time(break_record[3])

            total_seconds += (
                end_time - start_time
            ).total_seconds()

    return {
        "shift_id": shift_id,
        "total_breaks": len(breaks),
        "total_break_time_minutes": round(total_seconds / 60, 2)
    }


# CAFFEINE TRACKING

@app.post("/shifts/{shift_id}/caffeine")
def log_caffeine(
    shift_id: int,
    amount_mg: float,
    logged_at: str
):
    shift = require_shift(shift_id)

    if shift[2] is not None:
        raise HTTPException(
            status_code=400,
            detail="Cannot log caffeine to an ended shift."
        )

    if amount_mg <= 0:
        raise HTTPException(
            status_code=400,
            detail="Caffeine amount must be greater than zero."
        )

    parse_time(logged_at)

    log_id = save_caffeine(
        shift_id,
        amount_mg,
        logged_at
    )

    return {
        "message": "Caffeine intake recorded.",
        "log_id": log_id,
        "shift_id": shift_id,
        "amount_mg": amount_mg,
        "logged_at": logged_at
    }


@app.get("/shifts/{shift_id}/caffeine")
def list_caffeine(shift_id: int):
    require_shift(shift_id)

    logs = get_caffeine_for_shift(shift_id)
    total_mg = sum(record[2] for record in logs)

    return {
        "shift_id": shift_id,
        "total_caffeine_mg": round(total_mg, 2),
        "logs": logs
    }


# HYDRATION TRACKING

@app.post("/shifts/{shift_id}/hydration")
def log_hydration(
    shift_id: int,
    amount_ml: float,
    logged_at: str
):
    shift = require_shift(shift_id)

    if shift[2] is not None:
        raise HTTPException(
            status_code=400,
            detail="Cannot log hydration to an ended shift."
        )

    if amount_ml <= 0:
        raise HTTPException(
            status_code=400,
            detail="Water amount must be greater than zero."
        )

    parse_time(logged_at)

    log_id = save_hydration(
        shift_id,
        amount_ml,
        logged_at
    )

    return {
        "message": "Water intake recorded.",
        "log_id": log_id,
        "shift_id": shift_id,
        "amount_ml": amount_ml,
        "logged_at": logged_at
    }


@app.get("/shifts/{shift_id}/hydration")
def list_hydration(shift_id: int):
    require_shift(shift_id)

    logs = get_hydration_for_shift(shift_id)
    total_ml = sum(record[2] for record in logs)

    return {
        "shift_id": shift_id,
        "total_water_ml": round(total_ml, 2),
        "logs": logs
    }


# SLEEP TRACKING

@app.post("/sleep")
def log_sleep(
    sleep_hours: float,
    logged_at: str,
    notes: str = None
):
    if sleep_hours < 0 or sleep_hours > 24:
        raise HTTPException(
            status_code=400,
            detail="Sleep hours must be between 0 and 24."
        )

    parse_time(logged_at)

    log_id = save_sleep(
        sleep_hours,
        logged_at,
        notes
    )

    return {
        "message": "Sleep record saved.",
        "log_id": log_id,
        "sleep_hours": sleep_hours,
        "logged_at": logged_at,
        "notes": notes
    }


@app.get("/sleep")
def list_sleep():
    logs = get_sleep_logs()

    return {
        "total_records": len(logs),
        "sleep_records": logs
    }


# ALERTNESS SELF-CHECK

@app.post("/alertness-check")
def alertness_check(
    alertness_level: int,
    feeling_sleepy: bool,
    difficulty_focusing: bool,
    checked_at: str
):
    if alertness_level < 1 or alertness_level > 5:
        raise HTTPException(
            status_code=400,
            detail="Alertness level must be between 1 and 5."
        )

    if feeling_sleepy or difficulty_focusing or alertness_level <= 2:
        recommendation = (
            "Stop driving in a safe place as soon as possible. "
            "Rest before considering driving again."
        )
        status = "warning"

    elif alertness_level == 3:
        recommendation = (
            "Your alertness may be reduced. Take a break and reassess "
            "before continuing."
        )
        status = "caution"

    else:
        recommendation = (
            "Continue monitoring how you feel. Take breaks when needed."
        )
        status = "self_reported_alert"

    check_id = save_alertness_check(
        alertness_level,
        feeling_sleepy,
        difficulty_focusing,
        status,
        recommendation,
        checked_at
    )

    return {
        "check_id": check_id,
        "alertness_level": alertness_level,
        "feeling_sleepy": feeling_sleepy,
        "difficulty_focusing": difficulty_focusing,
        "status": status,
        "recommendation": recommendation,
        "checked_at": checked_at,
        "safety_note": (
            "This self-check cannot determine whether you are safe to drive."
        )
    }


@app.get("/alertness-history")
def alertness_history():
    records = get_alertness_checks()

    return [
        {
            "id": record[0],
            "alertness_level": record[1],
            "feeling_sleepy": bool(record[2]),
            "difficulty_focusing": bool(record[3]),
            "status": record[4],
            "recommendation": record[5],
            "checked_at": record[6]
        }
        for record in records
    ]

# DRIVER DASHBOARD

@app.get("/dashboard/{shift_id}")
def driver_dashboard(shift_id: int):
    shift = require_shift(shift_id)

    start_time = parse_time(shift[1])

    if shift[2] is None:
        end_time = datetime.now()
        shift_status = "active"
    else:
        end_time = parse_time(shift[2])
        shift_status = "ended"

    hours_worked = (
        end_time - start_time
    ).total_seconds() / 3600

    breaks = get_breaks_for_shift(shift_id)
    caffeine = get_caffeine_for_shift(shift_id)
    hydration = get_hydration_for_shift(shift_id)

    total_break_seconds = 0

    for break_record in breaks:
        if break_record[3] is not None:
            break_start = parse_time(break_record[2])
            break_end = parse_time(break_record[3])

            total_break_seconds += (
                break_end - break_start
            ).total_seconds()

    active_breaks = [
        record for record in breaks
        if record[3] is None
    ]

    total_caffeine = sum(record[2] for record in caffeine)
    total_water = sum(record[2] for record in hydration)

    sleep_records = get_sleep_logs()
    latest_sleep = sleep_records[0] if sleep_records else None

    return {
        "shift_id": shift_id,
        "shift_status": shift_status,
        "started_at": shift[1],
        "ended_at": shift[2],
        "hours_worked": round(hours_worked, 2),
        "total_breaks": len(breaks),
        "completed_break_time_minutes": round(
            total_break_seconds / 60, 2
        ),
        "active_breaks": len(active_breaks),
        "total_caffeine_mg": round(total_caffeine, 2),
        "total_water_ml": round(total_water, 2),
        "latest_sleep_record": latest_sleep
    }


# ACTIVITY HISTORY

@app.get("/shifts/{shift_id}/activity")
def get_activity_history(shift_id: int):
    require_shift(shift_id)

    breaks = get_breaks_for_shift(shift_id)
    caffeine = get_caffeine_for_shift(shift_id)
    hydration = get_hydration_for_shift(shift_id)

    activities = []

    for record in breaks:
        activities.append({
            "id": record[0],
            "type": "Break",
            "time": record[2],
            "details": (
                f"Ended: {record[3]}"
                if record[3]
                else "Break ongoing"
            )
        })

    for record in caffeine:
        activities.append({
            "id": record[0],
            "type": "Caffeine",
            "time": record[3],
            "details": f"{record[2]} mg"
        })

    for record in hydration:
        activities.append({
            "id": record[0],
            "type": "Water",
            "time": record[3],
            "details": f"{record[2]} ml"
        })

    activities.sort(
        key=lambda item: item["time"] or "",
        reverse=True
    )

    return {
        "shift_id": shift_id,
        "total_activities": len(activities),
        "activities": activities
    }
