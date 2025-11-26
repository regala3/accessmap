import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import CanvasLayer from "./CanvasLayer";
import Structure from "./Structure";
import Search from "./Search";
import { useGlobal } from "./GlobalContext";
import Legend from "./Legend";
import SetCenter from "./SetCenter";
import Overlay from "./Overlay";

const Map = ({ structures, addStructure, removeStructure, center, saveBtnRef, saveBtnRef2, imperial, zoom, event, isEmbedded, saveEventMap }) => {

    // Set base zoom for map (level of zoom on Leaflet), map will begin at this zoom level
    const [currentlyOpen, setCurrentlyOpen] = useState(null)    // Keep track of if another InfoCard is already currently open
    const {editing, showGrid, setInfoOpen} = useGlobal();

    // Using Tab navigation between structures
    const tabNavigation = (direction) => {
        if (currentlyOpen === null) return;
        let nextIndex = direction === 'next' ? currentlyOpen + 1 : currentlyOpen - 1;
        if (nextIndex < 0) nextIndex = structures.length - 1;
        if (nextIndex >= structures.length) nextIndex = 0;
        setCurrentlyOpen(nextIndex);
    };

    // ScaleBar component, shows scale at bottom of map in meters
    const ScaleBar = () => {
        const map = useMap();

        // When map is scrolled, create a new scale and add that to map
        useEffect(() => {
            const scale = L.control.scale({
                position: "bottomleft",
                imperial: imperial,
                metric: !imperial,
                maxWidth: 200,
            });
            scale.addTo(map);

            return () => scale.remove();
        }, [map]);
    };

    // Grid lines on map
    const MapWithGrid = () =>{
        const map = useMap();
        return <CanvasLayer map={map}/>
    }

    return (
        <MapContainer 
            center={center} 
            zoom={zoom}
            style={{height: "100vh"}}
            zoomControl={false}
            doubleClickZoom={false}
            maxZoom={22}
            minZoom={18}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxNativeZoom={22}
                maxZoom={22}
                minZoom={18}
            />

            {editing && (
            <Overlay addStructure={addStructure} saveBtnRef={saveBtnRef} saveBtnRef2={saveBtnRef2} saveEventMap={saveEventMap}/>  
            )}

            {editing && (
            <Search apiKey={"annregalab@gmail.com"} baseZoom={zoom}/>
            )}
            <ZoomControl position="bottomright" />   {/* + and - to zoom in and out */}

            {editing && (
            <SetCenter/>
            )}

            {/* Map structures prop as Structure components */}
            {/* Track which structures InfoCard is open through index and isOpen */}
            {structures.map((structure, index) => (
                <Structure
                    key={structure.id}
                    index={index}
                    totalStructures={structures.length}
                    structure={structure}
                    isOpen={currentlyOpen === index}
                    onOpen={() => {setCurrentlyOpen(index); setInfoOpen(true)}}
                    onClose={() => setCurrentlyOpen(null)}
                    onTabNext={() => tabNavigation('next')}
                    onTabPrev={() => tabNavigation('prev')}
                    addStructure={addStructure}
                    removeStructure={removeStructure}
                    imperial={imperial}
                    saveBtnRef={saveBtnRef}
                    saveBtnRef2={saveBtnRef2}
                />
            ))}
            
            <ScaleBar />
            {showGrid && editing && <MapWithGrid />}
            {!editing && !isEmbedded && <Legend style={{zIndex:1}} event={event} structures={structures} />}
        </MapContainer>
    );

};

export default Map;
