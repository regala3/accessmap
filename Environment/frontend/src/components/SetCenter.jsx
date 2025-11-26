import { useState, useRef, useEffect } from "react";
import { useGlobal } from "./GlobalContext";
import { useMap } from 'react-leaflet';
import toast from "react-hot-toast";
import { Lock, LockOpen, } from 'lucide-react';

const SetCenter = ({}) => {
    const { location, setLocation, setZoom } = useGlobal();
    const map = useMap();
    const [locked, setLocked] = useState(true);    // lock mechanism to prevent accidental map center changes

    const handleClick = () => { //Click event for setting map center and zoom
        var coords = map.getCenter();
        setLocation({
        lat: coords.lat,
        lng: coords.lng,
        label: location.label,
        });
        toast.success("Map center set");
    };

    if (locked) {
        // locked
        return (
            <div className="fixed top-63 md:top-48 lg:top-34 left-4 pointer-events-auto z-10 flex">
                <button className="btn btn-soft cursor-not-allowed pointer-events-none" 
                onClick={() => handleClick()}>
                <span className="text-md text-gray-600">Set Map Center</span>
                </button>
                <button className="btn btn-square" onClick={() => setLocked(!locked)}><Lock size={18}/></button>
            </div>
        );
    }
    else {
        // unlocked
        return (
            <div className="fixed top-62 md:top-48 lg:top-34 left-4 pointer-events-auto z-10 flex">
                <button className="btn btn-primary" 
                onClick={() => handleClick()}>
                <span className="text-md">Set Map Center</span>
                </button>
                <button className="btn btn-square" onClick={() => setLocked(!locked)}><LockOpen size={18}/></button>
            </div>
        );
    }

};

export default SetCenter;