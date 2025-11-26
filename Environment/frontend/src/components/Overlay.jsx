import { useState, useEffect, useRef } from "react";
import { X, Utensils, Toilet, BriefcaseMedical, Info, Store, Undo2, Redo2, MapPin, Grid3x3 } from 'lucide-react';
import TileMapButton from './TileMapButton';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGlobal } from "./GlobalContext";
import ModalWindow from "../components/ModalWindow.jsx";

const Overlay = ({ addStructure, saveBtnRef, saveBtnRef2, saveEventMap }) => {
    const { id } = useParams();
    const {imperial, setImperial, showGrid, setShowGrid, setInfoOpen} = useGlobal();
    const [showModal, setShowModal] = useState({ open: false, type:"", action:"", input:"" });

    let modalWindow = (
        <ModalWindow
        open={showModal.open}
        onClose={() => setShowModal({...showModal, open: false})}
        type={showModal.type}
        action={showModal.action}
        input={showModal.input}
        />
    );

    return (
        <div className="font-sans">
            {modalWindow}
            
            <div className="flex flex-col lg:flex-row fixed top-34 md:top-20 left-4 pointer-events-auto z-14 gap-4">

                {/* Back to dashboard with "Save changes" modal window*/}
                <button ref={saveBtnRef2}
                className={`btn btn-primary`} 
                onClick={() => {
                    setShowModal({
                        open: true,
                        type: "saveMap",
                        action: saveEventMap, 
                        input: `/event/${id}/dashboard`
                    });
                    setInfoOpen(false);
                }
                }>
                    <span className="text-primary-content">Back to Dashboard</span>
                </button>

                {/* Save EventMap*/}
                <button type="button" ref={saveBtnRef} onClick={saveEventMap} className={'btn btn-accent w-fit'}>
                    <span>Save</span>
                </button>
            </div>

            {/*
            Undo and redo buttons
            <div className="fixed top-20 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
                <button class="btn shadow-lg">
                    <Undo2 />
                    <span>Undo</span>
                </button>
                <button class="btn shadow-lg">
                    <Redo2 />
                    <span>Redo</span>
                </button>
            </div>
            */}

            <div className="flex flex-col-reverse xl:flex-row items-end fixed top-34 md:top-20 right-4 z-14 gap-4 pointer-events-auto">
                {/* Grid toggle */}
                <div className="bg-base-100 p-3 pt-2 pb-2 rounded-lg shadow-lg border border-neutral-300 w-fit">
                    <label className="label text-base-content">
                        Toggle Grid
                        <input type="checkbox" className="toggle checked:toggle-success"
                        checked={showGrid} onChange={() => setShowGrid(!showGrid)}
                        onKeyDown={e => (e.key === "Enter") && e.target.click()}/>
                    </label>
                </div>

                {/* Imperial/metric toggle */}
                <div className="bg-base-100 p-3 pt-2 pb-2 rounded-lg shadow-lg border border-neutral-300">
                    <label className="label text-base-content">
                        Imperial
                        <input type="checkbox" className="toggle checked:toggle-success"
                        checked={!imperial} onChange={() => setImperial((prev) => !prev)}
                        onKeyDown={e => (e.key === "Enter") && e.target.click()}/>
                        Metric
                    </label>
                </div>

                {/* "Add Objects" sidebar drawer */}
                <div className="drawer drawer-end">

                    <input id="add-objects-drawer" type="checkbox" className="drawer-toggle"
                    onKeyDown={e => (e.key === "Enter") && e.target.click()} />
                    <div className="drawer-content flex justify-end">
                        {/* "Add Objects" button */}
                        <label htmlFor="add-objects-drawer" 
                        className="drawer-button btn btn-primary">
                            Add Objects
                        </label>
                    </div>

                    {/* Sidebar drawer */}
                    <div className="drawer-side">
                        <label htmlFor="add-objects-drawer" aria-label="close sidebar" className="drawer-overlay"></label>                   


                        {/* Sidebar content */}
                        <ul className="menu bg-base-200 min-h-full w-80 p-4 pt-20 gap-2">

                            {/* Close button */}
                            <div className="flex flex-col gap-4 mb-4">
                                <li className="mb-4">
                                    <label htmlFor="add-objects-drawer" className="btn btn-sm absolute right-0 top-0"
                                    tabIndex={0}

                                    onKeyDown={e => (e.key === "Enter") && e.target.click()}    >
                                        <X size={18} />
                                        Close
                                    </label>
                                </li>
                            </div>

                            <li className="pointer-events-none">
                                <h1 className="text-lg font-bold">Choose Object to Place</h1>
                            </li>


                            {/* 
                                TileMapButtons for different structures
                                Calls 'addStructure' on click, pass in as prop
                            */}
                            <li>
                                <TileMapButton 
                                name="Food and Drink" 
                                structureType="Food/Drink"
                                tagType="dietary"
                                Icon={Utensils} bgColor="#FFCB3D" 
                                iconColor="text-black" 
                                border="border border-neutral-800"
                                onClick={addStructure} />
                            </li>
                            <li>
                                <TileMapButton 
                                name="Retail" 
                                structureType="Retail"
                                tagType="accessibility"
                                Icon={Store} bgColor="#00D390" 
                                iconColor="text-black" 
                                border="border border-neutral-800"
                                onClick={addStructure} />
                            </li>
                            <li>
                                <TileMapButton 
                                name="Restroom" 
                                structureType="Restroom"
                                tagType="facility"
                                Icon={Toilet} 
                                bgColor="#1346DD" 
                                iconColor="text-white" 
                                border="border border-white"
                                onClick={addStructure} />
                            </li>
                            <li>
                                <TileMapButton 
                                name="Medical" 
                                structureType="Medical"
                                tagType="medical"
                                Icon={BriefcaseMedical} 
                                bgColor="#E02229" 
                                iconColor="text-white" 
                                border="border border-white"
                                onClick={addStructure} />
                            </li>
                            <li>
                                <TileMapButton 
                                name="Information" 
                                structureType="Information"
                                tagType="accessibility"
                                Icon={Info} 
                                bgColor="#8204DC" 
                                iconColor="text-white" 
                                border="border border-white"
                                onClick={addStructure} />
                            </li>
                            <li>
                                <TileMapButton 
                                name="Tent"
                                structureType="Tent"
                                Icon={MapPin} 
                                bgColor="#ffffff" 
                                iconColor="text-black"
                                border="border border-neutral-800"
                                onClick={addStructure} />
                            </li>

                        </ul>
                    </div>
                    
                </div>
            </div>

        </div>
    );
};

export default Overlay;