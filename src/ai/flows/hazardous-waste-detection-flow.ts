'use server';
/**
 * @fileOverview Direct Gemini API calls for analyzing waste from an image.
 *
 * - analyzeWaste - A function that analyzes waste from a photo.
 * - WasteAnalysisInput - The input type for the analyzeWaste function.
 * - WasteAnalysisOutput - The return type for the analyzeWaste function.
 */

export interface WasteAnalysisInput {
  photoDataUri: string;
}

export interface WasteAnalysisOutput {
  wasteType: string;
  description: string;
  isHazardous: boolean;
  hazardousMaterials?: string[];
  recyclingInstructions?: string;
  cleanupGuidelines: string[];
}

export async function analyzeWaste(
  input: WasteAnalysisInput
): Promise<WasteAnalysisOutput> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Genkit AI is not initialized. Please ensure GEMINI_API_KEY or GOOGLE_API_KEY environment variable is set.');
  }

  // Extract the base64 data from the data URI
  const match = input.photoDataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid image data URI format');
  }

  const [, mimeType, base64Data] = match;

  const prompt = `You are an expert waste management and recycling analyst. Your task is to analyze the provided image of litter and provide a detailed analysis.

Based on the image, identify the type of waste, describe the scene for a report, determine if it contains hazardous materials, provide brief disposal or recycling advice, and generate step-by-step cleanup guidelines.

Structure your response as a JSON object matching this schema:
{
  "wasteType": string, // e.g., "Plastic Bottles", "Food Scraps", "Electronic Waste", "Mixed General Waste"
  "description": string, // A detailed, objective description of the litter seen in the image for a report.
  "isHazardous": boolean, // true if hazardous waste is detected, false otherwise.
  "hazardousMaterials": string[], // List of hazardous materials, if any.
  "recyclingInstructions": string, // Brief, actionable advice on how to recycle or dispose of this waste.
  "cleanupGuidelines": string[] // An array of strings, with each string being a step-by-step guideline on how to safely clean the area.
}`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Check if the status indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from API response');
    }

    const result = JSON.parse(jsonMatch[0]) as WasteAnalysisOutput;
    return result;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
