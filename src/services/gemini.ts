import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface PRDData {
  title: string;
  problemStatement: string;
  objectives: string[];
  features: { name: string; description: string }[];
  userPersonas: { name: string; role: string; needs: string }[];
  useCases: { scenario: string; flow: string }[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  futureScope?: string[];
}

export async function generatePRD(
  productIdea: string,
  targetAudience: string,
  keyFeatures: string
): Promise<PRDData> {
  const prompt = `
    Generate a comprehensive Product Requirement Document (PRD) for the following:
    Product Idea: ${productIdea}
    Target Audience: ${targetAudience}
    Key Features: ${keyFeatures}

    IMPORTANT: For the "userPersonas" section, please use common Indian names (e.g., Aarav, Priya, Rohan, Ananya).

    The output MUST be a valid JSON object.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          problemStatement: { type: Type.STRING },
          objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          },
          userPersonas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                needs: { type: Type.STRING }
              },
              required: ["name", "role", "needs"]
            }
          },
          useCases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                flow: { type: Type.STRING }
              },
              required: ["scenario", "flow"]
            }
          },
          functionalRequirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          nonFunctionalRequirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          futureScope: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: [
          "title",
          "problemStatement",
          "objectives",
          "features",
          "userPersonas",
          "useCases",
          "functionalRequirements",
          "nonFunctionalRequirements",
          "futureScope"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as PRDData;
}
