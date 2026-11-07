const express = require("express");

const router = express.Router();

const {
    generateResponse,
    getHistory,
    deleteHistory,
    clearHistory,
    addFavorite,
    getFavorites,
    removeFavorite,
    getUsageStatistics
} = require("../controllers/aiController");

const checkAPIKey = require("../middlewares/apiKeyMiddleware");


const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

const checkSubscription = require("../middlewares/subscriptionMiddleware");

router.use(checkAuthentication);

// Generate AI response
router.post("/generate", checkSubscription, generateResponse);

// API key based AI generation
router.post(
    "/api-generate",
    checkAPIKey,
    checkSubscription,
    generateResponse
);
// History
router.get("/history", getHistory);

router.delete("/history", clearHistory);

router.delete("/history/:id", deleteHistory);

// Favorites
router.post("/favorites/:id", addFavorite);

router.get("/favorites", getFavorites);

router.delete("/favorites/:id", removeFavorite);

// Usage
router.get("/usage", async (req, res, next) => {
    try {
        const Subscription = require("../models/Subscription");

        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription || !subscription.plan) {
            return res.status(403).json({
                message: "Active subscription required"
            });
        }

        if (
            subscription.endDate &&
            subscription.endDate <= new Date()
        ) {
            return res.status(403).json({
                message: "Subscription expired"
            });
        }

        req.plan = subscription.plan;
        next();

    } catch (error) {
        next(error);
    }
}, getUsageStatistics);

router.get("/usage", async (req, res, next) => {
    try {
        const Subscription = require("../models/Subscription");

        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription || !subscription.plan) {
            return res.status(403).json({
                message: "Active subscription required"
            });
        }

        if (
            subscription.endDate &&
            subscription.endDate <= new Date()
        ) {
            return res.status(403).json({
                message: "Subscription expired"
            });
        }

        req.plan = subscription.plan;
        next();

    } catch (error) {
        next(error);
    }
}, getUsageStatistics);

module.exports = router;