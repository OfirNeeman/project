import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, StyleRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getStyleRecommendations = async (profile: UserProfile, budget: number, clothingType: string): Promise<StyleRecommendation> => {
  const prompt = `
    Act as a world-class AI fashion stylist. Based on the user's profile, generate personalized style recommendations.
    The user wants recommendations for a "${clothingType}" with a maximum budget of $${budget}.

    User Profile:
    - Aesthetic: ${profile.aesthetic}
    - Body Shape: ${profile.bodyShape}
    - Hair Color: ${profile.hairColor}
    - Skin Tone: ${profile.skinTone}
    - Eye Color: ${profile.eyeColor}

    Your response must be a JSON object that strictly follows the provided schema.
    
    Tasks:
    1.  **Color Palette:** Based on the user's features (hair, skin, eyes), recommend a harmonious color palette with a name (e.g., 'Warm Autumn'), a description, and an array of 5-7 hex codes.
    2.  **Style Advice:** Provide a paragraph of actionable style advice tailored to the user's body shape and aesthetic.
    3.  **Recommended Items:** Suggest 3 distinct, fictional clothing items of the type "${clothingType}" that fit the user's profile and are under the $${budget} budget. For each item, provide a name, category, price, a compelling description, and a realistic image URL from 'https://picsum.photos/seed/{some_unique_seed}/400/600'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorPalette: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
              },
            },
            styleAdvice: { type: Type.STRING },
            recommendedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as StyleRecommendation;

  } catch (error) {
    console.error("Error fetching style recommendations:", error);
    // Re-throw the original error so the component can handle it specifically
    throw error;
  }
};