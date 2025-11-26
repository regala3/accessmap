import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useGlobal } from "./GlobalContext";

/**
 * @brief DaisyUI dropdown search component for selecting an existing Stall
 *
 * @returns selected stall object through onChange
 */
const StallDropdown = ( {onChange} ) => {
  const { eventID } = useGlobal();
  const [searchValue, setSearchValue] = useState("");
  const [stalls, setStalls] = useState([]);
  const [open, setOpen] = useState(false);

  // Get Stalls with eventID from Global
  useEffect(() => {
    if (!eventID) return;

    const fetchStalls = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventID}/stalls`);
        setStalls(res.data || []);
      } catch (err) {
        console.error("StallDropdown::failed to load stalls:", err);
      }
    };

    fetchStalls();
  }, [eventID]);


  // takes current user input and searches 
  // every stall.name in stalls for input
  const filtered = stalls.filter((stall) =>
    stall.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // when user clicks a stall we return the entire stall object
  // back to InfoCard for setting the fields and collapses the menu
  const handleSelect = (stall) => {
    onChange(stall);        
    setOpen(false);           
  };

  // if filtered is empty, we return one list item that
  // lets the user know there are no matches
  // otherwise we map the filtered stalls to list items 
  // Note: tabIndex={0} is apparently some work around for a bug thats 
  // been around in Safari since 2008:
  // https://daisyui.com/components/dropdown/?lang=en#method-1-details-and-summary
  const dropdown =(
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-auto border border-neutral"
      >
          {filtered.length === 0 && (
            <li>
              No stall with that name.
            </li>
          )}

          {filtered.map((stall) => (
            <li key={stall._id}>
              <button
                type="button"
                className="text-left"
                onClick={() => handleSelect(stall)}
              >
                <span className="font-medium">{stall.name}</span>
              </button>
            </li>
          ))}
      </ul>

  )
  return (
    <div className="dropdown w-full">
      <div
        tabIndex={0}
        className="w-full"
        onFocus={() => setOpen(true)}
      >
        <input
          className="input input-bordered w-full font-bold text-lg"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setOpen(true);
          }}
          placeholder="Search stall..."
        />
      </div>

      {open && dropdown}
    </div>
  );
};

export default StallDropdown;