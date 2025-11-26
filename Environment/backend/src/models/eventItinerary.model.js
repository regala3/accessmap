import mongoose, { Schema } from "mongoose";

const eventItinerarySchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true,
            default: ""
        },
        location: {
            type: String, 
            required: true,
            default: ""  
        }, 
        startTime: {
            type: String, 
            required: true,
            default: "" 
        },
        endTime: {
            type: String,
            default: ""
        },
        description: {
            type: String, //lookup value in itinerary table that has the itinerary data
            default: "",
        },
        eventID: { // The ID of the event tied to this itinerary object
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
);

const eventItinerary = mongoose.model("eventItinerary", eventItinerarySchema);

export default eventItinerary;