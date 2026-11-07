const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    keyHash: {
        type: String,
        required: true,
        unique: true
    },

    keyPrefix: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastUsedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("APIKey", apiKeySchema);