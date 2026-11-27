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
