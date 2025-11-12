const OpenAI = require("openai");
const Task = require("../models/taskModel");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Predict priority based on task title/description ---
exports.suggestPriority = async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `
    Based on the following task details, suggest a priority:
    Title: "${title}"
    Description: "${description}"
    Choose only one: Low, Medium, or High.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiReply = response.choices[0].message.content.trim();
    res.json({ suggestedPriority: aiReply });
  } catch (err) {
    console.error("AI Priority Suggestion Error:", err.message);
    res.status(500).json({ message: "Failed to suggest priority" });
  }
};

// --- Suggest new due date if overdue or blocked ---
exports.suggestDeadline = async (req, res) => {
  try {
    const { dueDate, status, dependencies } = req.body;
    const overdue = new Date(dueDate) < new Date();

    const prompt = `
    A task has status "${status}" and its due date was ${dueDate}.
    Dependencies: ${dependencies?.join(", ") || "None"}.
    Should the deadline be extended? Suggest a new realistic due date (in ISO format).
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion = response.choices[0].message.content.trim();
    res.json({ suggestedDeadline: suggestion });
  } catch (err) {
    console.error("AI Deadline Suggestion Error:", err.message);
    res.status(500).json({ message: "Failed to suggest deadline" });
  }
};
