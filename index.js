
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectMongoDB = require("./config/connectDB");

const seedPlans = require("./config/seedPlans");
const seedTools = require("./config/seedTools");
const createAdmin = require("./config/createAdmin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Initialize database and seed data once per server instance
let initializationPromise;

async function initializeApp() {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            if (!process.env.MONGO_URI) {
                throw new Error("MONGO_URI is missing");
            }

            await connectMongoDB(process.env.MONGO_URI);

            await seedPlans();
            await seedTools();
            await createAdmin();
        })().catch((error) => {
            initializationPromise = null;
            throw error;
        });
    }

    return initializationPromise;
}

// Ensure database is ready before handling API requests
app.use(async (req, res, next) => {
    try {
        await initializeApp();
        next();
    } catch (error) {
        console.error("Initialization failed:", error.message);

        res.status(500).json({
            message: "Server initialization failed"
        });
    }
});

// Routes
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Home
app.get("/", (req, res) => {
    res.status(200).json({
        message: "AI SaaS Backend API is running",
        version: "1.0.0"
    });
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/keys", apiKeyRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        message: "Internal server error"
    });
});

// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export Express app for Vercel
module.exports = app;
