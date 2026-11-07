const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

// GET CURRENT SUBSCRIPTION
async function getCurrentSubscription(req, res) {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription) {
            return res.status(404).json({
                message: "No active subscription found"
            });
        }

        return res.status(200).json(subscription);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// SUBSCRIBE / UPGRADE / DOWNGRADE
async function changeSubscription(req, res) {
    try {
        const { planId } = req.body;

        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        let currentSubscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (currentSubscription &&
            currentSubscription.plan._id.toString() === planId) {
            return res.status(400).json({
                message: "You already have this plan"
            });
        }

        if (currentSubscription) {
            currentSubscription.status = "cancelled";
            currentSubscription.cancelledAt = new Date();
            await currentSubscription.save();
        }

        const newSubscription = await Subscription.create({
            user: req.user.id,
            plan: plan._id,
            status: "active",
            startDate: new Date(),
            endDate: plan.name === "Free"
                ? null
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        await newSubscription.populate("plan");

        return res.status(201).json({
            message: "Subscription changed successfully",
            subscription: newSubscription
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// CANCEL SUBSCRIPTION
async function cancelSubscription(req, res) {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription) {
            return res.status(404).json({
                message: "No active subscription found"
            });
        }

        if (subscription.plan.name === "Free") {
            return res.status(400).json({
                message: "Free plan cannot be cancelled"
            });
        }

        subscription.status = "cancelled";
        subscription.cancelledAt = new Date();

        await subscription.save();

        // Return user to Free plan
        const freePlan = await Plan.findOne({
            name: "Free"
        });

        if (freePlan) {
            await Subscription.create({
                user: req.user.id,
                plan: freePlan._id,
                status: "active"
            });
        }

        return res.status(200).json({
            message: "Subscription cancelled successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getCurrentSubscription,
    changeSubscription,
    cancelSubscription
};