import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import eventItinerary from "../models/eventItinerary.model.js";
import eventMap from "../models/eventMap.model.js";
import stall from "../models/stall.model.js";
import menuItem from "../models/menuItem.model.js";
import jwt from "jsonwebtoken"; // Don't think we need this
import mongoose from "mongoose";

//Make an event object and save it to the database. Must pass event name, location, start date, start time, end date, and end time.
export const createEvent = async (req, res) => {
    //const {eventName, eventID, location, startDate, startTime, endDate, endTime, eventMap, eventCoordinatorName, eventCoordinatorID} = req.body; // get event stuff
    const{eventName, location, startDate, startTime, endDate, endTime, eventCoordinatorName,eventCoordinatorID} = req.body
    try {
        // if (!eventName || !eventID || !location || !startDate || !startTime || !endDate || !endTime || !eventMap || !eventCoordinatorName || !eventCoordinatorID){
        //     return res.status(400).json({message: "All fields are required"}); // If any of these are empty, they must be filled
        // }
        const newEvent = new Event ({ // Create the newEvent with the filled fields. Currently require all, may change this
            eventName: eventName,
            //eventID: eventID,
            location: location,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            //eventMap: eventMap,
            eventCoordinatorName: eventCoordinatorName,
            eventCoordinatorID: eventCoordinatorID,
            // vendors: vendors,
            published: false,
        });
        const savedEvent = await newEvent.save(); // save to database
        res.status(201).json(savedEvent); // pass back the new mongoose object in the data
        }
    catch (error) {
        console.log("Error in create event controller", error.message);
        res.status(500).json({message: "Internal server error."});
    }
};


