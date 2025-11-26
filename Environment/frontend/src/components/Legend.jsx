import { useState, useRef, useEffect } from "react";
import { X, Utensils, Toilet, BriefcaseMedical, Info, Store, Undo2, Redo2, MapPin, Calendar, Tickets, StoreIcon, Search } from 'lucide-react';
import TileMapButton from './TileMapButton';
import { data, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGlobal } from "./GlobalContext";
import { useMap } from 'react-leaflet';
import PreviewInfoCard from "./PreviewInfoCard";

const Legend = ({event, structures}) => {

    //focusRef is being used to focus on an item
    const focusRef = useRef(null);
    const { id } = useParams();
    const { zoom } = useGlobal();
    const map = useMap();
    const [startDateFormatted, setStartDate] = useState("");
    const [startTimeFormatted, setStartTime] = useState("");
    const [endDateFormatted, setEndDate] = useState("");
    const [endTimeFormatted, setEndTime] = useState("");
    const [search, setSearch] = useState("");
    
    //these two are used to open the PreviewInfoPage
    const [isOpen, setIsOpen] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [selectItem, setSelectItem] = useState(null);

    const drawerRef = useRef(null);

    // const {imperial, setImperial} = useGlobal();
    // const {stalls, setStalls} = useGlobal();


    // Search handle 
    const handleSubmit = async (e) => {
        e.preventDefault();

    };
    //lowering the users search results
    const lowerCaseSearch = search.trim().toLowerCase();
    // filtering the structure list so only those with valid tag types are visible.
    const filteredStructures = structures.filter(structure => {
        const lowerCaseTags = structure.tags.map(tag => tag.toLowerCase());
        const lowerCaseName = structure.name.toLowerCase();
        const lowerCaseStructureType = structure.structureType.toLowerCase();
        //if there's no searching, then show all strucutes
        //  Note: this could be changed to a for loop that changes the structures 
        //        with every change in the search
        if (lowerCaseSearch == "")
            return structure;
        // if a tag has been searched only show the stalls that match the tag or name of structure
        else 
            return lowerCaseTags.some(tag => tag.includes(lowerCaseSearch)) || 
                    lowerCaseName.includes(lowerCaseSearch) || 
                    lowerCaseStructureType.includes(lowerCaseSearch);
    });



    //this function can be changed but I made it for the time being if there's a better way to close
    const handleClose = () => {
        setIsOpen(false);
        setSelectItem(null);
    };
    
    const handleSelect = (structure) => {
        setSelectItem(structure);
    };

    const handleClick = (structure) => { //Click event for structure list in legend
        map.setView([structure.position[0], structure.position[1]], map.getZoom());
        // Can we set the focus to the structure here somehow? 
        setIsShown(true);
        setIsOpen(true);
        setSelectItem(structure);
        //making the focus on the structure but don't know if it works
        focusRef.current.focus();

        if (drawerRef.current) {
            drawerRef.current.checked = false;
        }
    };

    useEffect(() => { //Setter for all times
        setStartDate(formatDate(event.startDate));
        setEndDate(formatDate(event.endDate));
        if (event.startTime != "") setStartTime(formatTime(event.startTime));
        else setStartTime(false);
        if (event.endTime != "") setEndTime(formatTime(event.endTime));
        else setEndTime(false);
    }, []);

    const formatDate = (date) => { //Make date in form "Month Date, Year"
        let parts = date.split('-');
        var months = ["January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December"];
        var s = months[parts[1] - 1];
        s = s + " " + parts[2] +  ", " + parts[0];
        return s;
    };

    const formatTime = (time) => { //Make the time show AM/PM instead of military time
        let parts = time.split(':');
        var hour = Number(parts[0]);
        var s = "";
        if (hour < 13){
            s = parts[0] + ":" + parts[1] + " AM";
        } else {
            hour = hour - 12;
            s = String(hour)
            if(hour < 10){
                s = "0"+ s;
            }
            s = s + ":" + parts[1] + " PM";
        }
        return s;
    };

    useEffect(() => {
        const drawer = drawerRef.current;

       const handleOpenDrawer = () => {
            if (drawer.checked) {
                map.scrollWheelZoom.disable();
            } else {
                map.scrollWheelZoom.enable();
            }
        };

        drawer.addEventListener("change", handleOpenDrawer);

        handleOpenDrawer();

        return () => {
            drawer.removeEventListener("change", handleOpenDrawer);
        };
    }, [map]);


    return (
        <div>

            {/* "Legend" sidebar drawer */}
            <div className="drawer drawer-end">

                <input id="legend-drawer" type="checkbox" className="drawer-toggle" ref={drawerRef}
                onKeyDown={e => (e.key === "Enter") && e.target.click()} />
                <div className="drawer-content top-20 fixed right-4 flex gap-4 items-center">

                    {/* "Open Legend" button */}
                    <label htmlFor="legend-drawer" className="drawer-button btn btn-primary">Legend</label>
                </div>


                {/* Sidebar drawer */}
                <div className="drawer-side">
                    <label htmlFor="legend-drawer" aria-label="close legend" className="drawer-overlay"></label>

                    {/* Sidebar content */}
                    <ul className="menu bg-base-200 min-h-full sm:w-100 w-full p-4 pt-20 sm:gap-12 gap-16">
                        <div className="flex flex-col gap-4">
                            {/* Close button */}
                            <li className="mb-4">
                                <label htmlFor="legend-drawer" className="btn btn-sm btn-soft absolute right-0 top-0" tabIndex="0">
                                    <X size={18} />
                                    Close
                                </label>
                            </li>
                            <li className="pointer-events-none">
                                <header id="eventName" tabIndex="0">
                                    <h1 className="text-3xl font-bold">{event.eventName} </h1>
                                </header>
                            </li>
                            <div className="flex flex-col gap-2">
                                <li className="pointer-events-none">
                                    <p className="badge badge-primary badge-soft text font-bold">Start: 
                                        <span className="font-medium">{startDateFormatted} {startTimeFormatted}</span></p>
                                </li>
                                <li className="pointer-events-none">
                                    <p className="badge badge-primary badge-soft text font-bold">End: 
                                        <span className="font-medium">{endDateFormatted} {endTimeFormatted}</span></p>
                                </li>
                            </div>
                        </div>
                        {/* <li className="pointer-events-none">
                            <h1 className="text-lg font-bold">Start and End Time:</h1>
                        </li> */}
                        {/* <li className="pointer-events-none">
                            <p className="text font-bold">{event.event.startTime} to {event.event.endTime}</p>
                        </li> */}
                        <div className="flex flex-col gap-4">
                            <li className="pointer-events-none">
                                <header id="eventName" tabIndex="0" className="flex flex-col items-start">
                                    <div className="flex items-center gap-3">
                                        <Search size={18}/>
                                        <h1 className="text-lg text-nowrap font-bold">Search tags or structures:</h1>
                                    </div>
                                    <p className="text text-base-content/80">e.g. Dairy-free, Wheelchair-accessible, etc.</p>
                                </header>
                            </li>
                            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                                <input className={`input input-bordered`} type="text" placeholder="Enter tag or structure..." value={search} onChange={e => setSearch(e.target.value)}></input>
                            </form>
                        </div>

                        <div className="flex flex-col gap-3">
                            <li className="pointer-events-none">
                                <header id="eventName" tabIndex="0">
                                    <div className="flex items-center gap-3">
                                        <StoreIcon size={18}/>
                                        <h1 className="text-lg font-bold">Structures:</h1>
                                    </div>
                                </header>
                            </li>
                            <div className="overflow-auto">
                                <ul className="flex flex-col gap-4">
                                    {filteredStructures.map(structure => (
                                        <div className="vertical-button-container">
                                            <li>
                                            <button className="btn btn-soft border hover:btn-primary py-10 rounded-lg"
                                            onClick={() => {handleClick(structure)
                                                handleSelect(structure);
                                            }}>
                                                <span className="text-md font-medium" ref={focusRef}>{structure.name}</span>
                                            </button>
                                            </li>

                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        
                    </ul>

                </div>
                <>
                {isShown && isOpen && filteredStructures.map(structure => (
                    <div className="flex h-screen items-center" key={structure.name}>
                        <PreviewInfoCard 
                            structureName={selectItem.name} 
                            structureDescription={selectItem.description}
                            structureTags={selectItem.tags}
                            onClose={handleClose}
                            structure={selectItem}
                        />
                    </div>
                ))}
                {/* If not open, then display nothing */}
                {!isOpen}
                </>
            </div>

        </div>
    );
};

export default Legend;