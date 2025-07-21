import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: true,
        unique: true,
    },
    routeName: {
        type: String,
        required: true,
    },
    startLocation: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    estimatedTime: {
        type: Number,
        required: true,
    },
    stops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusStop',
        required: true,
    }],
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
    }, {
    timestamps: true,
})

const BusRoute = mongoose.model("BusRoute", busRouteSchema);
export default BusRoute;