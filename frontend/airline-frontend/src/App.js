import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Plus, Pencil, Trash2, Clock, AlertCircle } from 'lucide-react';
import './App.css';

// 🔧 CONFIGURATION: Your backend URL
const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flights');
  
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showAirportForm, setShowAirportForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  useEffect(() => {
    fetchFlights();
    fetchAirports();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/flights/`);
      
      if (!response.ok) throw new Error('Failed to fetch flights');
      
      const data = await response.json();
      setFlights(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to backend. Make sure your FastAPI server is running!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/airports/`);
      if (!response.ok) throw new Error('Failed to fetch airports');
      const data = await response.json();
      setAirports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createFlight = async (flightData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData)
      });
      
      if (!response.ok) throw new Error('Failed to create flight');
      
      await fetchFlights();
      setShowFlightForm(false);
    } catch (err) {
      alert('Error creating flight: ' + err.message);
    }
  };

  const updateFlight = async (flightId, flightData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData)
      });
      
      if (!response.ok) throw new Error('Failed to update flight');
      
      await fetchFlights();
      setEditingFlight(null);
    } catch (err) {
      alert('Error updating flight: ' + err.message);
    }
  };

  const deleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete flight');
      
      await fetchFlights();
    } catch (err) {
      alert('Error deleting flight: ' + err.message);
    }
  };

  const createAirport = async (airportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/airports/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(airportData)
      });
      
      if (!response.ok) throw new Error('Failed to create airport');
      
      await fetchAirports();
      setShowAirportForm(false);
    } catch (err) {
      alert('Error creating airport: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'On Time': '#10b981',
      'Delayed': '#f59e0b',
      'Cancelled': '#ef4444',
      'Boarding': '#3b82f6',
      'Departed': '#8b5cf6',
      'Arrived': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Plane size={32} style={{ color: '#4f46e5' }} />
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>Airline Tracking System</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('flights')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'flights' ? '#4f46e5' : '#e5e7eb',
                  color: activeTab === 'flights' ? 'white' : '#374151'
                }}
              >
                Flights
              </button>
              <button
                onClick={() => setActiveTab('airports')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'airports' ? '#4f46e5' : '#e5e7eb',
                  color: activeTab === 'airports' ? 'white' : '#374151'
                }}
              >
                Airports
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {error && (
          <div style={{ 
            marginBottom: '24px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px',
            display: 'flex',
            gap: '12px'
          }}>
            <AlertCircle size={20} style={{ color: '#dc2626', marginTop: '2px' }} />
            <div>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: '0 0 8px 0' }}>Connection Error</p>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '4px 0 0 0' }}>
                Run: <code style={{ backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>uvicorn main:app --reload</code>
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ 
              display: 'inline-block', 
              width: '48px', 
              height: '48px', 
              border: '3px solid #e5e7eb',
              borderTopColor: '#4f46e5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading data...</p>
          </div>
        )}

        {!loading && activeTab === 'flights' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Flight Schedule</h2>
              <button
                onClick={() => setShowFlightForm(true)}
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
              >
                <Plus size={20} />
                Add Flight
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {flights.length === 0 ? (
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  padding: '64px', 
                  textAlign: 'center' 
                }}>
                  <Plane size={64} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                  <p style={{ color: '#6b7280' }}>No flights scheduled. Add your first flight!</p>
                </div>
              ) : (
                flights.map((flight) => (
                  <div key={flight.flight_id} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                    padding: '24px',
                    transition: 'box-shadow 0.3s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{flight.flight_number}</h3>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: '500',
                            backgroundColor: `${getStatusColor(flight.status)}20`,
                            color: getStatusColor(flight.status)
                          }}>
                            {flight.status}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Departure</p>
                            <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{flight.departure_airport}</p>
                            <p style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                              <Clock size={16} />
                              {flight.departure_time}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Arrival</p>
                            <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{flight.arrival_airport}</p>
                            <p style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                              <Clock size={16} />
                              {flight.arrival_time}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingFlight(flight)}
                          style={{
                            padding: '8px',
                            color: '#3b82f6',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => deleteFlight(flight.flight_id)}
                          style={{
                            padding: '8px',
                            color: '#ef4444',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!loading && activeTab === 'airports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Airports</h2>
              <button
                onClick={() => setShowAirportForm(true)}
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
              >
                <Plus size={20} />
                Add Airport
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {airports.map((airport) => (
                <div key={airport.airport_code} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  padding: '24px',
                  transition: 'box-shadow 0.3s'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={24} style={{ color: '#4f46e5', marginTop: '4px' }} />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{airport.airport_code}</h3>
                      <p style={{ fontWeight: '500', margin: '0 0 4px 0' }}>{airport.airport_name}</p>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{airport.city}, {airport.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showFlightForm && <FlightForm onSubmit={createFlight} onClose={() => setShowFlightForm(false)} />}
      {editingFlight && (
        <FlightForm
          flight={editingFlight}
          onSubmit={(data) => updateFlight(editingFlight.flight_id, data)}
          onClose={() => setEditingFlight(null)}
        />
      )}
      {showAirportForm && <AirportForm onSubmit={createAirport} onClose={() => setShowAirportForm(false)} />}
    </div>
  );
}

function FlightForm({ flight, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    flight_number: flight?.flight_number || '',
    departure_airport: flight?.departure_airport || '',
    arrival_airport: flight?.arrival_airport || '',
    departure_time: flight?.departure_time || '',
    arrival_time: flight?.arrival_time || '',
    status: flight?.status || 'On Time'
  });

  const handleSubmit = () => {
    if (!formData.flight_number || !formData.departure_airport || !formData.arrival_airport) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxWidth: '28rem',
        width: '100%',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          {flight ? 'Edit Flight' : 'Add New Flight'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Flight Number
            </label>
            <input
              type="text"
              value={formData.flight_number}
              onChange={(e) => setFormData({...formData, flight_number: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., AA123"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Departure Airport
            </label>
            <input
              type="text"
              value={formData.departure_airport}
              onChange={(e) => setFormData({...formData, departure_airport: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., JFK"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Arrival Airport
            </label>
            <input
              type="text"
              value={formData.arrival_airport}
              onChange={(e) => setFormData({...formData, arrival_airport: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., LAX"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Departure Time
            </label>
            <input
              type="datetime-local"
              value={formData.departure_time}
              onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Arrival Time
            </label>
            <input
              type="datetime-local"
              value={formData.arrival_time}
              onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option>On Time</option>
              <option>Delayed</option>
              <option>Cancelled</option>
              <option>Boarding</option>
              <option>Departed</option>
              <option>Arrived</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {flight ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AirportForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    airport_code: '',
    airport_name: '',
    city: '',
    country: ''
  });

  const handleSubmit = () => {
    if (!formData.airport_code || !formData.airport_name || !formData.city || !formData.country) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxWidth: '28rem',
        width: '100%',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Add New Airport</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Airport Code
            </label>
            <input
              type="text"
              maxLength={3}
              value={formData.airport_code}
              onChange={(e) => setFormData({...formData, airport_code: e.target.value.toUpperCase()})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., JFK"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Airport Name
            </label>
            <input
              type="text"
              value={formData.airport_name}
              onChange={(e) => setFormData({...formData, airport_name: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., John F. Kennedy International"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., New York"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., USA"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;