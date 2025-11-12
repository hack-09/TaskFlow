import axios from "axios";
import { getCache, setCache } from "../middleware/cache.js";

const HF_API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";
const HF_API_KEY = process.env.HF_TOKEN;

export async function getSmartPriority(req, res) {
  try {
    const userId = req.user?.id || "guest";
    const { taskTitle, description, deadline } = req.body;

    const cacheKey = `priority-${taskTitle}-${description}-${deadline}`;
    const cached = getCache(userId, cacheKey);
    if (cached) return res.json({ success: true, source: "cache", data: cached });

    const prompt = `
    Analyze the following task and suggest its priority as Low, Medium, or High.
    Task: ${taskTitle}
    Description: ${description}
    Due Date: ${deadline || "No due date"}
    Respond only with one word: Low, Medium, or High.
    `;

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const prediction = response.data?.[0]?.generated_text?.trim() || "Medium";

    setCache(userId, cacheKey, prediction);
    res.json({ success: true, source: "api", data: prediction });
  } catch (error) {
    console.error("AI Priority Suggestion Error:", error.message);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
}

export async function suggestDeadline(req, res) {
  try {
    const userId = req.user?.id || "guest";
    const { dueDate, status, dependencies } = req.body;

    const cacheKey = `deadline-${dueDate}-${status}-${dependencies?.join(",")}`;
    const cached = getCache(userId, cacheKey);
    if (cached) return res.json({ success: true, source: "cache", data: cached });

    const prompt = `
    A task has status "${status}" and its due date was ${dueDate}.
    Dependencies: ${dependencies?.join(", ") || "None"}.
    Should the deadline be extended? Suggest a new realistic due date (in ISO format).
    `;

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const suggestion = response.data?.[0]?.generated_text?.trim() || "2025-12-31";

    setCache(userId, cacheKey, suggestion);
    res.json({ success: true, source: "api", data: suggestion });
  } catch (err) {
    console.error("AI Deadline Suggestion Error:", err.message);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
}
