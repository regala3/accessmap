import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import CanvasLayer from "./CanvasLayer";
import Structure from "./Structure";
import Search from "./Search";

const DefaultMap = ({ structures, removeStructure, imperial }) => {
  const defaultCoords = [36.109998, -115.141759];
  const baseZoom = 19;
  const [currentlyOpen, setCurrentlyOpen] = useState(null) 

  const ScaleBar = () => {
    const map = useMap();

    // When map is scrolled, create a new scale and add that to map
    useEffect(() => {
      const scale = L.control.scale({
        position: "bottomright",
        imperial: imperial,
        metric: !imperial,
        maxWidth: 200,
      });
      scale.addTo(map);

      return () => scale.remove();
    }, [map]);
  };

  // Grid lines on map
  const MapWithGrid = () => {
    const map = useMap();
    return <CanvasLayer map={map} />;
  };

  //this is a debugging message, making sure that the user is in the default map
  const DefaultMessage = () => {
    return console.log("this is the default map");
  }

  return (
    <MapContainer
      center={defaultCoords}
      zoom={baseZoom}
      style={{ height: "100vh" }}
      zoomControl={false}
      doubleClickZoom={false}
      maxZoom={22}
      minZoom={18}
    >
      <DefaultMessage />
      <Search apiKey={"annregalab@gmail.com"} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxNativeZoom={baseZoom}
        maxZoom={22}
        minZoom={18}
      />
      <ZoomControl position="bottomleft" /> {/* + and - to zoom in and out */}
      {/* Map structures prop as Structure components */}
      {/* Track which structures InfoCard is open through index and isOpen */}
      {structures.map((structure, index) => (
        <Structure
          key={structure.id}
          index={index}
          structure={structure}
          isOpen={currentlyOpen === index}
          onOpen={() => setCurrentlyOpen(index)}
          onClose={() => setCurrentlyOpen(null)}
          removeStructure={removeStructure}
          imperial={imperial}
        />
      ))}
      <ScaleBar />
      <MapWithGrid />
    </MapContainer>
  );
};

export default DefaultMap;
