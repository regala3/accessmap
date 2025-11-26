import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

/** 
 * @brief Vendors interface for editing individual stall information
 * @route /vendor/:stallId/
 * @note VendorSignupPage is only accessible via an invite link from the coordinator
 * @note2 Will need to return to implement menu functionality
 * @navigation Back button to /vendor
 * */
const VendorStallPage = () => {
  const { stallId } = useParams();
  const [stall, setStall] = useState(null);
  const [loadingStall, setLoadingStall] = useState(true);
  const [showFoodInfo, setShowFoodInfo] = useState(false);
  const [stallRegistered, setStallRegistered] = useState(false); // thinking of keeping a user visible status [not implemented]
  const [editForm, setEditForm] = useState(false);
  const [tagsArray, setTagsArray] = useState([]) 
  const [formData, setFormData] = useState({
    description: "",
    vendor: "", // company name
    stallType: "", // food or nonFood
    //menu: [],
    tagList: [],
    //
  });

  // one stop shop for adding and removing the dietaryTags from state
  const toggleTag = (tagName) =>
      setTagsArray(prev => 
        prev.includes(tagName)                //does tagName exist in the array?
        ? prev.filter(tag => tag !== tagName) // if it does remove it
        : [...prev, tagName]                  // if it doesn't add it
      );
  
  //from bao
  const dietaryTags = [
        "Vegan",
        "Vegetarian",
        "Gluten-Free",
        "Nut-Free",
        "Dairy-Free",
        "Halal",
        "Kosher"
  ]
  
  // fetches stall via :stallId from route
  useEffect(() => {
      const fetchStall = async () => {
      try {
          const res =  await axiosInstance.get(`/events/stalls/${stallId}`);
          setStall(res.data);
          if(res.data.onboardingStatus === "vendorRegistered"){
            setStallRegistered(true);
          }else{setStallRegistered(false)}
      } catch (err) {
          console.error("Failed to fetch stall", err);
      } finally {
          setLoadingStall(false);
      }
      };
      fetchStall();
  }, [stallId]);


  // This sets the form data to the fetched stall
  // This is done so that we can load the stall 
  // schema fields and have them editable by the vendor
  useEffect(() => {
    if (stall) {
      setFormData((prev) => ({ 
        ...prev, 
        name: stall.name, 
        email: stall.email, 
        description: stall.description,
        vendor: stall.vendor,
        stallType: stall.stallType,
        tagList: stall.tagList
      }));

      if(stall.tagList.length > 0){
        setShowFoodInfo(true);
        setTagsArray(stall.tagList);
      }
    }
  }, [stall]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      const payload = { 
        ...formData, 
        tagList: tagsArray
       };
      try {
        const res = await axiosInstance.put(`/events/update/${stallId}`, payload);
        toast.success("Event created successfully");
        setEditForm(false)
      } catch (err) {
        toast.error("Error");
        console.error("stall update failed:", err);
      }
    };

    // displays a series of checkboxes for vendor to select relevant 
    // dietary accomodations
    let setTagsComponent = (
     <div>
        <span>Dietary Accommodations:</span>
        <ul className="space-y-2 mt-3">
          {dietaryTags.map(tag => (
            <li key={tag} className="flex items-center gap-3">
              <span className="min-w-30">{tag}</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                disabled={!editForm}
                checked={tagsArray.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
            </li>
          ))}
        </ul>
     </div>
    )

    // submit: sends update
    // revert: refreshes the page
    let submitButton;
    if(editForm){
      submitButton = (
        <div className="flex space-x-5">
            <button type="submit" className="btn btn-accent">
               Submit Changes
            </button>
            <button 
                type="button"
                className="btn btn-secondary "
                onClick={() => window.location.reload()}
            >
               Revert
            </button>
        </div>


      )
    }
    let editFormButton;
    if(!editForm){
        editFormButton = (
        <button
            type="button"
            className="btn btn-primary"
            onClick={() => setEditForm(!editForm)}
        >
            Edit Stall Information
        </button>)
    }
    
    let backButton = (
        <Link to={`/vendor`} className="btn btn-primary">
           Back to Dashboard
        </Link>
    )
  
    if(loadingStall){
        return (
            <div className="min-h-screen grid place-items-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        )
    }

  return (
          <div className="min-h-screen pt-20 bg-base-200">
                <div className="container flex flex-1 flex-col p-6 mx-auto bg-base-100/50">
                    <div className="absolute">
                      {backButton}
                    </div>
                    <div className=" text-center mb-8">
                        <h1 className="text-3xl font-bold"> {formData.name}</h1>
                        <p className="mt-2">Details about your stall!</p>
                    </div>
                    <hr className="border-0 h-[1px] bg-base-content/10 rounded my-4" />

                <div>
                
                <form onSubmit={handleSubmit} className="space-y-6 w-3/4">

                  {/* Stall name */}
                  <div className="form-control">
                    <div className="container flex flex-row justify-between items-center mt-5 mb-2">
                    <label className="label">
                      <span className="label-text font-medium">Stall Name</span>
                    </label>
                      {editFormButton}
                      {submitButton}
                    </div>
                    <div className="relative mt-3">
                      <input
                        className={`input input-bordered w-full`}
                        value={formData.name}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Stall email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Contact E-mail</span>
                    </label>
                    <div className="relative mt-3">
                      <input
                        className={`input input-bordered w-full`}
                        value={formData.email}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Stall Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <div className="relative mt-3">
                      <textarea
                        className={`textarea textarea-bordered w-full h-32 resize-none`}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        readOnly={!editForm}
                      />
                    </div>
                  </div>

                  {/* Vendor Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Company Name</span>
                    </label>
                    <div className="relative mt-3">
                      <input
                        className={`input input-bordered w-full`}
                        value={formData.vendor}
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                        readOnly={!editForm}
                      />
                    </div>
                  </div>

                  {/* Stall Type */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Do you sell food?</span>
                    </label>
                    <div className="relative mt-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked= {formData.stallType === "food"}
                        disabled={!editForm}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setShowFoodInfo(isChecked);
                          setFormData((prev) => ({
                            ...prev,
                            stallType: isChecked ? "food" : "nonFood",
                          }));
                        }}
                      />
                    </div>
                  </div>       
                  {showFoodInfo && setTagsComponent}
                </form>
              </div>
            </div>
          </div>
  )
}

export default VendorStallPage