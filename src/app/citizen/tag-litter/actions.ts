"use server";

import {
  detectHazardousWaste,
  type DetectHazardousWasteInput,
  type DetectHazardousWasteOutput,
} from "@/ai/flows/hazardous-waste-detection-flow";

export async function checkForHazards(
  input: DetectHazardousWasteInput
): Promise<DetectHazardousWasteOutput> {
  try {
    const result = await detectHazardousWaste(input);
    return result;
  } catch (error) {
    console.error("Error in hazardous waste detection flow:", error);
    return {
      isHazardous: false,
      reasoning:
        "AI analysis could not be completed. Please manually tag if you believe this is hazardous.",
      hazardousMaterials: [],
    };
  }
}
