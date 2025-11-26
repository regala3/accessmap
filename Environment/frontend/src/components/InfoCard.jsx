import { useEffect, useRef, useState } from 'react';
import { X, Trash2, Copy } from 'lucide-react';
import StallDropdown from './StallDropdown';
import { useMap } from 'react-leaflet';

const InfoCard = ({ structure, structureName, setStructureName, structureDescription, setStructureDescription, tagType, tagTypeList, 
                    structureTags, setStructureTags, structureDimensions, setStructureDimensions, structureLocation, setStructureLocation, 
                    structureOrientation, setStructureOrientation, onClose, addStructure, removeStructure, imperial }) => {

    const [selectedTag, setSelectedTag] = useState("")  // State and setter for selecting which tag to add
    const [customTag, setCustomTag] = useState("")
    const [showSearch, setShowSearch] = useState(false) // Show the collapsable dropdown

    // Add selectedTag to array of structureTags
    const addTag = (value) => {
        if (value && !structureTags.includes(value)) {
            setStructureTags([...structureTags, value])
            setCustomTag("")
        }
    }

    // Remove tag from array of structureTags
    const removeTag = (tagName) => {
        setStructureTags(structureTags.filter((tag) => tag !== tagName));
    }
    
    useEffect(() => {
        console.log("InfoCard updated:");
        console.log("structureName:", structureName);
        console.log("structureDescription:", structureDescription);
        console.log("structureTags:", structureTags);
    }, [structureName, structureDescription, structureTags]);

    
    const map = useMap();
    const cardRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const closeBtn = closeBtnRef.current;

        const handleFocus = () => map.scrollWheelZoom.disable();
        const handleBlur = () => map.scrollWheelZoom.enable();

        if (card) {
            card.addEventListener("mouseenter", handleFocus);
            card.addEventListener("mouseleave", handleBlur);
        }

        closeBtn.addEventListener("click", handleBlur);

        return () => {
        if (card) {
            card.removeEventListener("mouseenter", handleFocus);
            card.removeEventListener("mouseleave", handleBlur);
        }
        };
    }, [map]);
    
    return (
        <>
            <div className="card bg-base-100 w-full md:w-100 shadow-sm flex justify-center md:justify-start m-2 mt-30 z-9999 h-[80vh] overflow-y-scroll cursor-default"
            ref={cardRef}
            tabIndex={0}>
                <div className="card-body flex flex-col justify-between gap-8">

                    <div className='flex flex-col gap-6'>
                        {/* Edit stall name */}
                        <div className="flex flex-col w-full gap-3">
                            <label className='font-bold'>Name:</label>
                            <input
                                type="text"
                                value={structureName}
                                onChange={(e) => setStructureName(e.target.value)}
                                className="input input-bordered w-full font-bold text-lg"
                            />
                            <button
                                className="btn btn-sm btn-primary btn-outline w-auto"
                                onClick={() => setShowSearch(!showSearch)}
                            >
                                {showSearch ? "Collapse" : "Import Vendor Info"}
                            </button>
                            {showSearch && (
                                <StallDropdown
                                    onChange={(stall) => {
                                        setStructureName(stall.name);
                                        setStructureDescription(stall.description || "");
                                        setStructureTags(stall.tagList || []);
                                        setShowSearch(false);
                                    }}
                                />
                            )}
                        </div>


                        {/* Accessibility tags */}
                        <div className="flex flex-wrap gap-2">
                            {structureTags.map((tag) => (
                                <div key={tag} className="badge badge-outline relative group">
                                    {tag}
                                    <X onClick={() => removeTag(tag)} className="hidden group-hover:block w-3 cursor-pointer" />
                                </div>
                            ))}
                        </div>

                        {/* Dropdown menu to add tags, input for custom tags */}
                        <div className='flex flex-col gap-3'>
                            <label className='font-bold'>Tagging:</label>
                            {tagTypeList.length > 0 && (
                                <div className="flex items-center">
                                    <select 
                                        className="select"
                                        value={selectedTag} 
                                        onChange={(e) => setSelectedTag(e.target.value)}
                                    >
                                        <option disabled={true} value="">Add {tagType} details</option>
                                        {tagTypeList.map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                        <option value="custom_tag">Custom</option>
                                    </select>
                                    <button className="btn btn-sm btn-primary ml-2" onClick={() => {
                                        if(selectedTag && selectedTag !== "custom_tag") addTag(selectedTag);
                                    }}>Add Tag</button>
                                </div>
                            )}

                            {(tagTypeList.length === 0 || selectedTag === "custom_tag") && (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Enter a custom tag..."
                                        value={customTag}
                                        onChange={(e) => setCustomTag(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addTag(customTag)}
                                    />
                                    <button className="btn btn-sm btn-primary ml-2" onClick={() => {addTag(customTag)}}>Add Tag</button>
                                </div>
                            )}
                        </div>

                        {/* Change dimensions of structure */}
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between'>
                                <label className='w-70 font-bold'>Width:</label>
                                <input
                                    type="text"
                                    value={structureDimensions[0]}
                                    onChange={(e) => setStructureDimensions([e.target.value, structureDimensions[1]])}
                                    className="input input-bordered w-full mb-2"
                                />
                                {imperial ? 
                                    <span className="px-2">feet</span> 
                                    : <span className="px-2">meters</span> }
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <label className='w-70 font-bold'>Length:</label>
                                <input
                                    type="text"
                                    value={structureDimensions[1]}
                                    onChange={(e) => setStructureDimensions([structureDimensions[0], e.target.value])}
                                    className="input input-bordered w-full mb-2"
                                />
                                {imperial ? 
                                    <span className="px-2">feet</span> 
                                    : <span className="px-2">meters</span> }
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <label className='w-70 font-bold'>Orientation:</label>
                                <input
                                    type="text"
                                    value={structureOrientation}
                                    onChange={(e) => setStructureOrientation(e.target.value)}
                                    className="input input-bordered w-full mb-2"
                                />
                                <span className="px-2">deg.</span> 
                            </div>
                        </div>

                        {/* Edit stall description */}
                        <div>
                            <label className='font-bold'>Description:</label>
                            <textarea
                                value={structureDescription}
                                onChange={(e) => setStructureDescription(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                rows={3}
                                placeholder="Enter description..."
                            />
                        </div>
                    </div>

                    {/* Close and delete button for info card */}
                    <div>
                        <div className="card-actions justify-between">
                            <button className="btn btn-sm btn-error" onClick={() => (removeStructure(structure.structureType, structure.id))}>
                                <Trash2 size={16}/>
                                Delete
                            </button>
                            {/* {structureType, name, description, tags, tagType, dimensions, position, orientation, Icon, bgColor, iconColor, border } */}
                            <button className="btn btn-sm btn-neutral btn-outline" 
                                onClick={() => 
                                    addStructure({
                                        structureType: structure.structureType,
                                        name: structureName + " Copy",
                                        description: structureDescription,
                                        tags: structureTags,
                                        tagType: structure.tagType,
                                        dimensions: structureDimensions, 
                                        position: [parseFloat(structureLocation[0]) - 0.00004, parseFloat(structureLocation[1]) + 0.00004],
                                        orientation: structureOrientation,
                                        Icon: structure.Icon,
                                        bgColor: structure.bgColor,
                                        iconColor: structure.iconColor,
                                        border: structure.border
                                    })
                                }>
                                <Copy size={16}/>
                                Copy
                            </button>
                            <button ref={closeBtnRef} className="btn btn-sm btn-soft" onClick={onClose}>
                                <X size={16} />
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default InfoCard;
