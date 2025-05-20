import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MessageType } from "../context/MessageContext.tsx";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getReply = async (message: MessageType) => {
  const { text, image } = message;
  try {
    const parts = [];

    if (text) {
      parts.push({ text });
    }

    if (image) {
      const mimeType = image.startsWith("data:image/png")
        ? "image/png"
        : "image/jpeg";

      parts.push({ inlineData: { mimeType, data: image.split(",")[1] } });
    }

    const response = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    if (!response) throw new Error("No response from Gemini.");

    const result = response.response.text();

    return result;
  } catch (error) {
    throw new Error("Failed to fetch response from Gemini API:" + error);
  }
};
