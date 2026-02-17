import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let ai: any = null;

try {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.warn('[Genkit] No API key found. AI features will be unavailable.');
  } else {
    ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.5-flash',
    });
  }
} catch (error) {
  console.warn('[Genkit] Failed to initialize Genkit:', error instanceof Error ? error.message : String(error));
}

export { ai };
