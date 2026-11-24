
import sqlite3

DATABASE = "driver_assistant.db"


def connect():
    connection = sqlite3.connect(DATABASE)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


# CREATE TABLES

connection = connect()
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    ended_at TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS breaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS caffeine_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id INTEGER NOT NULL,
    amount_mg REAL NOT NULL,
    logged_at TEXT NOT NULL,
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS hydration_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id INTEGER NOT NULL,
    amount_ml REAL NOT NULL,
    logged_at TEXT NOT NULL,
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS sleep_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sleep_hours REAL NOT NULL,
    logged_at TEXT NOT NULL,
    notes TEXT
)
""")

connection.commit()
connection.close()


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
    cursor.execute("SELECT * FROM shifts WHERE id = ?", (shift_id,))
    result = cursor.fetchone()
    connection.close()
    return result


def end_shift(shift_id, ended_at):
    connection = connect()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE shifts SET ended_at = ? WHERE id = ?",
        (ended_at, shift_id)
    )
    connection.commit()
    result = cursor.rowcount
    connection.close()
    return result


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
    cursor.execute("SELECT * FROM breaks WHERE id = ?", (break_id,))
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


def end_break(break_id, ended_at):
    connection = connect()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE breaks SET ended_at = ? WHERE id = ?",
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
    cursor.execute("SELECT * FROM sleep_logs ORDER BY logged_at DESC")
    result = cursor.fetchall()
    connection.close()
    return result


print("Database ready!")
