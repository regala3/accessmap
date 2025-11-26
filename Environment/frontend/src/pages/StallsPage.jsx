import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ParseExcel from "../components/ParseExcel.jsx";
import * as XLSX from "xlsx";
import { Trash2, Mail, FileDown, Plus, X } from 'lucide-react';
import ModalWindow from "../components/ModalWindow.jsx";
import toast from "react-hot-toast";

/**
 * @brief Coordinators can assign stalls to a given event
 * 
 * @description StallsPage has four main actions a Coordinator can take:
 *       [1.] Add/Remove individual Stalls
 *       [2.] Import Stalls via a properly formatted .xlsx file
 *       [3.] Export all Stalls the Event currently has
 *       [4.] Invite Vendors to register their stall
 * @route /event/:id/dashboard/stalls
 * @note The stalls present in the table are in the database currently
 * @navigation Back button to /event/:id/dashboard
 */
const StallsPage = () => {

  /*
    TODO:
    -sort for table? // delete all ??
    - After finished with stall page, rework messages:
        coordinator can see all vendors of their events
        vendors can only see the coordinator they are assinged to 
    -x Fix the table scrolling away the search bar and group action buttons
      -x Fix the visible checkbox when row scrolls passed the header
    - Don't freeze the screen while waiting for invites to go out
        - show a spinning bar within the component and a notice of completetion
    - Define logic of sending emails, 
        - vendors with existing pages now have a streamlined process of just signing
          in,(the process that couples _:id's to the different classes is no longer owned by that page,
          it happens when the invites are sent in the backend)
          - that said, we need to define logic for what amount of time should elapse between sending
            existing users an email. Should be more like a push notification, just telling them to log
            in and register new stalls
  */

  // id = :id in route
  const { id } = useParams();
  // Uses id to find current event
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  // for stalls saved in database
  const [allStalls, setAllStalls] = useState([]);
  // for entered but unsaved stalls
  const [stalls, setStalls] = useState([{ id: crypto.randomUUID(), name: "", email: "" }]);
  // For sending email invites to vendors
  const [sending, setSending] = useState(false);

  // Booleans that enable/disable the various components
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInvite, setInvite] = useState(false);
  const [showImport, setImport] = useState(false);
   
 const [showModal, setShowModal] = useState({ open: false, type:"", action:"", input:"" });

  //grabs an event using the eventID in the route
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return; 
      try {
        const res = await axiosInstance.get(`/events/${id}`); 
        setEvent(res.data);   
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  //uses the eventID to find all stalls for event
  const fetchMyStalls = async () => {
    try {
      const res = await axiosInstance.get(`/events/${id}/stalls`);
      setAllStalls(res.data || []);
    } catch (error) {
      console.error("Failed to load stalls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStalls();
  }, [id]);

  //helper functions for stall manipulation
  const addStalls = () =>
    setStalls(prevStallState => [...prevStallState, { id: crypto.randomUUID(), name: "", email: "" }]);

  const removeStalls = (id) =>
    setStalls(prevStallState => prevStallState.filter(row => row.id !== id));

  const updateStalls = (id, field, value) =>
    setStalls(prevStallState => prevStallState.map(row => (row.id === id ? { ...row, [field]: value } : row)));

  const deleteStall = async (stallId) => {
    if (!window.confirm("Confirm: delete this stall?")) return;
    try {
      await axiosInstance.delete(`/events/${id}/stalls/${stallId}`);
      await fetchMyStalls();
    } catch (error) {
      console.error("Failed to delete stall:", error);
      toast.error("Error: failed to delete stall");
    }
  };
  
  const deleteStalls = async (stallIds) => {
    try {
      await Promise.all(
        stallIds.map(stallId =>
          axiosInstance.delete(`/events/${id}/stalls/${stallId}`)
        )
      );
      await fetchMyStalls();
    } catch (error) {
      console.error("Failed to delete stall:", error);
      toast.error("Error: failed to delete stall");
    }
  };

  // Sends invites to all stalls from the event that haven't received an invite yet
  const sendInvites = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("No stalls selected.");
      return;
    }
    setSending(true);

    try {
      // Only send to selected stalls that haven't been invited yet
      const targets = allStalls.filter(
        (stall) => selectedIds.includes(stall._id) && stall.onboardingStatus === "noInvite"
      );

      if (targets.length === 0) {
        toast.error("No 'Uncontacted' stalls selected.");
        return;
      }

      for (const stall of targets) {
        const { _id: stallId, name, email, eventID } = stall;
        await axiosInstance.post(`/auth/${stallId}/signup-vendor-email`, {
          name, email,eventID, stallId
        });
    }
      toast.success(`Invites sent to ${targets.length} stall(s).`);
    } catch (err) {
      console.error("Bulk invite error:", err);
      toast.error("Some invites may have failed. Check console for details.");
    } finally {
      await fetchMyStalls();
      setSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloads = stalls.map(({ id: _tmp, name, email }) => ({
      name,
      email,
      eventID: id,
    }));

    try {
      //we decided the backend would update the stalls one at a time
      // so we have to iteratively call them
      for (const payload of payloads) {
        await axiosInstance.post(`/events/${id}/stalls`, payload);
      }
      toast.success("Stall(s) created successfully");
      await fetchMyStalls();// refreshes the table
      setStalls([{ id: crypto.randomUUID(), name: "", email: "" }]); //re-initializes proposed stalls
      toggleAddForm();
    } catch (err) {
      console.error("Failed to create stalls", err);
    }
  };

  // Displays which step in the onboarding status the Vendor is at
  const onboardingStatusComponent = (onboardingStatus) => {
    switch (onboardingStatus) {
      case "noInvite":
        return (
          <span className="label-text font-bold text-error"> Uncontacted </span>
        );
      case "inviteSent":
        return (
          <span className="label-text font-bold text-warning"> Pending...</span>
        );
      case "vendorRegistered":
        return (
          <span className="label-text font-bold text-success"> Registered </span>
        );
      default:
        return (
          <span className="label-text font-bold"> Error </span>
        );

    }
  };

  // Helper functions for Import Stalls
  const [importRows, setImportRows] = useState([]);
  
  // Save parsed excel rows from ParseExcel to state for importToBackend
  const handleParsed = (rows) => {
    setImportRows(rows); // rows are already {name, email}
  };
  
  // attempt to take incoming rows and pass them to createStall in event.controller.js
  const importToBackend = async () => {
    if (importRows.length === 0) return;
    try {
      await Promise.all(
        importRows.map((row) =>
          axiosInstance.post(`/events/${id}/stalls`, {
            name: row.name,
            email: row.email,
            eventID: id,
          })
        )
      );
      toast.success(`Imported ${importRows.length} stalls`);
      setImportRows([]);
      await fetchMyStalls();
    } catch (err) {
      console.error(err);
      toast.error("Import failed for some rows.");
    }
  };
  
  // helper function for Export Stalls
  // writes an out a file of current stalls to:
  // *event name*-Stalls.xlsx
  const exportStallsToXLSX = () => {

    const selectedStalls = allStalls.filter((stall) => selectedIds.includes(stall._id));

    //we should never hit this case, if we do, ui isn't functioning 
    //as designed. [button to export should only be visible if a row is 
    // selected]
    if (!selectedStalls || selectedStalls.length <= 0) {
      toast.error("No stalls selected to export");
      return;
    }

    const rows = selectedStalls.map((stall) => [
      stall.name,
      stall.email,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${event.eventName}-Stalls.xlsx`);
  };

  
  const [selectedIds, setSelectedIds] = useState([]); // selected rows state
  // Defines the behavior checkbox in the header of the table 
  const allSelected = selectedIds.length === allStalls.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      // Select everything
      setSelectedIds(allStalls.map(stall => stall._id));
    }
  };

  // Defines behavior of the search input above the table
  const [searchValue, setSearchValue] = useState("");
  const filteredStalls = allStalls.filter(stall =>
    stall.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  let searchBar =(
    <input
      type="input"
      className="input input-bordered w-full bg-base-200 text-md rounded-lg px-4 py-3"
      placeholder="Search for a stall..."
      onChange={(e) => setSearchValue(e.target.value)}
    >
    </input>
  );

  let exportStallsButton = (
      <button
        type="button"
        className="btn btn-primary hover:btn-primary"
        onClick={() => setShowModal({
          open: true,
          type: "exportStalls",
          action: () => {exportStallsToXLSX(), setShowModal({...showModal, open: false})},
        })} 
      >
        {allSelected ?<><FileDown size={16} />Export All</> :<><FileDown size={16} />Export</>}
      </button>
  );

  let modalWindow = (
    <ModalWindow
      open={showModal.open}
      onClose={() => setShowModal({...showModal, open: false})}
      type={showModal.type}
      action={showModal.action}
      input={showModal.input}
    />
  );

  // Responsible for rendering the main table. Displays all stalls currently assigned to 
  // this event
  let listStalls;
  if (loading) {
    listStalls = <p className="text-base-content/60">Loading your Stalls…</p>;
  } else if (allStalls.length === 0) {
    listStalls = <p className="text-base-content/60">No stalls yet. Create your first one!</p>;
  } else {
    listStalls = (
      <div className="flex flex-col gap-6">
        <div className="overflow-auto max-h-80 rounded-md ">
          <div className="flex flex-wrap justify-end space-x-2 mb-2 gap-4">
            <div className="w-full md:w-1/2">
              {searchBar}
            </div>
            <div className="flex flex-wrap gap-2 ml-auto">
              {selectedIds.length > 0 && (
                <>
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={sendInvites}
                    disabled={sending}>
                    {allSelected ? <><Mail size={16}/>Invite All</> : <><Mail size={16}/>Invite</>}
                  </button>

                  {exportStallsButton}

                  {modalWindow}
                  
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => setShowModal({
                      open: true,
                      type: "deleteStalls",
                      action: () => {deleteStalls(selectedIds), setShowModal({...showModal, open: false})},
                      input: selectedIds.length
                    })}
                    > {allSelected ? <><Trash2 size={16}/>Delete All</>:<><Trash2 size={16}/>Delete</> }
                  </button>
                  
                </>  
                )
              }
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-80 rounded-md bg-base-200 border border-base-content/20">
          <table className="table table-sm w-full">
            <thead className="bg-base-300 sticky top-0 z-20">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Onboarding Status</th>
                <th className="text-center">Actions
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary ml-2"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  ></input>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStalls.map((stall) => (
                <tr key={stall._id} 
                    className={`${selectedIds.includes(stall._id) ? "bg-primary/20" : ""} hover`}
                >
                  <td className="whitespace-nowrap">{stall.name}</td>
                  <td className="whitespace-nowrap">{stall.email}</td>
                  <td className="whitespace-nowrap">{onboardingStatusComponent(stall.onboardingStatus)}</td>
                  <td className="whitespace-nowrap text-center">
                    {/* span for spacing */}
                    <span className="opacity-0 mr-4">
                      Actions
                    </span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedIds.includes(stall._id)}
                        onChange={() => {
                          setSelectedIds(prev => prev.includes(stall._id)
                              ? prev.filter(id => id !== stall._id)  // deselect
                              : [...prev, stall._id]                 // select
                          );
                        }}
                      />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  // lets Coordinator enter/remove stalls one at a time.
  let addStallsForm = (
    <div className="rounded-lg bg-base-300 p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>

          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">

            <label className="label">
              <span className="text-base-content font-medium"> Add Stalls</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm border-base-content"
                onClick={() => {
                  toggleAddForm();
                }}
              >
                Collapse List
              </button>
              <button
                type="button"
                className="btn btn-sm btn-accent"
                onClick={addStalls}
              >
                <Plus size={16}/>
                Add Stall
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => {
                  setStalls([{ id: crypto.randomUUID(), name: "", email: "" }]);
                  toggleAddForm();
                }}
              >
                Cancel
              </button>
            </div>

          </div>


          <div className="space-y-4">

            {stalls.map((stall) => (
              <div
                key={stall.id}
                className="rounded-lg bg-base-100 p-6 flex flex-col gap-6"
              >
                <div>
                  <label className="label text-base-content text-sm mt-2 mb-2">
                    Vendor Name:
                  </label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Enter vendor name..."
                    value={stall.name}
                    onChange={(e) => updateStalls(stall.id, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="label text-base-content text-sm mt-2 mb-2">
                    Vendor Email:
                  </label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Enter vendor email..."
                    value={stall.email}
                    onChange={(e) => updateStalls(stall.id, "email", e.target.value)}
                  />
                </div>

                <div className="flex justify-end mt-1 mb-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() => removeStalls(stall.id)}
                    disabled={stalls.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <button type="submit" className="btn btn-primary">
                Save Stalls
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  )

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleImport = () => {
    setImport(!showImport);
  };

  const toggleInvite = () => {
    setInvite(!showInvite);
  };

  // Displays ParseExcel component
  let importFileComponent = (
    <div className="rounded-lg bg-base-300 p-6 space-y-4">

      <div className="flex items-center justify-between mb-6">
        <label className="label">
          <span className="text-base-content font-medium"> Import Stalls</span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => {
              toggleImport();
            }}
          >
            Close
          </button>
        </div>
      </div >

      <div className="flex flex-col relative rounded-lg border border-base-300 space-y-3">
        <ParseExcel onParsed={handleParsed} />
        <button
          type="button"
          className="btn btn-md btn-primary absolute bottom-0 right-0"
          onClick={importToBackend}
          disabled={importRows.length === 0}
        >
          Import Stalls
        </button>
      </div>

    </div>
  )

  // dislays the vendor registration preview
  // A list of currently selected stalls. If the Coordinator has 
  // more than 10 events, they wont be able to see all of them at once
  // in the table, this component provides a quick reference to that end.
  let inviteComponent = (
    <div className="rounded-lg bg-base-300 p-6 space-y-4">

      <div className="flex items-center justify-between mb-6">
        <h2>
          <span className="text-base-content font-medium"> Preview Invites</span>
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => {
              toggleInvite();
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-lg bg-base-100 p-6">
        <h3>
          <span className="text-base-content text-sm">Invitations will be sent to the following vendors:</span>
        </h3>
        <ul className="flex flex-col gap-4">
          {selectedIds.map((stallId) => {
            const stall = allStalls.find(stall => stall._id === stallId);  // lookup stalls
            if (!stall) return null; 
            return (
              <li key={stall._id}>
                <span className="text-md">{stall.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={sendInvites}
          disabled={sending}>
          {sending ? "Sending…" : "Send Invites"}
        </button>
      </div>

    </div>
  ) 

  let toggleAddStallsButton = (
    <button
      type="button"
      className={showAddForm ? "btn btn-primary btn-soft border-primary" : "btn btn-primary"}
      onClick={toggleAddForm}
    >
      {showAddForm ? <X size={16}/> : <Plus size={16}/>}
      Add Stalls
    </button>
  )
  let invitationButton = (
    <button
      type="button"
      className={showInvite ? "btn btn-primary btn-soft border-primary" : "btn btn-primary"}
      onClick={toggleInvite}
    >
      {showInvite ? <X size={16}/> : <Plus size={16}/>}
      Invitation Preview
    </button>
  )
  let importStallsButton = (
    <button
      type="button"
      className={showImport ? "btn btn-primary btn-soft border-primary" : "btn btn-primary"}
      onClick={toggleImport}
    >
      {showImport ? <X size={16}/> : <Plus size={16}/>}
      Import Stalls
    </button>
  )
  return (
    <div className="min-h-screen pt-20 bg-base-200">
      <div className="max-w-5xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-8">

          <div className="mb-14 relative flex items-center justify-center">
            <Link to={`/event/${id}/dashboard`} className={`btn btn-soft absolute top-0 left-0`}> 
              Back to Dashboard
            </Link>
            <div className="text-center justify-center mt-20 md:mt-0">
              <h1 className="text-3xl font-semibold">Stalls Dashboard</h1>
              <p className="mt-2">Manage your event stalls and vendors</p>
            </div>
          </div>

            <hr className="border-0 h-[1px] bg-base-content/10 rounded my-4" />
            <h2 className="text-2xl font-bold mb-5 mt-5">{event?.eventName} - {new Date(event?.startDate).toLocaleDateString()} </h2>
            <h1 className="text-2xl font-bold mb-5"> Stalls:</h1>

          <div>
            {listStalls}
          </div>

          <div className="flex flex-wrap gap-4 my-4">
                {toggleAddStallsButton}
                {importStallsButton}
                {invitationButton}
          </div>

          {showAddForm && <div className="mt-5">{addStallsForm}</div>}
          {showImport && <div className="mt-5">{importFileComponent}</div>}
          {showInvite && <div className="mt-5">{inviteComponent}</div>}

        </div>
      </div>
    </div>

  );

};

export default StallsPage;