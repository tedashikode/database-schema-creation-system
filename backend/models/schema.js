import mongoose from "mongoose";

const schemaSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  schemaData: { type: Object, required: true },
  userInput: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Schema = mongoose.model("Schema", schemaSchema);

export default Schema;
