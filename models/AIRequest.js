const mongoose = require("mongoose");

const aiRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    prompt: {
        type: String,
        required: true
    },

    response: {
        type: String,
        required: true
    },

    toolUsed: {
        type: String,
        required: true
    },

    modelUsed: {
        type: String
    },

    tokensUsed: {
        type: Number,
        default: 0
    },

    apiKeyUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "APIKey",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("AIRequest", aiRequestSchema);