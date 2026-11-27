# Driver Alertness Assistant

A full-stack web application designed to help professional drivers monitor their working shifts, breaks, caffeine consumption, hydration, sleep and self-reported alertness.

Built with **Python, FastAPI, React and PostgreSQL**, this project explores how software can support driver awareness, personal tracking and fatigue management.

**Live Demo:** https://driver-alertness-assistant-94t0cailj-williams-projects8.vercel.app/

**GitHub Repository:** https://github.com/billythc/driver-alertness-assistant

## Features

- Shift creation, tracking and completion
- Break tracking and duration calculations
- Prevention of overlapping active breaks
- Caffeine intake logging
- Water intake tracking
- Sleep tracking
- Self-reported alertness assessments
- Driver dashboard with shift summaries
- Charts and activity history
- Data visualisation using Recharts
- PDF reporting
- English and Spanish language support
- Input validation and HTTP error handling
- Persistent PostgreSQL database
- Automated API testing

## Technology Stack

### Backend
- Python
- FastAPI
- PostgreSQL
- SQLite (local development)
- Psycopg
- REST API

### Frontend
- React
- JavaScript
- Vite
- Recharts
- CSS

### Testing and Deployment
- Pytest
- Git and GitHub
- Render (backend hosting)
- Vercel (frontend hosting)
- Neon (PostgreSQL database)

## Architecture

The application uses a separate frontend and backend architecture.

- **React frontend:** Provides the user interface, dashboard, charts and user interactions.
- **FastAPI backend:** Handles API requests, application logic, validation and database operations.
- **PostgreSQL:** Stores persistent application data using Neon.
- **SQLite:** Provides a lightweight database for local development and automated tests.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/billythc/driver-alertness-assistant.git
cd driver-alertness-assistant
```

### 2. Set up the backend

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local address displayed by Vite, usually:

http://localhost:5173

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. |
| `DATABASE_PATH` | Optional SQLite database path for local development. |
| `FRONTEND_URL` | Allowed frontend origin for backend CORS configuration. |
| `VITE_API_URL` | Backend API address used by the React frontend. |

**Security:** Never commit database credentials, connection strings or private environment files to GitHub.

## Automated Testing

The backend includes automated API tests using Pytest.

Run the test suite:

```bash
python -m pytest -v
```

The current test suite contains eight tests covering the main API functionality.

## Project Purpose

The idea behind this project came from my experience working as a professional VTC driver.

Working irregular and night shifts made me interested in exploring how technology could help drivers monitor their routines and become more aware of factors that may affect alertness.

This project gave me an opportunity to apply software development concepts to a practical problem while building a complete full-stack application.

## Safety Disclaimer

This application is an awareness and personal tracking tool, not a medical device or a driving-safety assessment system. Alertness assessments are self-reported and do not predict fitness to drive. Drivers should never rely on the application to decide whether it is safe to continue driving.

## Developer

**Williams Ikpe**

BSc Computer Science | Full-Stack Development

GitHub: https://github.com/billythc