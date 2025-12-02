from fastapi import FastAPI
from routes.flights import router as flights_router
from routes.airports import router as airports_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title = "Airline Tracking System API",
    version = "1.0.0"
)

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Your React app
        "http://127.0.0.1:3000",      # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flights_router)
app.include_router(airports_router)

