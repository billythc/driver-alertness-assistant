
from fastapi import FastAPI

# Create our application
app = FastAPI(
    title="Driver Alertness Assistant",
    description="A tool to support professional drivers",
    version="0.1.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Driver Alertness Assistant!",
        "status": "Application is running",
        "developer": "Williams"
    }
