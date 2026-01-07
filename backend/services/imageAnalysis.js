import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeUserImage(base64Data, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this full-body photo for a fashion app. 
    Return a JSON object with the following fields:
    - bodyShape (string: 'lean', 'curvy', 'athletic', 'broad')
    - hairColor (string)
    - skinTone (string)
    - eyeColor (string)
    - heightCategory (string: 'short', 'average', 'tall')
    - dominantOutfitColor (string)
    
    Return ONLY the JSON.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType } }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // ניקוי התשובה מסימני Markdown אם קיימים
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}