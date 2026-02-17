import {genkit} from 'genkit';

let ai: any = null;
let initialized = false;

export async function getAi() {
  if (initialized) {
    return ai;
  }

  initialized = true;

  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      console.warn('[Genkit] No API key found. AI features will be unavailable.');
      return null;
    }

    // Lazy import the Google AI plugin only when needed
    const { googleAI } = await import('@genkit-ai/google-genai');
    
    ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.5-flash',
    });
  } catch (error) {
    console.warn('[Genkit] Failed to initialize Genkit:', error instanceof Error ? error.message : String(error));
    return null;
  }

  return ai;
}
