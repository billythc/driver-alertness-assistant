import sqlite3
import os
import psycopg

DATABASE_URL = os.environ.get("DATABASE_URL")

DATABASE = os.environ.get(
    "DATABASE_PATH",
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "driver_assistant.db"
    )
)


class PostgresCursor:
    def __init__(self, cursor):
        self.cursor = cursor
        self.lastrowid = None

    def execute(self, query, params=()):
        query = query.replace("?", "%s")

        if query.strip().upper().startswith("INSERT INTO"):
            if "RETURNING" not in query.upper():
                query = query.rstrip().rstrip(";") + " RETURNING id"

        self.cursor.execute(query, params)

        if query.strip().upper().startswith("INSERT INTO"):
            result = self.cursor.fetchone()
            self.lastrowid = result[0]

        return self

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()

    @property
    def rowcount(self):
        return self.cursor.rowcount


class PostgresConnection:
    def __init__(self, connection):
        self.connection = connection

    def cursor(self):
        return PostgresCursor(self.connection.cursor())

    def commit(self):
        self.connection.commit()

    def close(self):
        self.connection.close()


def connect():
    if DATABASE_URL:
        return PostgresConnection(psycopg.connect(DATABASE_URL))

    connection = sqlite3.connect(DATABASE)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


# CREATE TABLES


def initialize_database():
    connection = connect()
    cursor = connection.cursor()

    id_column = (
        "BIGSERIAL PRIMARY KEY"
        if DATABASE_URL
        else "INTEGER PRIMARY KEY AUTOINCREMENT"
    )

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS shifts (
        id {id_column},
        started_at TEXT NOT NULL,
        ended_at TEXT
    )
    """)

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS breaks (
        id {id_column},
        shift_id INTEGER NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        FOREIGN KEY (shift_id) REFERENCES shifts(id)
    )
    """)

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS caffeine_logs (
        id {id_column},
        shift_id INTEGER NOT NULL,
        amount_mg REAL NOT NULL,
        logged_at TEXT NOT NULL,
        FOREIGN KEY (shift_id) REFERENCES shifts(id)
    )
    """)

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS hydration_logs (
        id {id_column},
        shift_id INTEGER NOT NULL,
        amount_ml REAL NOT NULL,
        logged_at TEXT NOT NULL,
        FOREIGN KEY (shift_id) REFERENCES shifts(id)
    )
    """)

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS sleep_logs (
        id {id_column},
        sleep_hours REAL NOT NULL,
        logged_at TEXT NOT NULL,
        notes TEXT
    )
    """)

    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS alertness_checks (
        id {id_column},
        alertness_level INTEGER NOT NULL,
        feeling_sleepy INTEGER NOT NULL,
        difficulty_focusing INTEGER NOT NULL,
        status TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        checked_at TEXT NOT NULL
    )
    """)

    connection.commit()
    connection.close()


initialize_database()


# SHIFT FUNCTIONS

def save_shift(started_at):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO shifts (started_at) VALUES (?)",
        (started_at,)
    )

    connection.commit()
    shift_id = cursor.lastrowid
    connection.close()

    return shift_id


def get_shifts():
    connection = connect()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM shifts ORDER BY id DESC")

    result = cursor.fetchall()
    connection.close()

    return result


def get_shift_by_id(shift_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM shifts WHERE id = ?",
        (shift_id,)
    )

    result = cursor.fetchone()
    connection.close()

    return result


def get_active_shift():
    connection = connect()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM shifts
        WHERE ended_at IS NULL
        ORDER BY id DESC
        LIMIT 1
    """)

    result = cursor.fetchone()
    connection.close()

    return result


def end_shift(shift_id, ended_at):
    connection = connect()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            UPDATE shifts
            SET ended_at = ?
            WHERE id = ? AND ended_at IS NULL
            """,
            (ended_at, shift_id)
        )

        updated_rows = cursor.rowcount
        connection.commit()

        if updated_rows != 1:
            raise ValueError(
                f"Could not end shift {shift_id}. "
                "The shift may already be ended or does not exist."
            )

        return updated_rows

    finally:
        connection.close()


# BREAK FUNCTIONS

def save_break(shift_id, started_at):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO breaks (shift_id, started_at) VALUES (?, ?)",
        (shift_id, started_at)
    )

    connection.commit()
    break_id = cursor.lastrowid
    connection.close()

    return break_id


def get_break_by_id(break_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM breaks WHERE id = ?",
        (break_id,)
    )

    result = cursor.fetchone()
    connection.close()

    return result


def get_breaks_for_shift(shift_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM breaks WHERE shift_id = ? ORDER BY id",
        (shift_id,)
    )

    result = cursor.fetchall()
    connection.close()

    return result


def get_active_break(shift_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM breaks
        WHERE shift_id = ? AND ended_at IS NULL
        ORDER BY id DESC
        LIMIT 1
    """, (shift_id,))

    result = cursor.fetchone()
    connection.close()

    return result


def end_break(break_id, ended_at):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "UPDATE breaks SET ended_at = ? WHERE id = ? AND ended_at IS NULL",
        (ended_at, break_id)
    )

    connection.commit()
    result = cursor.rowcount
    connection.close()

    return result


# CAFFEINE FUNCTIONS

def save_caffeine(shift_id, amount_mg, logged_at):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        """INSERT INTO caffeine_logs
        (shift_id, amount_mg, logged_at) VALUES (?, ?, ?)""",
        (shift_id, amount_mg, logged_at)
    )

    connection.commit()
    log_id = cursor.lastrowid
    connection.close()

    return log_id


def get_caffeine_for_shift(shift_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM caffeine_logs WHERE shift_id = ? ORDER BY logged_at",
        (shift_id,)
    )

    result = cursor.fetchall()
    connection.close()

    return result


# HYDRATION FUNCTIONS

def save_hydration(shift_id, amount_ml, logged_at):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        """INSERT INTO hydration_logs
        (shift_id, amount_ml, logged_at) VALUES (?, ?, ?)""",
        (shift_id, amount_ml, logged_at)
    )

    connection.commit()
    log_id = cursor.lastrowid
    connection.close()

    return log_id


def get_hydration_for_shift(shift_id):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM hydration_logs WHERE shift_id = ? ORDER BY logged_at",
        (shift_id,)
    )

    result = cursor.fetchall()
    connection.close()

    return result


# SLEEP FUNCTIONS

def save_sleep(sleep_hours, logged_at, notes=None):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        """INSERT INTO sleep_logs
        (sleep_hours, logged_at, notes) VALUES (?, ?, ?)""",
        (sleep_hours, logged_at, notes)
    )

    connection.commit()
    log_id = cursor.lastrowid
    connection.close()

    return log_id


def get_sleep_logs():
    connection = connect()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM sleep_logs ORDER BY logged_at DESC"
    )

    result = cursor.fetchall()
    connection.close()

    return result


# ALERTNESS CHECK FUNCTIONS

def save_alertness_check(
    alertness_level,
    feeling_sleepy,
    difficulty_focusing,
    status,
    recommendation,
    checked_at
):
    connection = connect()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO alertness_checks (
            alertness_level,
            feeling_sleepy,
            difficulty_focusing,
            status,
            recommendation,
            checked_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        alertness_level,
        int(feeling_sleepy),
        int(difficulty_focusing),
        status,
        recommendation,
        checked_at
    ))

    connection.commit()
    check_id = cursor.lastrowid
    connection.close()

    return check_id


def get_alertness_checks():
    connection = connect()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM alertness_checks
        ORDER BY checked_at DESC
    """)

    result = cursor.fetchall()
    connection.close()

    return result



print("Database ready!")
