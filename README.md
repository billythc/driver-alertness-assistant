
# Driver Alertness Assistant

A FastAPI-based backend application designed to help professional drivers monitor their shifts, breaks, caffeine intake, hydration, sleep and self-reported alertness.

## Features

- Shift creation, tracking and completion
- Break tracking and duration calculations
- Prevention of overlapping active breaks
- Caffeine intake logging
- Water intake tracking
- Sleep tracking
- Alertness self-assessment
- Driver dashboard with shift summaries
- Input validation and HTTP error handling
- Automated API tests using pytest

## Technology Stack

- Python
- FastAPI
- SQLite
- Pytest
- REST API
- Git

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd driver-alertness-assistant
```

Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install "fastapi[standard]" pytest
```

## Run the Application

```bash
fastapi dev main.py
```

Open the API documentation:

http://127.0.0.1:8000/docs

## Run Tests

```bash
python -m pytest -v
```

## Project Purpose

This project explores how backend software can support professional drivers through shift management, personal tracking and fatigue-awareness tools.

**Safety note:** This application is not a medical device and cannot determine whether someone is safe to drive. Alertness assessments are self-reported and are not validated safety predictions.

## Developer

Williams Ikpe

BSc Computer Science
