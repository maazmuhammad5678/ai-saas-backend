const AITool = require("../models/AITool");

async function seedTools() {
    const tools = [
        {
            name: "AI Chat",
            toolKey: "chat",
            description: "Chat with AI",
            requiredPlan: "Free"
        },
        {
            name: "AI Code Generator",
            toolKey: "code-generator",
            description: "Generate programming code",
            requiredPlan: "Starter"
        },
        {
            name: "AI Text Summarizer",
            toolKey: "summarizer",
            description: "Summarize long text",
            requiredPlan: "Free"
        },
        {
            name: "AI Email Writer",
            toolKey: "email-writer",
            description: "Write professional emails",
            requiredPlan: "Starter"
        },
        {
            name: "AI Image Prompt Generator",
            toolKey: "image-prompt-generator",
            description: "Generate image prompts",
            requiredPlan: "Pro"
        }
    ];

    for (const tool of tools) {
        await AITool.findOneAndUpdate(
            { toolKey: tool.toolKey },
            tool,
            {
                upsert: true,
                new: true
            }
        );
    }

    console.log("AI tools seeded successfully");
}

module.exports = seedTools;