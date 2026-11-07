const crypto = require("crypto");
const APIKey = require("../models/APIKey");
const User = require("../models/User");

async function checkAPIKey(req, res, next) {
    try {
        const rawKey = req.headers["x-api-key"];

        if (!rawKey) {
            return res.status(401).json({
                message: "API key required"
            });
        }

        const keyHash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex");

        const apiKey = await APIKey.findOne({
            keyHash,
            isActive: true
        });

        if (!apiKey) {
            return res.status(401).json({
                message: "Invalid API key"
            });
        }

        const user = await User.findById(apiKey.user);

        if (!user || user.isBlocked) {
            return res.status(403).json({
                message: "Account blocked or unavailable"
            });
        }

        apiKey.lastUsedAt = new Date();
        await apiKey.save();

        req.user = {
            id: user._id,
            role: user.role
        };

        req.apiKey = apiKey;

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = checkAPIKey;