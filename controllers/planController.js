const Plan = require("../models/Plan");

// GET ALL PLANS
async function getPlans(req, res) {
    try {
        const plans = await Plan.find();

        return res.status(200).json({
            count: plans.length,
            plans
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// GET SINGLE PLAN
async function getPlanById(req, res) {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        return res.status(200).json(plan);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// CREATE PLAN
async function createPlan(req, res) {
    try {
        const plan = await Plan.create(req.body);

        return res.status(201).json({
            message: "Plan created successfully",
            plan
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// UPDATE PLAN
async function updatePlan(req, res) {
    try {
        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            message: "Plan updated successfully",
            plan
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// DELETE PLAN
async function deletePlan(req, res) {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        if (plan.name === "Free") {
            return res.status(400).json({
                message: "Free plan cannot be deleted"
            });
        }

        const Subscription = require("../models/Subscription");

        const used = await Subscription.exists({
            plan: plan._id,
            status: "active"
        });

        if (used) {
            return res.status(400).json({
                message: "Cannot delete a plan with active subscriptions"
            });
        }

        await plan.deleteOne();

        return res.status(200).json({
            message: "Plan deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
};