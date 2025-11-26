import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {createEvent, getMyEvents, getEventById, deleteEvent, updateEvent, createStall, deleteStall, updateStall ,getMyStalls, 
    createItineraryItem, deleteItineraryItem, getMyItineraryItems, createEventMap, deleteEventMap, getMyEventMap, updateEventMap, getStall, } from "../controllers/event.controller.js";

const router = express.Router();

// event
router.post("/", protectRoute, createEvent); // create a route for the event controller createEvent, it will make a new database item and then send you to the page

router.get("/", protectRoute, getMyEvents); // gets events of current coordinator

router.get("/:eventId", protectRoute, getEventById)// gets event by mongoose object id

router.get("/:eventId/public", getEventById)// gets event by mongoose object id

router.delete("/:id", protectRoute, deleteEvent); // deletes selected event

router.put("/:id", protectRoute, updateEvent);

// stall
router.post("/:id/stalls", protectRoute, createStall); //Creates a stall object for the database

router.delete("/:eventId/stalls/:stallId", protectRoute, deleteStall);// Deletes stalls by stallID

router.get("/:id/stalls", protectRoute, getMyStalls); //Get the stalls that match the eventID

router.get("/stalls/:stallId", getStall); // Gets the requested stall

router.put("/stalls/update/:stallId", protectRoute, updateStall) // Updates Stall

// itinerary
router.post("/", protectRoute, createItineraryItem); //Creates a stall object for the database THESE ROUTE LINKS WILL HAVE TO CHANGE

router.delete("/:id", protectRoute, deleteItineraryItem); // Deletes stalls by stallID

router.get("/:id", protectRoute, getMyItineraryItems); //Get the stalls that match the eventID

//eventMap
router.post("/:id/site-plan", protectRoute, createEventMap); //Create an event map

router.delete("/:id/site-plan/", protectRoute, deleteEventMap); //Delete an event map

router.get("/:id/site-plan", protectRoute, getMyEventMap); //Get event maps

router.get("/:id/site-plan/public", getMyEventMap); //Get event maps

router.put("/:id/site-plan/:mapId", protectRoute, updateEventMap); //Update an event map





export default router;