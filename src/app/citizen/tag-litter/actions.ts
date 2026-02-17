"use server";

import {
  analyzeWaste,
  type WasteAnalysisInput,
  type WasteAnalysisOutput,
} from "@/ai/flows/hazardous-waste-detection-flow";

export async function analyzeLitterImage(
  input: WasteAnalysisInput
): Promise<WasteAnalysisOutput> {
  try {
    const result = await analyzeWaste(input);
    return result;
  } catch (error) {
    console.error("Error in waste analysis flow:", error);
    return {
      wasteType: "Analysis Failed",
      description:
        "AI analysis could not be completed. Please manually enter the details for the report.",
      isHazardous: false,
      recyclingInstructions:
        "Could not determine waste type.",
      hazardousMaterials: [],
      cleanupGuidelines: "Could not generate cleanup guidelines as the analysis failed.",
    };
  }
}
