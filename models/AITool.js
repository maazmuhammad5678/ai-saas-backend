const mongoose = require("mongoose");

const aiToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    toolKey: {
        type: String,
        required: true,
        unique: true
    },

    requiredPlan: {
        type: String,
        enum: ["Free", "Starter", "Pro", "Enterprise"],
        default: "Free"
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("AITool", aiToolSchema);