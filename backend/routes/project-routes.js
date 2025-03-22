import express from "express";
import {
  generateSchema,
  saveSchema,
  getSchema,
  initialQuestion,
} from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const messages = req.body.messages || [
      { role: "user", content: initialQuestion },
    ];
    const aiResponse = await generateSchema(messages);

    if (aiResponse.question) {
      // If the response contains a question, send it back to the frontend
      return res.status(200).json({ question: aiResponse.question });
    } else if (aiResponse.schema) {
      // If the response contains a schema, save it and return the projectId
      const projectId = Math.random().toString(36).substring(2, 15);
      const savedSchema = await saveSchema(
        projectId,
        aiResponse.schema,
        messages
      );
      return res.status(201).json({ projectId: savedSchema.projectId });
    } else if (aiResponse.error) {
      return res.status(500).json({ error: aiResponse.error });
    } else {
      return res.status(500).json({ error: "Unexpected AI response" });
    }
  } catch (error) {
    console.error("Error generating and saving schema:", error);
    res.status(500).json({ error: "Failed to generate and save schema" });
  }
});

router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const schema = await getSchema(projectId);

    if (!schema) {
      return res.status(404).json({ message: "Schema not found" });
    }

    res.status(200).json(schema);
  } catch (error) {
    console.error("Error retrieving schema:", error);
    res.status(500).json({ error: "Failed to retrieve schema" });
  }
});

export default router;
