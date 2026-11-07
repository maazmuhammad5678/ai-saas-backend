const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["Free", "Starter", "Pro", "Enterprise"]
    },

    monthlyPrice: {
        type: Number,
        required: true,
        min: 0
    },

    dailyRequestLimit: {
        type: Number,
        default: 20
    },

    availableModels: [{
        type: String
    }],

    availableTools: [{
        type: String
    }],

    fileUploadLimit: {
        type: Number,
        default: 1
    },

    features: [{
        type: String
    }],

    teamAccess: {
        type: Boolean,
        default: false
    },

    priorityProcessing: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Plan", planSchema);