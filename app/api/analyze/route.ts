import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextResponse } from "next/server";

// Pull API key strictly from environment variables (.env.local locally or Vercel settings)
const API_KEY = process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// JSON Schema definition for Gemini structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    urgencyScore: { 
      type: Type.NUMBER, 
      description: "Urgency/Risk score from 0 (harmless) to 100 (critical crisis)." 
    },
    riskCategory: { 
      type: Type.STRING, 
      enum: ["SECURITY_BREACH", "SERVICE_OUTAGE", "PR_RISK", "GENERAL_FEEDBACK"],
      description: "Category of the customer message."
    },
    suggestedAction: { 
      type: Type.STRING, 
      description: "Actionable 1-2 sentence resolution plan for the agent." 
    },
  },
  required: ["urgencyScore", "riskCategory", "suggestedAction"],
};

export async function POST(request: Request) {
  try {
    const { content, author, platform } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let urgencyScore = 50;
    let riskCategory = "GENERAL_FEEDBACK";
    let suggestedAction = "Review post details and respond appropriately.";

    try {
      const prompt = `Analyze this customer social media post for business risk and urgency:
      Content: "${content}"
      Platform: "${platform}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2,
        },
      });

      const aiData = JSON.parse(response.text || "{}");
      urgencyScore = aiData.urgencyScore ?? urgencyScore;
      riskCategory = aiData.riskCategory ?? riskCategory;
      suggestedAction = aiData.suggestedAction ?? suggestedAction;

    } catch (apiError) {
      console.warn("Gemini API fallback activated:", apiError);

      // Local Rule-Engine Fallback
      const lower = content.toLowerCase();
      if (lower.includes("hack") || lower.includes("stolen") || lower.includes("password") || lower.includes("unauthorized")) {
        urgencyScore = 95;
        riskCategory = "SECURITY_BREACH";
        suggestedAction = "Immediately freeze account credentials and escalate to Cyber Security response team.";
      } else if (lower.includes("down") || lower.includes("error") || lower.includes("500") || lower.includes("broken") || lower.includes("outage")) {
        urgencyScore = 85;
        riskCategory = "SERVICE_OUTAGE";
        suggestedAction = "Alert DevOps on-call engineers and prepare incident status banner.";
      } else if (lower.includes("sue") || lower.includes("lawyer") || lower.includes("scam") || lower.includes("terrible")) {
        urgencyScore = 75;
        riskCategory = "PR_RISK";
        suggestedAction = "Flag for Senior Communications Lead and draft formal corporate response.";
      } else {
        urgencyScore = 20;
        riskCategory = "GENERAL_FEEDBACK";
        suggestedAction = "Acknowledge message with standard customer support response.";
      }
    }

    const analyzedPost = {
      id: Date.now().toString(),
      author: author || "@anonymous_user",
      platform: platform || "Twitter",
      content,
      urgencyScore,
      riskCategory,
      suggestedAction,
      status: "PENDING_REVIEW",
    };

    return NextResponse.json(analyzedPost);

  } catch (error) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}