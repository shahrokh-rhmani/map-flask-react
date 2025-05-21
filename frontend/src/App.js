import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// رفع مشکل آیکون‌های پیش‌فرض leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/location')
      .then(response => response.json())
      .then(data => setLocation(data));
  }, []);

  if (!location) return <div>Loading...</div>;

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{
        width: '800px',
        height: '500px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <MapContainer 
          center={location.position} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location.position}>
            <Popup>
              {location.city} <br /> {location.message}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;