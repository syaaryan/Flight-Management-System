# API Endpoints
# These are what the frontend will call for flights

from fastapi import APIRouter, HTTPException
from models.flight_models import Flight, FlightCreate, FlightUpdate
import services.flight_service as service

router = APIRouter(prefix="/flights", tags=["Flights"])

@router.get("/")
def get_flights():
    return service.get_all_flights()

@router.get("/{flight_id}")
def get_flight(flight_id: int):
    flight = service.get_flight_by_id(flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

@router.post("/")
def create_flight(data: FlightCreate):
    service.create_flight(data)
    return {"message": "Flight created"}

@router.put("/{flight_id}")
def update_flight(flight_id: int, data: FlightUpdate):
    service.update_flight(flight_id, data)
    return {"message": "Flight updated"}

@router.delete("/{flight_id}")
def delete_flight(flight_id: int):
    service.delete_flight(flight_id)
    return {"message": "Flight deleted"}

