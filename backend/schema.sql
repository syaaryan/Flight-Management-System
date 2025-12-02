CREATE DATABASE IF NOT EXISTS airline;
USE airline;

CREATE TABLE IF NOT EXISTS airports (
    airport_code VARCHAR(10) PRIMARY KEY,
    airport_name VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT,
    flight_number VARCHAR(20),
    departure_airport VARCHAR(10),
    arrival_airport VARCHAR(10),
    departure_time DATETIME,
    arrival_time DATETIME,
    status VARCHAR(20),
    PRIMARY KEY (flight_id),
    FOREIGN KEY (departure_airport) REFERENCES airports(airport_code),
    FOREIGN KEY (arrival_airport) REFERENCES airports(airport_code)
);
