import { useState, useEffect, useRef } from 'react';
import Map from '../components/Map';
import Overlay from '../components/Overlay';
import { useGlobal } from "../components/GlobalContext";
import DefaultMap from '../components/DefaultMap';
import {useParams} from "react-router-dom";
import {Loader2} from "lucide-react";
import {axiosInstance} from "../lib/axios";
import { map } from 'leaflet';
import toast from "react-hot-toast";

const SitePlanPage = () => {
    const { imperial, setImperial, location, setLocation, zoom, setZoom, setEditing, setEventID} = useGlobal();
    const saveBtnRef = useRef();
    const saveBtnRef2 = useRef();
    const{ id } = useParams();
    // Keep track of structures added, these will be rendered on map
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myMap, setMap] = useState([]);
    // const [newMap, setNewMap] = useState([{mapCenter: {x: location.lng, y: location.lat}, eventID: id, zoomLevel: zoom, mapMarkers: []}]);
    useEffect(() => {
        setEditing(true);
    }, []);

    useEffect(() => {
    if (id) {
      setEventID(id);
    }
  }, [id, setEventID]);


    const fetchMyMap = async () => {
        const payload = {
            mapCenter: { x: location.lng, y: location.lat },
            eventID: id,
            zoomLevel: zoom,
            mapMarkers: structures,
            imperial: imperial
        }

        try {
            let res = await axiosInstance.get(`/events/${id}/site-plan`);
            if (res.data.length === 0) {
                res = await axiosInstance.post(`/events/${id}/site-plan`, [payload]);
                fetchMyMap();
            }
            else {
            }
            setMap(res.data || []);
            const center = res.data[0].mapCenter;
            setLocation({ //Set the location globals, but this won't update them right this moment so it's mostly just for the markers
                lat: center.y['$numberDecimal'],
                lng: center.x['$numberDecimal'],
                label: location.label,
            });
            setZoom(res.data[0].zoomLevel);
            if (res.data && res.data.length > 0) { setStructures(res.data[0].mapMarkers || []); }

            setImperial(res.data[0].imperial)

        } catch (error) {
            console.error("Failed to load map:", error);
        } finally {
            setLoading(false);
        }
    };

    let hasFetched = false;

    useEffect(() => {
        if (!hasFetched) {
            fetchMyMap();
            hasFetched = true;
        }
    }, []);

    const saveEventMap = async (e) => {
        e.preventDefault();
        // var payload = null;
        const payload = {
            mapCenter: { x: location.lng, y: location.lat }, //IF there was a search, use the new location.lng/location.lat. Dont' ask me why, but setting centerX or Y state using these uses whatever they were when the page loaded, not hte search, so it has to be this way...
            eventID: id,
            zoomLevel: zoom,
            mapMarkers: structures,
            imperial: imperial
        }
        setMap(prev => [...prev, payload])

        try {
            axiosInstance.put(`/events/${id}/site-plan/${myMap[0]._id}`, [payload]);
            toast.success("Map saved successfully");
        } catch(error){
            console.error("Failed to update map", error);
        }

        let res = await axiosInstance.get(`/events/${id}/site-plan`);
        setMap(res.data)
    }
    
    /**
     * Function to add structures to 'structures' array 
     * @param {*} structureType type of the structure (i.e. "Food/Drink", "Tent")
     * @param {*} name name of the structure
     * @param {*} description description of the structure
     * @param {*} tags tags of the structure (default: [])
     * @param {*} tagType used to determine type of tags that can belong to structure
     * @param {*} dimensions width and length of structure in real-life feet/meters (default: 20 x 20)
     * @param {*} position position of structure on map (default: map center)
     * @param {*} orientation orientation of the structure (default: 0)
     * @param {*} Icon Icon used to represent structure
     * @param {*} bgColor color of the strucutre object
     * @param {*} iconColor color of Icon and text attached to object
     * @param {*} border border color of the structure
     */
    const addStructure = ({ structureType, name, description, tags=[], tagType, dimensions=[20, 20], position=[location.lat, location.lng], orientation=0, Icon, bgColor, iconColor, border }) => {
        const newStructure = { id: crypto.randomUUID(),
            structureType: structureType, 
            name: name, 
            description: description, 
            tags: tags, 
            tagType: tagType, 
            dimensions: dimensions, 
            position: position, 
            orientation: orientation,
            Icon: Icon, 
            bgColor: bgColor, 
            iconColor: iconColor, 
            border: border 
        } 
        setStructures(prev => [...prev, newStructure])
        toast.success("Added " + newStructure.structureType + " object");
    }

    const removeStructure = (type, id) => {
        setStructures(prev => prev.filter(structure => structure.id !== id));
        toast.success("Removed " + type + " object");
    }

    while (loading) { //Load until db has been fetched and the global variables are updated
        return <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>;
    }

    return (
        <div>
            <div className="fixed inset-0 z-10">
                {/* Some function checking if there is a function to check */}
                <Map structures={structures} removeStructure={removeStructure} center={[location.lat, location.lng]}  //Map should display at center coordinates from db by default if a search has not happened. To make these place at the right spot immediately after a search, change it back to location.lat and location.lng, but be aware that that means that when the map loads in and no search has happened, 
                saveBtnRef={saveBtnRef} saveBtnRef2={saveBtnRef2} imperial={imperial} zoom={zoom} addStructure={addStructure} saveEventMap={saveEventMap}/> 
               
                {/* Render structures on Map component, pass in structures prop */}
            </div>

            {/* <div className='fixed inset-0 z-10 pointer-events-none'>
                <Overlay addStructure={addStructure} saveBtnRef={saveBtnRef} saveBtnRef2={saveBtnRef2} saveEventMap={saveEventMap}/> 
            </div> */ }
        </div>
    );
};

export default SitePlanPage;
