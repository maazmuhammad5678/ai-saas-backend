const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    aiRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AIRequest",
        required: true
    }
}, {
    timestamps: true
});

favoriteSchema.index(
    { user: 1, aiRequest: 1 },
    { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);