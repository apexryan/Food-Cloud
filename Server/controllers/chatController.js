const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/chat");

const getGenAI = () => {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API key in env (GEMINI_API_KEY)");
  }
  return new GoogleGenerativeAI(apiKey);
};

exports.sendMessage = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ message: "prompt is required" });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Load or create chat session
    let chatDoc = null;
    if (sessionId) {
      chatDoc = await Chat.findOne({ sessionId });
    }
    if (!chatDoc) {
      chatDoc = await Chat.create({
        sessionId,
        user: req.user?.id || req.user?.userId,
        messages: [],
      });
    }

    // Compose history for model
    const history = (chatDoc.messages || []).map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Persist messages
    chatDoc.messages.push({ role: "user", content: prompt });
    chatDoc.messages.push({ role: "model", content: text });
    await chatDoc.save();

    return res.json({
      reply: text,
      sessionId: chatDoc.sessionId,
      messages: chatDoc.messages,
    });
  } catch (err) {
    console.error("Chat sendMessage error:", err);
    return res
      .status(500)
      .json({ message: "Failed to get response", error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId)
      return res.status(400).json({ message: "sessionId is required" });
    const chatDoc = await Chat.findOne({ sessionId });
    if (!chatDoc) return res.json({ messages: [] });
    return res.json({ messages: chatDoc.messages });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load history", error: err.message });
  }
};
