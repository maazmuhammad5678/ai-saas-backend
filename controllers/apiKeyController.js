const crypto = require("crypto");
const APIKey = require("../models/APIKey");
const AIRequest = require("../models/AIRequest");

// GENERATE API KEY
async function generateAPIKey(req, res) {
    try {
        const existingKey = await APIKey.findOne({
            user: req.user.id,
            isActive: true
        });

        if (existingKey) {
            return res.status(400).json({
                message: "API key already exists. Regenerate it instead."
            });
        }

        const rawKey = "sk_ai_" + crypto.randomBytes(32).toString("hex");

        const keyHash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex");

        const apiKey = await APIKey.create({
            user: req.user.id,
            keyHash,
            keyPrefix: rawKey.substring(0, 10)
        });

        return res.status(201).json({
            message: "API key generated successfully",
            apiKey: {
                id: apiKey._id,
                key: rawKey,
                prefix: apiKey.keyPrefix
            },
            warning: "Save this key now. It cannot be viewed again."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// REGENERATE API KEY
async function regenerateAPIKey(req, res) {
    try {
        const rawKey = "sk_ai_" + crypto.randomBytes(32).toString("hex");

        const keyHash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex");

        let apiKey = await APIKey.findOne({
            user: req.user.id,
            isActive: true
        });

        if (!apiKey) {
            apiKey = await APIKey.create({
                user: req.user.id,
                keyHash,
                keyPrefix: rawKey.substring(0, 10)
            });
        } else {
            apiKey.keyHash = keyHash;
            apiKey.keyPrefix = rawKey.substring(0, 10);
            apiKey.lastUsedAt = null;

            await apiKey.save();
        }

        return res.status(200).json({
            message: "API key regenerated successfully",
            apiKey: {
                id: apiKey._id,
                key: rawKey
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// DELETE API KEY
async function deleteAPIKey(req, res) {
    try {
        const apiKey = await APIKey.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                isActive: false
            },
            {
                new: true
            }
        );

        if (!apiKey) {
            return res.status(404).json({
                message: "API key not found"
            });
        }

        return res.status(200).json({
            message: "API key deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// GET API KEYS
async function getAPIKeys(req, res) {
    try {
        const keys = await APIKey.find({
            user: req.user.id
        }).select("-keyHash");

        return res.status(200).json({
            count: keys.length,
            keys
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// API USAGE
async function getAPIUsage(req, res) {
    try {
        const usage = await AIRequest.aggregate([
            {
                $match: {
                    user: req.user.id,
                    apiKeyUsed: { $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    totalTokens: { $sum: "$tokensUsed" }
                }
            }
        ]);

        return res.status(200).json({
            apiUsage: usage[0] || {
                totalRequests: 0,
                totalTokens: 0
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    generateAPIKey,
    regenerateAPIKey,
    deleteAPIKey,
    getAPIKeys,
    getAPIUsage
};