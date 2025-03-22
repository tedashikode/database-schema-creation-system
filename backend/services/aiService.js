import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

const initialQuestion =
  "What kind of database schema are you trying to design?";

export async function generateSchema(userInput) {
  try {
    const prompt = `You are an expert database designer. The user's goal is to create a database schema for their application. Your task is to ask insightful questions to uncover the user's database requirements without them needing to specify every detail. 

    At the end of the interaction, the user simply wants to describe their app idea, and you will provide a complete database schema that fits their use case. 
    
    Start with broad questions about the app's purpose and gradually narrow down to specifics. Always ask one question at a time to keep the conversation focused.
    
    The user messages are as follows: ${JSON.stringify(userInput)}
    
    IMPORTANT: Your response must be ONLY valid JSON with no additional text. Ensure the JSON is well-formed and adheres to the expected structure. Respond with either:
    1. A new question to ask the user, formatted as: {"question": "Your question here"}
    2. A complete database schema in JSON format, formatted as: {"schema": { ...your schema here... }}
    
    The schema should include tables with fields and define relationships between them if applicable.`;

    // Call the HF API correctly with the inputs field
    const message = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        return_full_text: false,
        temperature: 0.1, // Add low temperature for more consistent outputs
      },
    });

    const generatedText = message.generated_text.trim();
    console.log("Raw API response:", generatedText);

    // Try to extract JSON from the response
    try {
      // Find the first { and last } to extract potential JSON
      const firstBrace = generatedText.indexOf("{");
      const lastBrace = generatedText.lastIndexOf("}");

      if (firstBrace >= 0 && lastBrace > firstBrace) {
        const jsonText = generatedText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonText);
      } else {
        // If we can't find JSON markers, return a fallback
        return {
          question:
            "Could you provide more details about your database requirements?",
          error: "Could not extract JSON from response",
        };
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", generatedText);
      // Return a formatted question as fallback
      return {
        question:
          "I'm having trouble understanding. Could you describe what tables and fields you need?",
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("Error generating schema with Huggingface:", error);
    // Don't throw the error, handle it gracefully
    return {
      question:
        "I encountered an issue. Could you try again with more details about your database needs?",
      error: error.message,
    };
  }
}

export async function saveSchema(projectId, schemaData, userInput) {
  try {
    const newSchema = new Schema({
      projectId: projectId,
      schemaData: schemaData,
      userInput: userInput,
    });

    await newSchema.save();
    return newSchema;
  } catch (error) {
    console.error("Error saving schema to MongoDB:", error);
    throw error;
  }
}

export async function getSchema(projectId) {
  try {
    const schema = await Schema.findOne({ projectId });
    return schema;
  } catch (error) {
    console.error("Error retrieving schema from MongoDB:", error);
    throw error;
  }
}

export { initialQuestion };
