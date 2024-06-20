import { pipeline } from "@xenova/transformers";

async function main() {
    // Load the model and tokenizer
    const model = await pipeline('text-generation', {
        model: "transformerjs_model",
        tokenizer: "transformerjs_model"
    });

    // Test evaluation
    const testInputs = [
        "Explain the iBrain Data using the following informations.",
        "What are the advanced capabilities of iBrain Data?",
        "How does iBrain Data support real-time decision making?"
    ];

    for (const input of testInputs) {
        console.log(`Input: ${input}`);
        const result = await model(input);
        console.log("Output:", result);
        console.log("---------------");
    }
}

main();
