const Plan = require("../models/Plan");

async function seedPlans() {
    const plans = [
        {
            name: "Free",
            monthlyPrice: 0,
            dailyRequestLimit: 20,
            availableModels: ["GPT-3.5"],
            availableTools: [
                "chat",
                "summarizer"
            ],
            fileUploadLimit: 1,
            features: [
                "20 requests per day",
                "Basic AI chat",
                "Text summarization"
            ]
        },
        {
            name: "Starter",
            monthlyPrice: 999,
            dailyRequestLimit: 200,
            availableModels: [
                "GPT-3.5",
                "GPT-4"
            ],
            availableTools: [
                "chat",
                "summarizer",
                "email-writer",
                "code-generator"
            ],
            fileUploadLimit: 5,
            features: [
                "200 requests per day",
                "GPT-4 access",
                "Code generation",
                "Email writing"
            ]
        },
        {
            name: "Pro",
            monthlyPrice: 2499,
            dailyRequestLimit: -1,
            availableModels: [
                "GPT-3.5",
                "GPT-4",
                "Image Generation"
            ],
            availableTools: [
                "chat",
                "summarizer",
                "email-writer",
                "code-generator",
                "image-prompt-generator"
            ],
            fileUploadLimit: 20,
            features: [
                "Unlimited plan allowance",
                "All AI tools",
                "Image generation access"
            ]
        },
        {
            name: "Enterprise",
            monthlyPrice: 9999,
            dailyRequestLimit: -1,
            availableModels: [
                "GPT-3.5",
                "GPT-4",
                "Image Generation"
            ],
            availableTools: [
                "chat",
                "summarizer",
                "email-writer",
                "code-generator",
                "image-prompt-generator"
            ],
            fileUploadLimit: 100,
            features: [
                "Unlimited plan allowance",
                "Team access",
                "Priority processing",
                "All AI tools"
            ],
            teamAccess: true,
            priorityProcessing: true
        }
    ];

    for (const plan of plans) {
        await Plan.findOneAndUpdate(
            { name: plan.name },
            plan,
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );
    }

    console.log("Default plans seeded successfully");
}

module.exports = seedPlans;