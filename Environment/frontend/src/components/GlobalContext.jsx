import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [imperial, setImperial] = useState(true);
  const [location, setLocation] = useState({
      lat: 36.110013,
      lng: -115.140546,
      label: "",
    });
  const [zoom, setZoom] = useState(19);
  const [editing, setEditing] = useState(true);
  const [eventID, setEventID] = useState(null);
  const [mini, setMini] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true); // to solve problem of InfoCard appearing on top of Back to Dashboard modal in SitePlanPage; set in Overlay

  return (
    <GlobalContext.Provider value={{ imperial, setImperial, location, setLocation, zoom, setZoom, 
    editing, setEditing, eventID, setEventID, mini, setMini, showGrid, setShowGrid, infoOpen, setInfoOpen }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}