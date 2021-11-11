import React from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ScaleControl,
  Marker,
  LayerGroup,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import bwdb from "./data/stations/bwdb.json";
import biwta from "./data/stations/biwta.json";
import { icon } from "leaflet";
import DyGraph from "./components/Graph.js";
import marker_level from "./images/level.svg";
import marker_oceantide from "./images/oceantide.svg";

// Check if an url exists
async function exists(url) {
  const result = await fetch(url, { method: 'HEAD' });
  return result.ok;
}

// The main application
export default function App() {
  const position = [24, 90];
  const databaseURL = "https://raw.githubusercontent.com/jamal919/bangladesh-monitoring-network/master/database/";

  const icon_level = icon({
    iconUrl: marker_level,
    iconSize: [24, 24],
  });

  const icon_tide = icon({
    iconUrl: marker_oceantide,
    iconSize: [24, 24],
  });

  return (
    <div className="map_container">
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={5}
        maxZoom={16}
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
                  icon={icon_level}
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

          <LayersControl.Overlay checked name="BIWTA">
            <LayerGroup>
              {biwta.features.map((station) => (
                <Marker
                  position={[
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0],
                  ]}
                  icon={icon_tide}
                >
                  <Popup maxWidth={700}>
                    Station Name: {station.properties.StationName} <br />
                    Longitude: {station.properties.Longitude} <br />
                    Latitude: {station.properties.Latitude} <br />
                    Authority: {station.properties.Authority} <br />
                    <DyGraph
                      url={databaseURL + "biwta/" + station.properties.StationName + ".csv"}
                      title={station.properties.StationName}
                    ></DyGraph>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <ScaleControl
          position="bottomright"
          metric={true}
          imperial={true}
          maxWidth={200}
        ></ScaleControl>
      </MapContainer>
    </div>
  );
}
