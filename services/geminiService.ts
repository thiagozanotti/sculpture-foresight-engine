import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Signal, SignalCategory, WatchtowerReport } from "../types";
import { WEIGHTS } from "../constants";

const getAiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Schema for structured JSON generation
const signalSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        source: { type: Type.STRING },
        published: { type: Type.STRING },
        category: { 
            type: Type.STRING, 
            enum: Object.values(SignalCategory) 
        },
        summary: { type: Type.STRING },
    },
    required: ["title", "source", "published", "category", "summary"]
};

const reportSchema: Schema = {
    type: Type.ARRAY,
    items: signalSchema
};

export const generateForesightReport = async (): Promise<WatchtowerReport> => {
    const ai = getAiClient();
    
    // Get current date to ground the model in the present (2025)
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // We simulate the Python script's RSS aggregation by asking Gemini to act as the aggregator
    // and retrieve/hallucinate plausible recent trends based on its training data up to the present.
    const prompt = `
    Act as the "Sculpture Foresight Engine". 
    Today is ${today}.
    
    Generate a list of 8-12 plausible, realistic, and highly specific news signals regarding:
    - Contemporary Sculpture
    - 3D Fabrication & CNC
    - Novel Material Science (Alloys, Biopolymers)
    - AI Tools for Spatial Design
    - Major Museum Acquisitions
    
    The content should feel like it was scraped from ArtForum, Dezeen, ArchDaily, and ScienceDaily within the last 48 hours relative to ${today}.
    ENSURE all dates in the 'published' field are from the current year (2025).
    Be specific about artist names, locations, and chemical compositions if applicable.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
                systemInstruction: "You are a specialized trend-watch engine for the art and engineering world. Output strictly valid JSON."
            }
        });

        const rawSignals: any[] = JSON.parse(response.text || "[]");

        // Post-process to calculate scores based on the Python logic
        const signals: Signal[] = rawSignals.map(s => {
            const weight = WEIGHTS[s.category as SignalCategory] || 1.5;
            return {
                ...s,
                link: "#", // Placeholder as we are generating simulations
                weight: weight,
                score: weight * (0.8 + Math.random() * 0.4) // Add slight variance to simulation
            };
        });

        // Calculate Pressure Index
        const totalScore = signals.reduce((acc, curr) => acc + curr.score, 0);
        // Normalize roughly assuming 10 items avg weight 2.0 = 20. Max roughly 30.
        const pressure_index = Math.min(totalScore / 25.0, 1.0);

        return {
            timestamp: new Date().toISOString(),
            pressure_index,
            signals
        };

    } catch (error) {
        console.error("Error generating foresight report:", error);
        throw error;
    }
};

export const queryOracle = async (query: string, contextSignals: Signal[]): Promise<string> => {
    const ai = getAiClient();
    
    const contextString = contextSignals.map(s => `- [${s.category}] ${s.title}: ${s.summary}`).join("\n");

    const prompt = `
    Context (Current Signals):
    ${contextString}

    User Query: "${query}"

    Answer the user's query acting as the "Sculpture Foresight Oracle". 
    Synthesize the provided context signals and your broader knowledge of art history and material science.
    Keep the tone analytical, slightly avant-garde, and professional.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "The Oracle is silent.";
    } catch (error) {
        console.error("Oracle error:", error);
        return "Disruption in the foresight field. Try again.";
    }
};