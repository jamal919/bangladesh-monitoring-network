import React from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function App() {
  var position = [24, 90];

  return(
    <div className="map_container">
      <MapContainer center={position} zoom={7} scrollWheelZoom={true} minZoom={4} maxZoom={13} style={{ width: '100vw', height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
    </div>
  );
}
