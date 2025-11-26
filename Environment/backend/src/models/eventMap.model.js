import mongoose, { Schema } from "mongoose";

//This will likely hold the things needed to generate a geoJSON?
//Will need: Markers with type, coordinates, descriptons? zoom level, and starting center coordinate for display
const eventMapSchema = new mongoose.Schema(
    {
        mapCenter: //For centering the map based on where they search
            {
                x: {
                    type: mongoose.Types.Decimal128, //Long
                    default:null
                },
                y: {
                    type: mongoose.Types.Decimal128, //Lat
                    default: null
                }
            },
        // eventArea: {
        //     type: [Number/*float*/],
        //     default: null
        // },
        eventID: {
            type: mongoose.Schema.Types.ObjectId, //For matching map to the right event for display
            required: true
        },
        zoomLevel: {
            type: Number, // This is the zoom level of the map
            default: 19
        },
        mapMarkers: {
            type: Array,
            default: []
        },
        imperial: {
            type: Boolean,
            default: true
        }
        
        /* [ //Array of markers that have an x, y, stallID (optional), and string objectType for displaying the right of objectType
                    {
                        markerCoordinatesx: { //Already an array so I wanted to keep this simple vs how center was done, separate x and y
                            type: mongoose.Types.Decimal128, //x is long
                            default: null
                        },
                        markerCoordinatesy: { //y is lat
                            type: mongoose.Types.Decimal128,
                            default:null
                        },
                        markerWidth: { //For saving the size of the marker
                            type: Number,
                            default: null
                        },
                        markerLength: {
                            type: Number,
                            default: null
                        },
                        markerOrientation: {
                            type: Number, //For now can hold a number type for degrees 0-360, if this needs to be float for radians this can be changed
                            default: null
                        },
                        stallID: {
                            type: mongoose.Schema.Types.ObjectId, //If not a stall, just pass null. If a stall, can be used to find stall information like name, description, etc for display
                            default:null
                        },
                        objectType: { //For labelling type for display i.e. stall, bathroom, etc
                            type: String,
                            default: null
                        },
                        savedTags: [
                                { tag: { //Array of tags which are strings
                                    type: String,
                                    default: null
                                    }
                                }
                        ]
                    }
                ] */
    },
    { timestamps: true }
);

const eventMap = mongoose.model("eventMap", eventMapSchema);

export default eventMap;