import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Trash2 } from 'lucide-react';
import toast from "react-hot-toast";
import ModalWindow from "../components/ModalWindow.jsx";

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState({ open: false, type:"", action:"", input:"" });
  
    const fetchMyEvents = async () => {
        try {
        const res = await axiosInstance.get("/events");
        setEvents(res.data || []);
        } catch (error) {
        console.error("Failed to load events:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const deleteEvent = async (id) => {
        try {
            await axiosInstance.delete(`/events/${id}`);
            await axiosInstance.delete(`/events/${id}/site-plan`);
            await fetchMyEvents();
        } catch (error) {
            console.error("failed to delete event:", error);
            toast.error("error: failed to delete event");
        }
    };

    const [searchValue, setSearchValue] = useState("");
    const filteredEvents = events.filter(event =>
            event.eventName.toLowerCase().includes(searchValue.toLowerCase())
        );

    const searchBar = (
        <input
            type="input"
            className="input input-bordered bg-base-200 text-md rounded-lg px-4 py-3 w-3/4"
            placeholder="Search for an event..."
            onChange={(e) => setSearchValue(e.target.value)}
        > 
        </input>
    )
    let listEvents;
    if(loading) {
        listEvents = <p className="text-base-content/60">Loading your events…</p>;
    }else if (events.length === 0) {
        listEvents = <p className="text-base-content/60">No events yet. Create your first one!</p>;
    }else {
        listEvents = (
        <ul className="space-y-4">
        {filteredEvents.map(ev => (
            <li key={ev._id} className="flex items-center justify-between gap-x-6 rounded-lg bg-base-200 border border-base-300 p-5">
            <div >
                <div className="font-medium">{ev.eventName}</div>
                <div className="text-sm text-base-content/60">{ev.location}</div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
                <Link to={`/event/${ev._id}/dashboard`} className="btn btn-sm btn-accent">
                    Open Dashboard
                </Link>

                <button 
                type="delete"
                className="btn btn-sm btn-error"
                onClick={() => setShowModal({
                    open: true,
                    type: "deleteEvent",
                    action: () => {deleteEvent(ev._id), setShowModal({...showModal, open: false})},
                    input: ev.eventName
                })}
                >
                    <Trash2 size={16}/>
                    Delete
                </button>
            </div>
            </li>
        ))}
        </ul>)
    }

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
    <div className="min-h-screen pt-20 bg-base-200">
        <div className="max-w-5xl mx-auto p-4 py-8">
            <div className="bg-base-100 rounded-xl p-6 space-y-8">
                <div className="text-center mb-14">
                    <h1 className="text-3xl font-semibold ">Hi there! Here's what you've been planning:</h1>
                    <p className="mt-2">View your created events and layouts</p>
                </div>
                <div className="m-2 flex flex-col gap-10">
                    <div className="flex gap-5 justify-between">   
                        {searchBar}
                        <Link to={"/event/create-event"} className={`btn btn-primary`}>
                            <span>Create New Event</span>
                        </Link>
                    </div>
                    <div>
                        {listEvents}
                        {modalWindow}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default HomePage;