const AIRequest = require("../models/AIRequest");

async function getUsage(userId) {
    const now = new Date();

    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const dailyUsage = await AIRequest.countDocuments({
        user: userId,
        createdAt: { $gte: startOfDay }
    });

    const monthlyUsage = await AIRequest.countDocuments({
        user: userId,
        createdAt: { $gte: startOfMonth }
    });

    return {
        dailyUsage,
        monthlyUsage
    };
}

module.exports = getUsage;