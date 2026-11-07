const mongoose = require("mongoose");

async function connectMongoDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;