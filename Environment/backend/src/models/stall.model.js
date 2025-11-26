import mongoose, { Schema } from "mongoose";
//const menuItemSchema = require('./menuItem.model.js')

const stallSchema = new mongoose.Schema(
    {
        name: {
            type: String, // name of the stall
            required: true,
            default: ""
            // set by coordinator or vendor
        },
        email: {
            type: String, //Which vendor owns the stall?
            required: true, // will be required for production
            default: ""
        },
        description: {
            type: String,
            //required: true,
            default: ""
            // set by vendor
        },
        vendor: {
            type: String, //Which vendor owns the stall?
            default: ""
            // set by vendor
        },
        onboardingStatus: {
            type: String,
            enum: ["noInvite", "inviteSent", "vendorRegistered"],
            default: "noInvite",
            // inviteSent triggered by coordinator 
            // vendorRegistered triggered by vendor
        },
        stallNumber: {
            type: Number,//int,
            default: 0
            // set by coordinator in map mode 
        },
        stallType: {
            type: String,
            enum: ["food","nonFood"],
            default: "food"
            // set by Vendor
        },
        // menu: {
        //     //type: [menuItemSchema], //menu items will have an allergen field that can be added
        //     type: [Schema.Types.ObjectId], 
        //     ref: "MenuItem",
        //     default: null
        // },
        tagList:{ //things like dairy-free, vegan, etc
            type: [String],
            default: []
        },
        eventID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
    },
    { timestamps: true }
);

const stall = mongoose.model("stall", stallSchema);

export default stall;