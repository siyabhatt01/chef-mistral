import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
    You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
    You don't need to use every ingredient they mention in your recipe. 
    The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 
    Format your response in markdown to make it easier to render to a web page.
`;

// Initialize the Hugging Face Inference client
// For Vite projects, ensure your env variable is: VITE_HF_API_KEY
const hf = new HfInference(import.meta.env.VITE_HF_API_KEY)

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    console.log(import.meta.env.VITE_HF_API_KEY)
    console.log(hf)
    try {
        const response = await hf.chatCompletion({
        model: "meta-llama/Llama-3-8b-instruct",
        messages: [
            { role: "system", content: SYSTEM_PROMPT.trim() },
            {
            role: "user",
            content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
            },
        ],
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
        });

        // Return the model's message
        return response.choices?.[0]?.message?.content ?? "No response generated.";
    } catch (error) {
        console.error("Error fetching recipe from model:", error);
        return "Oops! Something went wrong while fetching your recipe.";
    }
}
