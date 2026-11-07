function generateAIResponse(tool, prompt) {
    let response;

    switch (tool) {

        case "chat":
            response = `AI Chat Response: Thank you for your question. You asked: ${prompt}. Here is a helpful explanation based on your prompt.`;
            break;

        case "code-generator":
            response = `Code Generator: Here is a basic example related to your request: ${prompt}`;
            break;

        case "summarizer":
            response = `Summary: This text discusses the following topic: ${prompt}. The main idea is to present the important information in a shorter form.`;
            break;

        case "email-writer":
            response = `Subject: Regarding Your Request\n\nDear Sir/Madam,\n\n${prompt}\n\nBest Regards`;
            break;

        case "image-prompt-generator":
            response = `Image Prompt: Create a high-quality, detailed visual based on this description: ${prompt}. Use professional lighting, balanced composition and realistic details.`;
            break;

        default:
            response = "AI response generated successfully.";
    }

    return response;
}

module.exports = generateAIResponse;