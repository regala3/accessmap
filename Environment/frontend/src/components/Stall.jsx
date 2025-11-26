import { useState, useRef } from "react";
import { X } from 'lucide-react';
import InfoCard from "./InfoCard";

const Stall = ({ stall, isOpen, onOpen, onClose }) => {

    const [stallName, setStallName] = useState(stall.name)
    const [stallDescription, setStallDescription] = useState(stall.description || "")
    const [stallTags, setStallTags] = useState([])
    const [selectedTag, setSelectedTag] = useState("")

    const dietaryTags = [
        "Vegan",
        "Vegetarian",
        "Gluten-Free",
        "Nut-Free",
        "Dairy-Free",
        "Halal",
        "Kosher"
    ]

    const accessibilityTags = [
        "Wheelchair Accessible",
        "Mobility Assistence Available",
        "Sign Language Support",
        "Interpreter Available",
    ]

    const facilityTags = [
        "Wheelchair Accessible",
        "Family Restroom",
        "Gender-Neutral Restroom",
        "Seating Available",
        "Pets Allowed",
        "Wifi-Available"
    ]

    const medicalTags = [
        "First-Aid Kit Available",
        "CPR Certified Staff",
        "EpiPens Available",
        "Wheelchair Accessible",
        "Mobility Assistance Available",
        "Sign Language Support",
        "Interpreter Available",
    ]

    const getTagList = (stall) => {
        switch(stall.tagType) {
            case "dietary":
                return dietaryTags
            case "accessibility":
                return accessibilityTags
            case "facility":
                return facilityTags
            case "medical":
                return medicalTags
            default:
                return []
        }
    }

    const addTag = () => {
        if (selectedTag && !stallTags.includes(selectedTag)) {
            setStallTags([...stallTags, selectedTag])
            setSelectedTag("")
        }
    }

    const removeTag = (tagName) => {
        setStallTags(stallTags.filter((tag) => tag !== tagName));
    }

    /* Drag functionality */
    const [location, setLocation] = useState({ 
        x: window.innerWidth / 2 - 40, 
        y: window.innerHeight / 2 - 40 
    })
    const stallRef = useRef(null);
    const startLocation = useRef({ x: 0, y: 0 })

    const handleMouseDown = (e) => {
        e.preventDefault();

        startLocation.current = {
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (e) => {
        const newX = startLocation.current.x - e.clientX;
        const newY = startLocation.current.y - e.clientY;

        startLocation.current = {
            x: e.clientX,
            y: e.clientY,
        }

        setLocation((prev) => ({
            x: prev.x - newX,
            y: prev.y - newY,
        }))
    }

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }
    

    return (
        <>
            {/* Stall object on map */}
            <div
                ref={stallRef}
                onMouseDown={handleMouseDown}
                onDoubleClick={isOpen ? onClose : onOpen}
                style={{
                    position: "absolute",
                    left: `${location.x}px`,
                    top: `${location.y}px`,
                    cursor: "grab",
                }}
                className={`absolute flex flex-col items-center justify-center w-20 h-20 rounded-lg ${stall.bgColor}`}
            >
                {stall.Icon && <stall.Icon size={28} className={stall.iconColor} />}
                <span className="mt-1 text-xs font-semibold text-white text-center">
                    {stallName}
                </span>
            </div>

            {/* Stall info card */}
            {isOpen && (

                <InfoCard 
                stallName={stallName} 
                setStallName={setStallName} 
                stallDescription={stallDescription}
                setStallDescription={setStallDescription}
                tagType={stall.tagType}
                tagTypeList={getTagList(stall)}
                stallTags={stallTags}
                addTag={addTag}
                removeTag={removeTag}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                onClose={onClose}
                />

            )}
        </>
    );
};

export default Stall;
