const Subscription = require("../models/Subscription");
const AIRequest = require("../models/AIRequest");
const AITool = require("../models/AITool");

async function checkSubscription(req, res, next) {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription || !subscription.plan) {
            return res.status(403).json({
                message: "Active subscription required"
            });
        }

        const plan = subscription.plan;

        if (
            subscription.endDate &&
            subscription.endDate <= new Date()
        ) {
            return res.status(403).json({
                message: "Subscription expired"
            });
        }

        const toolKey = req.body.tool;

        const tool = await AITool.findOne({
            toolKey,
            isActive: true
        });

        if (!tool) {
            return res.status(404).json({
                message: "AI tool not found or inactive"
            });
        }

        if (!plan.availableTools.includes(toolKey)) {
            return res.status(403).json({
                message: "Your plan does not support this AI tool"
            });
        }

        const now = new Date();

        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const dailyUsage = await AIRequest.countDocuments({
            user: req.user.id,
            createdAt: {
                $gte: startOfDay
            }
        });

        const limit = plan.dailyRequestLimit;

        if (limit !== -1 && dailyUsage >= limit) {
            return res.status(429).json({
                message: "Daily AI request limit reached",
                dailyLimit: limit,
                dailyUsage
            });
        }

        req.subscription = subscription;
        req.plan = plan;
        req.aiTool = tool;

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = checkSubscription;