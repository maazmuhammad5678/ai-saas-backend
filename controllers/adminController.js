const User = require("../models/User");
const Plan = require("../models/Plan");
const AITool = require("../models/AITool");
const AIRequest = require("../models/AIRequest");
const Subscription = require("../models/Subscription");
const APIKey = require("../models/APIKey");

// GET ALL USERS
async function getAllUsers(req, res) {
    try {
        const users = await User.find()
            .select("-password");

        return res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// BLOCK USER
async function blockUser(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin accounts cannot be blocked here"
            });
        }

        user.isBlocked = true;

        await user.save();

        return res.status(200).json({
            message: "User blocked successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// UNBLOCK USER
async function unblockUser(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isBlocked = false;

        await user.save();

        return res.status(200).json({
            message: "User unblocked successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// DELETE USER
async function deleteUser(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin cannot be deleted through this endpoint"
            });
        }

        await Promise.all([
            AIRequest.deleteMany({ user: user._id }),
            APIKey.deleteMany({ user: user._id }),
            Subscription.deleteMany({ user: user._id }),
            require("../models/Favorite").deleteMany({ user: user._id }),
            user.deleteOne()
        ]);

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// GET ALL AI TOOLS
async function getAllTools(req, res) {
    try {
        const tools = await AITool.find();

        return res.status(200).json({
            count: tools.length,
            tools
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// ADD AI TOOL
async function addTool(req, res) {
    try {
        const tool = await AITool.create(req.body);

        return res.status(201).json({
            message: "AI tool added successfully",
            tool
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// UPDATE AI TOOL
async function updateTool(req, res) {
    try {
        const tool = await AITool.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!tool) {
            return res.status(404).json({
                message: "AI tool not found"
            });
        }

        return res.status(200).json({
            message: "AI tool updated successfully",
            tool
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// DELETE AI TOOL
async function deleteTool(req, res) {
    try {
        const tool = await AITool.findByIdAndDelete(req.params.id);

        if (!tool) {
            return res.status(404).json({
                message: "AI tool not found"
            });
        }

        return res.status(200).json({
            message: "AI tool deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// AI USAGE ANALYTICS
async function getAnalytics(req, res) {
    try {
        const totalUsers = await User.countDocuments();

        const totalRequests = await AIRequest.countDocuments();

        const totalSubscriptions = await Subscription.countDocuments({
            status: "active"
        });

        const totalAPIKeys = await APIKey.countDocuments({
            isActive: true
        });

        const totalTokens = await AIRequest.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$tokensUsed" }
                }
            }
        ]);

        const toolUsage = await AIRequest.aggregate([
            {
                $group: {
                    _id: "$toolUsed",
                    totalRequests: { $sum: 1 },
                    totalTokens: { $sum: "$tokensUsed" }
                }
            },
            {
                $sort: {
                    totalRequests: -1
                }
            }
        ]);

        return res.status(200).json({
            totalUsers,
            totalRequests,
            totalSubscriptions,
            totalAPIKeys,
            totalTokens: totalTokens[0]?.total || 0,
            toolUsage
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// VIEW ALL SUBSCRIPTIONS
async function getAllSubscriptions(req, res) {
    try {
        const subscriptions = await Subscription.find()
            .populate("user", "name email")
            .populate("plan");

        return res.status(200).json({
            count: subscriptions.length,
            subscriptions
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllTools,
    addTool,
    updateTool,
    deleteTool,
    getAnalytics,
    getAllSubscriptions
};