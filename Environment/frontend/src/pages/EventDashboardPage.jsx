import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import QRCodePage from "../components/QRCodePage";
import { useGlobal } from "../components/GlobalContext";
import { SquarePen, MapPin, Calendar, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const EventDashboardPage = () => {
  const { id } = useParams(); // id = :id in route
  const navigate = useNavigate();
  const { mini, setMini} = useGlobal();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrintQR, setShowPrintQR] = useState({ open: false, eventName: "", qrValue: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const fetchMyEvents = async () => {
      try {
      const res = await axiosInstance.get("/events");
      setEvents(res.data || []);
      setIsPublished(res.data[0].published);
      } catch (error) {
      console.error("Failed to load events:", error);
      } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
      fetchMyEvents();
  }, []);

  useEffect(() => {
      setMini(true);
  }), [];
  // Updates the event if fields are changed
  const updateEvents = (id, field, value) => 
    setEvents(prevEventState => prevEventState.map(row => (row.id === id ? {...row, [field]:value } : row)));

  const event = events.filter(ev =>
    ev._id === id
  );

// Gets the updated event, changes the data on the database
  const handleSubmit = async (e, mapPublished) => {
      e.preventDefault();
      const event = events.filter(eve => 
        eve._id === id
      );

      const payload = event.map(({eventName, location, startDate, startTime, endDate, endTime, eventCoordinatorName, eventCoordinatorID, stalls }) => ({ 
        eventName,
        location,
        startDate,
        startTime,
        endDate,
        endTime,
        eventCoordinatorName,
        eventCoordinatorID,
        stalls,
        published: mapPublished
      }));

      // input validation for date range
      if (payload[0].startDate > payload[0].endDate) {
        toast.error("Invalid date range");
        return;
      }
      // input validation for time range for one-day events
      if (payload[0].startDate == payload[0].endDate) {
        // if start time later than end time
        if (payload[0].startTime > payload[0].endTime) {
          toast.error("Invalid time range");
          return;
        }
        // if start time empty but end time isn't
        if (payload[0].startTime == "" && payload[0].endTime != "") {
          toast.error("Invalid time range");
          return;
        }
      }

      try {
        await axiosInstance.put(`/events/${id}`, payload);
        toast.success("Event updated successfully");
      } catch(error){
        console.error("Failed to update event", error);
      }
  };

  let listEventInfo = (
  
    <ul className="space-y-3">
    {event.map(ev => (
        <li key={ev._id} className="flex flex-col justify-left gap-x-6 p-3">
            <form onSubmit = {handleSubmit} className = "space-y-6">
              {/* Event name */}
              
              <div className="form-control">
                <label className="label space-y-1.5 text-sm flex items-center gap-2">
                  <SquarePen className="w-4 h-4" />
                  <span className="font-medium pb-2 text-base-content">Event Name</span>
                </label>
                <div className="relative">
                  <input
                    className={`input input-bordered w-full`}
                    placeholder={ev.eventName} //Show the existing event instead of an "enter"
                    value={ev.eventName}
                    required={true}
                    onChange={(e) =>
                      updateEvents(ev.id, "eventName", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Event Location */}
              <div className="form-control">
                <label className="label space-y-1.5 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium pb-2 text-base-content">Event Location</span>
                </label>
                <div className="relative">
                  <input
                    className={`input input-bordered w-full`}
                    placeholder={ev.location}
                    value={ev.location}
                    onChange={(e) =>
                      updateEvents(ev.id, "location", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Start date & time */}
              <div className="form-control">
                <label className="label space-y-1.5 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium pb-2 text-base-content">Start Date</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className={`input input-bordered w-full`}
                    placeholder={ev.startDate}
                    value={ev.startDate}
                    onChange={(e) =>
                      updateEvents(ev.id, "startDate", e.target.value)
                    }
                  />
                  <input
                    type="time"
                    className={`input input-bordered w-full`}
                    placeholder={ev.startTime}
                    value={ev.startTime}
                    onChange={(e) =>
                      updateEvents(ev.id, "startTime", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* End date & time */}
              <div className="form-control">
                <label className="label space-y-1.5 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium pb-2 text-base-content">End Date</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className={`input input-bordered w-full`}
                    placeholder="Enter end date"
                    value={ev.endDate}
                    onChange={(e) =>
                      updateEvents(ev.id, "endDate", e.target.value)
                    }
                  />
                  <input
                    type="time"
                    className={`input input-bordered w-full`}
                    placeholder="Enter end time"
                    value={ev.endTime}
                    onChange={(e) =>
                      updateEvents(ev.id, "endTime", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-accent">
                  Save Changes
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-y-6 justify-between mb-8 mt-8">
                <Link to={`/event/${id}/dashboard/site-plan`} className={`btn btn-primary w-fit`}> 
                      <span>Edit Event Layout</span>
                </Link>
                <Link to={`/event/${id}/dashboard/stalls`} className={`btn btn-primary w-fit`}>
                      <span>View Stalls</span>
                </Link>

                <button 
                  onClick={() => {
                    // setMini(false); //This isn't working for the full page, the global is resetting or something when the page loads? But it does work for the preview
                    {isPublished? window.open(`/event/${id}/public/map`, "_blank", "noreferrer") 
                      : window.location = `/event/${id}/dashboard/preview`}; 
                  }} 
                  className= "btn btn-primary">
                  {isPublished ? "View Published Map" : "Preview Map"}
                  {isPublished && <ExternalLink size={18} />}
                </button>

                { /* <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-primary btn-outline"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button> */ }

                {/* Publish the Map (Updates database as well) */}
                <button 
                  onClick={(e) => { 
                    updateEvents(ev.id, "published", !isPublished);
                    setIsPublished(!isPublished);
                    handleSubmit(e, !isPublished);
                    (isPublished ? toast.success("Event unpublished") : toast.success("Event published"));
                  }}  
                  className={`btn btn-primary w-fit`}>
                        {isPublished? "Unpublish Map" : "Publish Map"}
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-y-6 mb-8">
              <button 
                onClick={() => {
                  const eventName = event.length > 0 ? event[0].eventName : "Event";
                  setShowPrintQR({
                    open: true,
                    eventName: eventName,
                    qrValue: `${window.location.origin}/event/${id}/public/map`
                  });
                }}
                className="btn btn-primary w-full">
                Generate QR Code
              </button>
            </div>

            
        </li>
    ))}
    </ul>
    );

  return (
    <div className="min-h-screen pt-20 bg-base-200">
        <div className="mx-4 p-4 py-8">
          <div className="bg-base-100 rounded-xl p-6 space-y-8">

            <div className="mb-14 relative flex items-center justify-center">
              <Link to={`/`} className={`btn btn-soft absolute top-0 left-0`}> 
                Back to Home
              </Link>
              <div className="text-center justify-center mt-20 md:mt-0">
                <h1 className="text-3xl font-semibold">Event Dashboard</h1>
                <p className="mt-2">Manage your event details and layout</p>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row w-full gap-14">
              <div className="w-full lg:w-1/2">
                {listEventInfo}
              </div>

              <div className="w-full lg:w-1/2">
                {/* Right side - Preview */}
                <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden aspect-square lg:aspect-auto h-full">
                  <iframe 
                    src={`/event/${id}/dashboard/preview?embedded=true`}
                    className="w-full h-full border-none"
                    title="Event Preview"
                  />
                </div>
              </div>

              <QRCodePage 
                open={showPrintQR.open}
                onClose={() => setShowPrintQR({...showPrintQR, open: false})}
                title={showPrintQR.eventName}
                qrValue={showPrintQR.qrValue}
              />

            </div>
            
          </div>
          
      </div>
    </div>
  );
};

export default EventDashboardPage;
