# These define the input/output structure.
# Frontend will use these shapes.

from pydantic import BaseModel
from typing import Optional

class Flight(BaseModel):
    flight_id: int
    flight_number: str
    departure_airport: str
    arrival_airport: str
    departure_time: str
    arrival_time: str
    status: str

class FlightCreate(BaseModel):
    flight_number: str
    departure_airport: str
    arrival_airport: str
    departure_time: str
    arrival_time: str
    status: str

class FlightUpdate(BaseModel):
    flight_number: Optional[str]
    departure_airport: Optional[str]
    arrival_airport: Optional[str]
    departure_time: Optional[str]
    arrival_time: Optional[str]
    status: Optional[str]