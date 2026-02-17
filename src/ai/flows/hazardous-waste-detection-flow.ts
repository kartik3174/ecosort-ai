'use server';
/**
 * @fileOverview A Genkit flow for detecting hazardous waste in an image.
 *
 * - detectHazardousWaste - A function that detects hazardous materials in a photo.
 * - DetectHazardousWasteInput - The input type for the detectHazardousWaste function.
 * - DetectHazardousWasteOutput - The return type for the detectHazardousWaste function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectHazardousWasteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of litter, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('Optional description of the litter.'),
});
export type DetectHazardousWasteInput = z.infer<typeof DetectHazardousWasteInputSchema>;

const DetectHazardousWasteOutputSchema = z.object({
  isHazardous: z.boolean().describe('Whether hazardous waste is detected in the image.'),
  hazardousMaterials: z
    .array(z.string())
    .optional()
    .describe('A list of specific hazardous materials identified, if any.'),
  reasoning: z
    .string()
    .describe('Explanation for the hazardous waste detection or lack thereof.'),
});
export type DetectHazardousWasteOutput = z.infer<typeof DetectHazardousWasteOutputSchema>;

export async function detectHazardousWaste(
  input: DetectHazardousWasteInput
): Promise<DetectHazardousWasteOutput> {
  return hazardousWasteDetectionFlow(input);
}

const hazardousWasteDetectionPrompt = ai.definePrompt({
  name: 'hazardousWasteDetectionPrompt',
  input: { schema: DetectHazardousWasteInputSchema },
  output: { schema: DetectHazardousWasteOutputSchema },
  model: 'googleai/gemini-2.5-flash-image',
  prompt: `You are an expert in hazardous waste identification. Your task is to analyze the provided image and determine if it contains any hazardous materials.

Carefully examine the image and the optional description.
Identify any objects that could be considered hazardous waste (e.g., batteries, sharp objects, chemicals, medical waste, broken glass, flammable liquids, electronic waste).

Based on your analysis, provide a JSON object structured as follows:
{
  "isHazardous": boolean, // true if hazardous waste is detected, false otherwise
  "hazardousMaterials": string[], // an array of identified hazardous materials (e.g., ["battery", "broken glass"]), omit if none
  "reasoning": string // a detailed explanation for your determination, including specific observations
}

Image: {{media url=photoDataUri}}
{{#if description}}
Description: {{{description}}}
{{/if}}`,
});

const hazardousWasteDetectionFlow = ai.defineFlow(
  {
    name: 'hazardousWasteDetectionFlow',
    inputSchema: DetectHazardousWasteInputSchema,
    outputSchema: DetectHazardousWasteOutputSchema,
  },
  async (input) => {
    const { output } = await hazardousWasteDetectionPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from hazardous waste detection prompt.');
    }
    return output;
  }
);
