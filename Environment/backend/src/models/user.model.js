import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String, 
            required: true,
            unique: true
        },
        fullname: {
            type: String, 
            required: true
        }, 
        password: {
            type: String, 
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default:""
        },
        role: {
            type: String,
            enum: ["Coordinator","Vendor"],
            required: true,
            default:"Coordinator"
        },
        /*
            Need to make a coordinatorStalls and coordinatorEvents array
            This would make it easier to access from the frontend.
            Will need to rewrite frontend getters.
            OTHER LOCATIONS: auth.controller.js::login 
        coordinatorStalls: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "stall",
            index: true,
        }],
        coordinatorEvents:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "event",
            index: true,
        }],
        vendorStalls:[{ //<--- replaces line 46
        */
        // for vendor role only
        stalls: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "stall",
            index: true,
        }],
        vendorEvents:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "event",
            index: true,
        }],

    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;