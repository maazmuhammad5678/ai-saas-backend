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

// Start server after database connection
async function startServer() {
    try {
        await connectMongoDB(process.env.MONGO_URI);

        await seedPlans();
        await seedTools();
        await createAdmin();

        const PORT = process.env.PORT || 8000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();