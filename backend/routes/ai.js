const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Service = require("../models/Service");

// Initialize Gemini API
// Using a mock fallback if no API key is set so the app doesn't crash on boot
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    // 1. Fetch all available services from the database to give Gemini context
    const dbServices = await Service.find({}, "name category subCategory basePrice description");
    const servicesContext = dbServices.map(s => 
      `- [${s.name}] Category: ${s.category}, Price: ₹${s.basePrice}, Description: ${s.description}`
    ).join("\n");

    const systemPrompt = `You are "ServiceHub AI Assistant", a smart and friendly customer agent for ServiceHub (India's premium home services marketplace).
Your job is to answer queries and dynamically recommend services from the available database services list below.

Available Services:
${servicesContext}

Guidelines:
1. Be polite, concise, and professional.
2. If a customer mentions a problem (e.g., "my room is hot", "leak in bathroom", "need haircut"), recommend the most relevant service from the list above. Mention the price.
3. Recommend ONLY services that exist in the list. Do not make up services.
4. Format recommended services clearly with their name and price so the user knows exactly what to look for.
5. If no service matches their need, politely offer general assistance and suggest they explore the service catalog.`;

    if (!genAI) {
      // Elegant fallback answer if the API key isn't configured yet
      console.log("[AI Mock] Gemini API key not set. Returning template response.");
      let mockReply = "Hello! I am your ServiceHub AI assistant. Currently, my API key is not configured, but I can see services like 'Full Home Deep Cleaning' (₹1499) and 'AC Power Jet Wash' (₹499) in the catalog. How can I help you today?";
      if (message.toLowerCase().includes("hot") || message.toLowerCase().includes("ac")) {
        mockReply = "It sounds like your AC needs servicing! I recommend our 'AC Foam & Power Jet Wash Service' (₹499) for fast cooling, or 'AC Gas Refill & Repair' (₹1199). You can book them directly from our Services tab!";
      } else if (message.toLowerCase().includes("clean")) {
        mockReply = "I recommend our popular 'Full Home Deep Cleaning' service (₹1499). It includes kitchen degreasing, bathroom stain removal, floor scrubbing, and balcony wash. You can add it to your cart!";
      }
      return res.json({ success: true, reply: mockReply });
    }

    // 2. Query Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format conversation history for Gemini
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.map(h => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const replyText = response.text();

    res.json({ success: true, reply: replyText });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ success: false, message: "Error communicating with AI Assistant." });
  }
});

module.exports = router;