export const deleteEvent = async (req, res) => {
    try {
        //console.log("DELETE /events/:id", { params: req.params, req.body }); // debug

        const { id } = req.params; 
        const event =  await Event.findById(id);

        if (!event) {
        return res.status(404).json({
            success: false,
            message: "Event not found.",
        });
        }
        
        // delete the child stalls
        await stall.deleteMany({ eventID: id });

        // remove eventiID from all tethered Users.vendorEvents 
        await User.updateMany({ vendorEvents: id },     
                { $pull: { vendorEvents: id } }
            );
        // delete the event
        await Event.findByIdAndDelete(id); 

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully.",
        });
    }catch(error){
        console.error("Error deleting event:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user._id; 
    const events = await Event
      .find({ eventCoordinatorID: userId })
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json(events);
  } catch (error) {
    console.error("getMyEvents error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getEventById = async (req, res) => {
    console.log("in getEventById");
    try{
        const {eventId} = req.params
        const event = await Event.findById( eventId) ;
        res.status(200).json(event);
    } catch (error) {
        console.error("getEventById error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

// This is untested currently
export const updateEvent = async (req, res) => {
    // console.log("We are trying to update the event!");
    const{eventName, location, startDate, startTime, endDate, endTime, eventCoordinatorName,eventCoordinatorID, stalls, published} = req.body[0]; // Needed to have the [0] because the payload is arriving as an array with one item
    // console.log(req.body[0].eventName);

    const {id} = req.params; // pass the event object ID
    try {
        const updatedEvent = await Event.updateOne({_id: id}, {$set: {
        eventName: eventName,
        location: location,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        eventCoordinatorName: eventCoordinatorName,
        eventCoordinatorID: eventCoordinatorID,
        stalls: stalls,
        published: published
        }
        });// We can add a third argument for options if we want.
        console.log("event updated");
        res.status(200).json(updatedEvent);
    } catch(error){
        console.error("updateEvent error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
// export const updateEvent = async (req, res) => {
    
// };

//Create stall, needs name, description, and the ID of the event that it is tied to
export const createStall = async (req, res) => {
    
    const{name, email, eventID} = req.body; // get the required stall information
    try {

        const newStall = new stall ({ // Create the newStall 
            name: name,
            email: email,
            eventID: eventID
        });
        const savedStall = await newStall.save(); // save to database
        const updatedEvent = await Event.updateOne({ _id: eventID },
            { $addToSet: { stalls: savedStall._id }}
        );
        res.status(201).json(savedStall); // pass back the new mongoose object in the data
        }
    catch (error) {
        console.log("Error in create stall controller", error.message);
        res.status(500).json({message: "Internal server error."});
    }
};



//Delete stall. Needs the stall object ID
export const deleteStall = async (req, res) => {
    // console.log("in deleteStall")
    try {
        //console.log("DELETE /stall/:id", { params: req.params, req.body }); // debug

        const { stallId } = req.params; 
        const targetStall = await stall.findByIdAndDelete(stallId);
        if (!targetStall) {
            return res.status(404).json({
                success: false,
                message: "Stall not found.",
            });
        }

        //delete stall from parent Event.stalls
        await Event.findByIdAndUpdate(targetStall.eventID,
            { $pull: { stalls: stallId } },
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            message: "Stall deleted successfully.",
        });
    }catch(error){
        console.error("Error deleting stall:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateStall = async (req,res) => {
    const {description, vendor, stallType, tagList} = req.body;
    const {stallId} = req.params;
    try {
        const updatedStall = await stall.updateOne(
            {_id: stallId},
            {$set: {
                description: description,
                vendor: vendor,
                onboardingStatus: "vendorRegistered",
                stallType: stallType,
                tagList: tagList,
                //menu: menu
            }}
        );
        console.log("Stall updated");
        res.status(200).json(updatedStall)
    }catch (error) {
        console.error("updateStall error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//get stalls
export const getMyStalls = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId).populate({
            path: "stalls",
            options: { sort: { createdAt: 1 } }, 
        });

        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        res.status(200).json(event.stalls || []);
    } catch (error) {
        console.error("getMyStalls error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getStall = async (req, res) => {
    console.log("in getStall")
        try {
        const {stallId} = req.params 
        const currentStall = await stall.findById(stallId);
        res.status(200).json(currentStall);
    } catch (error) {
        console.error("getStall error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//Create itinerary takes name, location, startTime, and eventID
export const createItineraryItem = async (req,res) => {
      const{name, location, startTime, eventID} = req.body; // get the required itinerary
    try {

        const newItinerary = new eventItinerary ({ // Create the new itinerary with the filled fields
            name: name,
            location: location,
            startTime: startTime,
            eventID: eventID
        });
        const savedItinerary = await newItinerary.save(); // save to database
        res.status(201).json(savedItinerary); // pass back the new mongoose object in the data
        }
    catch (error) {
        console.log("Error in create itinerary controller", error.message);
        res.status(500).json({message: "Internal server error."});
    }
};

//Deletes itinerary item using parameter id
export const deleteItineraryItem = async (req,res) => {
    try {
        // console.log("DELETE /itinerary/:id", { params: req.params, req.body }); // debug
        // NOTE: 
        // when finishing the implementation of this make sure to delete anywhere
        // eventItenerary is nested(other Event,User, etc)
        const { id } = req.params; 
        const itinerary = await eventItinerary.findByIdAndDelete(id);
        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Event itinerary item not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Event itinerary deleted successfull.",
        });
    }catch(error){
        console.error("Error deleting event itinerary:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyItineraryItems = async (req,res) => {
    try {
        const eventId = req.event._id; 
        const itineraries = await eventItinerary
        .find({ eventID: eventId })
        .sort({ createdAt: -1 }); // newest first
        res.status(200).json(itineraries);
    } catch (error) {
        console.error("getMyItineraryItems error:", error);
        res.status(500).json({ message: "Internal server error." });
  }
};

//EVENTMAP CONTROLLERS ARE UNTESTED!
//Create a map object that saves center coordinates, zoom level, event ID, and an array of markers. See eventMap model to see fields of marker, all are optional with a default of null. 
export const createEventMap = async (req,res) => {
      const{mapCenter, eventID, zoomLevel, mapMarkers} = req.body[0]; // get the required itinerary
    try {
        //Markers should be optional for making a new map object, since they may want to save just where the event will be
        if (!Array.isArray(mapMarkers) || !mapMarkers.length){
            // res.sendStatus(401);
            // res.json({message: 'There are no markers to save'});
            console.log("No marker array to save.");
        }
        const newMap = new eventMap ({ // Create the new itinerary with the filled fields
            mapCenter: mapCenter,
            eventID: eventID,
            zoomLevel: zoomLevel,
            mapMarkers: mapMarkers //Should be fine here for array object as long as the fields all match
        });
        const savedMap = await newMap.save(); // save to database
        res.status(201).json(savedMap); // pass back the new mongoose object in the data
        }
    catch (error) {
        console.log("Error in create map controller", error.message);
        res.status(500).json({message: "Internal server error."});
    }
};

// Get a map that matches eventID
export const getMyEventMap = async (req,res) => {
  try {
    const eventId = req.params.id; 
    const myMap = await eventMap
      .find({ eventID: eventId })
      .sort({ createdAt: -1 }); // Should only be one, but newest first 
    res.status(200).json(myMap);
  } catch (error) {
    console.error("getMyEventMap error:", error);
    res.status(500).json({ message: "Internal server error." });
  }

};

//Delete map object
export const deleteEventMap = async (req,res) => {
    try {
        //console.log("DELETE /events/:id", { params: req.params, req.body }); // debug
        const { id } = req.params; 
        console.log(id);
        const map = await eventMap.deleteOne({eventID: id}); // Delete by event ID
        if (!map) {
        return res.status(404).json({
            success: false,
            message: "Event not found.",
        });
        }
        return res.status(200).json({
        success: true,
        message: "Event deleted successfully.",
        });
    }catch(error){
        console.error("Error deleting event map:", error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

//Update an existing map object
export const updateEventMap = async (req, res) => {
    // console.log("We are trying to update the event!");
    const{ mapCenter, eventID, zoomLevel, mapMarkers, imperial } = req.body[0]; // Needed to have the [0] because the payload is arriving as an array with one item (THIS WAS TRUE FOR EVENTS, MAY NOT BE TRUE FOR EVENT MAP SINCE IT'S ONLY ONE!!! CHECK HERE FOR ERROR)
    // console.log(req.body[0].eventName);
    const { mapId } = req.params; // pass the event object ID
    try {
        const updatedMap = await eventMap.updateOne({_id: mapId}, {$set: {
        mapCenter: mapCenter,
        eventID: eventID,
        zoomLevel: zoomLevel,
        mapMarkers: mapMarkers,
        imperial: imperial,
        }
        });// We can add a third argument for options if we want.
        console.log("event map updated");
        res.status(200).json(updatedMap);
    } catch(error){
        console.error("updateEventMap error:", error);
        res.status(500).json({ message: "Internal server error." });
    }

};
