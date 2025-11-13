// import { HfInference } from "@huggingface/inference";

// const SYSTEM_PROMPT = `
//   You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients.
//   You don't need to use every ingredient they mention in your recipe.
//   The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients.
//   Format your response in markdown to make it easier to render to a web page.
// `;

// // const SYSTEM_PROMPT = `
// //   You are an assistant that receives a list of ingredients a user has and suggests a recipe they could make with some or all of those ingredients.
// //   You don't need to use every ingredient mentioned.
// //   The recipe can include additional ingredients not mentioned, but try to keep them minimal.
// //   For each recipe, do the following:

// //   1. Give the recipe a **creative and descriptive title**.  
// //   2. List all the ingredients used in the recipe.  
// //   3. Provide step-by-step instructions.  

// //   Format your response in **Markdown**, like this:

// //   # Recipe Name
// //   **Ingredients:**  
// //   - ingredient 1  
// //   - ingredient 2  

// //   **Instructions:**  
// //   1. Step one  
// //   2. Step two  

// //   Make it easy to read and suitable for displaying on a web page.
// // `;

// // Models
// // mistralai/Mixtral-8x7B-Instruct-v0.1
// // HuggingFaceH4/zephyr-7b-beta

// const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);

// export async function getRecipeFromMistral(ingredientsArr) {
//     const ingredientsString = ingredientsArr.join(", ");
//     try {
//         const response = await hf.chatCompletion({
//             model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // public chat Mistral variant
//             messages:  [
//               { role: "system", content: SYSTEM_PROMPT },
//               { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
//             ],
//             max_tokens: 512,
//             temperature: 0.7,
//             top_p: 0.9,
//         });

//         let recipe = response?.choices?.[0]?.message?.content || "No recipe generated.";
//         recipe = recipe.replace(/\[\/ASS\]/gi, "").trim();
//         return recipe;
//     }catch(error) {
//         console.error("Error fetching recipe:", error);
//         return "Oops! Something went wrong while fetching your recipe.";
//     }
// }
import { HfInference } from "@huggingface/inference";

// The SYSTEM_PROMPT guides the AI on its role and desired output format.
const SYSTEM_PROMPT = `
  You are an assistant that receives a list of ingredients a user has and suggests a recipe they could make with some or all of those ingredients.
  
  **Rules for generating the recipe:**
  1. You do not need to use every ingredient mentioned by the user.
  2. The recipe can include additional ingredients not mentioned, but try to keep them minimal (e.g., salt, pepper, common oils).
  3. Give the recipe a **creative and descriptive title**.
  4. List all the ingredients used in the recipe.
  5. Provide clear, step-by-step instructions.

  **Format your entire response strictly in Markdown**, like this:

  # Recipe Name
  
  **Ingredients:**
  - ingredient 1
  - ingredient 2
  - ...

  **Instructions:**
  1. Step one
  2. Step two
  3. ...

  Make the final output easy to read and suitable for displaying on a web page.
`;

// Initialize the Hugging Face Inference Client
// It uses the environment variable VITE_HF_API_KEY for authentication.
const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);

// The core function to fetch a recipe from the AI model
export async function getRecipeFromMistral(ingredientsArr) {
    if (!ingredientsArr || ingredientsArr.length === 0) {
        return "Please provide a list of ingredients to get a recipe!";
    }

    const ingredientsString = ingredientsArr.join(", ");

    try {
        const response = await hf.chatCompletion({
            // Model: Switched to a smaller, more reliably hosted model
            // This avoids the 'No Inference Provider available' error.
            model: "HuggingFaceH4/zephyr-7b-beta",
            
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            
            // Parameters for controlling the AI's response:
            max_tokens: 512, // Maximum length of the generated recipe
            temperature: 0.7, // Creativity level (0.0 is deterministic, 1.0 is highly creative)
            top_p: 0.9,
        });

        // Extract the generated content and clean up any stray tokens
        let recipe = response?.choices?.[0]?.message?.content || "No recipe generated. The AI may have been unable to process the request.";
        recipe = recipe.replace(/\[\/ASS\]/gi, "").trim();
        return recipe;
    } catch(error) {
        console.error("Error fetching recipe:", error);
        
        // This is where the error from the serverless provider was caught:
        if (error.message.includes("No Inference Provider available")) {
             return "Recipe service temporarily unavailable. Please try again in a few moments or ensure your API key is valid.";
        }
        
        return "Oops! An unknown error occurred while fetching your recipe.";
    }
}