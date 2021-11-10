import React from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  LayerGroup,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import bwdb from "./data/stations/bwdb.json";
import { icon } from "leaflet";
import wl_station_marker from "./images/level.svg";

export default function App() {
  const position = [24, 90];

  const wlicon = icon({
    iconUrl: wl_station_marker,
    iconSize: [24, 24],
  });

  return (
    <div className="map_container">
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={5}
        maxZoom={13}
        style={{ width: "100vw", height: "100vh" }}
      >
        <LayersControl position="topright">

        <LayersControl.BaseLayer checked name="OSM - Standard">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OSM - Black and White">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="ESRI Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="BWDB">
            <LayerGroup>
              {bwdb.features.map((station) => (
                <Marker
                  position={[
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0],
                  ]}
                  icon={wlicon}
                >
                  <Popup>
                    Station Name: {station.properties.location} <br />
                    Longitude: {station.properties.x} <br />
                    Latitude: {station.properties.y} <br />
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
