const AIRequest = require("../models/AIRequest");
const Favorite = require("../models/Favorite");

const generateAIResponse = require("../services/aiService");
const getUsage = require("../services/usageService");

// GENERATE AI RESPONSE
async function generateResponse(req, res) {
    try {
        const { prompt, tool, model } = req.body;

        if (!prompt || !tool) {
            return res.status(400).json({
                message: "Prompt and tool are required"
            });
        }

        if (typeof prompt !== "string" || prompt.trim().length > 10000) {
            return res.status(400).json({
                message: "Prompt must be a string of at most 10000 characters"
            });
        }

        if (
            model &&
            !req.plan.availableModels.includes(model)
        ) {
            return res.status(403).json({
                message: "Your plan does not support this AI model"
            });
        }

        const response = generateAIResponse(
            tool,
            prompt.trim()
        );

        const tokensUsed = Math.ceil(
            (prompt.length + response.length) / 4
        );

       const aiRequest = await AIRequest.create({
    user: req.user.id,
    prompt,
    response,
    toolUsed: tool,
    modelUsed: model,
    tokensUsed,
    apiKeyUsed: req.apiKey ? req.apiKey._id : null
});

        const usage = await getUsage(req.user.id);

        return res.status(200).json({
            message: "AI response generated successfully",
            request: aiRequest,
            usage: {
                dailyUsage: usage.dailyUsage,
                monthlyUsage: usage.monthlyUsage,
                dailyLimit: req.plan.dailyRequestLimit,
                remainingRequests:
                    req.plan.dailyRequestLimit === -1
                        ? "Unlimited plan allowance"
                        : Math.max(
                            0,
                            req.plan.dailyRequestLimit - usage.dailyUsage
                        )
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// GET PROMPT HISTORY
async function getHistory(req, res) {
    try {
        const history = await AIRequest.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: history.length,
            history
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// DELETE HISTORY ITEM
async function deleteHistory(req, res) {
    try {
        const request = await AIRequest.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!request) {
            return res.status(404).json({
                message: "History item not found"
            });
        }

        await Favorite.deleteMany({
            user: req.user.id,
            aiRequest: request._id
        });

        return res.status(200).json({
            message: "History deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// DELETE ALL HISTORY
async function clearHistory(req, res) {
    try {
        const requests = await AIRequest.find({
            user: req.user.id
        }).select("_id");

        const ids = requests.map(item => item._id);

        await Favorite.deleteMany({
            user: req.user.id,
            aiRequest: { $in: ids }
        });

        await AIRequest.deleteMany({
            user: req.user.id
        });

        return res.status(200).json({
            message: "All history deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// ADD FAVORITE
async function addFavorite(req, res) {
    try {
        const request = await AIRequest.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!request) {
            return res.status(404).json({
                message: "AI request not found"
            });
        }

        const favorite = await Favorite.create({
            user: req.user.id,
            aiRequest: request._id
        });

        return res.status(201).json({
            message: "Added to favorites",
            favorite
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Already added to favorites"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
}

// GET FAVORITES
async function getFavorites(req, res) {
    try {
        const favorites = await Favorite.find({
            user: req.user.id
        }).populate("aiRequest");

        return res.status(200).json({
            count: favorites.length,
            favorites
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// REMOVE FAVORITE
async function removeFavorite(req, res) {
    try {
        const favorite = await Favorite.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!favorite) {
            return res.status(404).json({
                message: "Favorite not found"
            });
        }

        return res.status(200).json({
            message: "Favorite removed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// USAGE STATISTICS
async function getUsageStatistics(req, res) {
    try {
        const usage = await getUsage(req.user.id);

        const plan = req.plan;

        return res.status(200).json({
            dailyUsage: usage.dailyUsage,
            monthlyUsage: usage.monthlyUsage,
            dailyLimit: plan.dailyRequestLimit,
            remainingRequests:
                plan.dailyRequestLimit === -1
                    ? "Unlimited plan allowance"
                    : Math.max(
                        0,
                        plan.dailyRequestLimit - usage.dailyUsage
                    )
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    generateResponse,
    getHistory,
    deleteHistory,
    clearHistory,
    addFavorite,
    getFavorites,
    removeFavorite,
    getUsageStatistics
};