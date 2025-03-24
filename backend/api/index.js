import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "../routes/project-routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", projectRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
