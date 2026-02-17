'use server';
/**
 * @fileOverview A Genkit flow for analyzing waste from an image.
 *
 * - analyzeWaste - A function that analyzes waste from a photo.
 * - WasteAnalysisInput - The input type for the analyzeWaste function.
 * - WasteAnalysisOutput - The return type for the analyzeWaste function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WasteAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of litter, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type WasteAnalysisInput = z.infer<typeof WasteAnalysisInputSchema>;

const WasteAnalysisOutputSchema = z.object({
  wasteType: z.string().describe('The primary type of waste identified in the image (e.g., "Plastic Bottles", "Food Scraps", "Electronic Waste", "Mixed General Waste").'),
  description: z.string().describe('A detailed description of the litter and its context in the image. This should be suitable for a report and be written in a neutral, objective tone.'),
  isHazardous: z.boolean().describe('Whether hazardous waste is detected in the image.'),
  hazardousMaterials: z.array(z.string()).optional().describe('A list of specific hazardous materials identified, if any.'),
  recyclingInstructions: z.string().optional().describe('Brief instructions on how to properly dispose of or recycle the waste, if applicable.'),
});
export type WasteAnalysisOutput = z.infer<typeof WasteAnalysisOutputSchema>;


export async function analyzeWaste(
  input: WasteAnalysisInput
): Promise<WasteAnalysisOutput> {
  return wasteAnalysisFlow(input);
}

const wasteAnalysisPrompt = ai.definePrompt({
  name: 'wasteAnalysisPrompt',
  input: { schema: WasteAnalysisInputSchema },
  output: { schema: WasteAnalysisOutputSchema },
  model: 'googleai/gemini-2.5-flash-image',
  prompt: `You are an expert waste management and recycling analyst. Your task is to analyze the provided image of litter and provide a detailed analysis.

Based on the image, identify the type of waste, describe the scene for a report, determine if it contains hazardous materials, and provide brief disposal or recycling advice.

Structure your response as a JSON object matching this schema:
{
  "wasteType": string, // e.g., "Plastic Bottles", "Food Scraps", "Electronic Waste", "Mixed General Waste"
  "description": string, // A detailed, objective description of the litter seen in the image for a report.
  "isHazardous": boolean, // true if hazardous waste is detected, false otherwise.
  "hazardousMaterials": string[], // List of hazardous materials, if any.
  "recyclingInstructions": string // Brief, actionable advice on how to recycle or dispose of this waste.
}

Image: {{media url=photoDataUri}}
`,
});

const wasteAnalysisFlow = ai.defineFlow(
  {
    name: 'wasteAnalysisFlow',
    inputSchema: WasteAnalysisInputSchema,
    outputSchema: WasteAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await wasteAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from waste analysis prompt.');
    }
    return output;
  }
);
