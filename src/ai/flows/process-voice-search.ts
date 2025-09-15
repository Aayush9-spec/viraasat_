'use server';
/**
 * @fileOverview An AI agent that processes a voice search query to find products.
 *
 * - processVoiceSearch - Transcribes audio and extracts structured search criteria.
 * - ProcessVoiceSearchInput - The input type for the function.
 * - ProcessVoiceSearchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceSearchInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice recording of the search query, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type ProcessVoiceSearchInput = z.infer<typeof ProcessVoiceSearchInputSchema>;

const ProcessVoiceSearchOutputSchema = z.object({
  transcribedText: z.string().describe('The transcribed text from the audio query.'),
  searchQuery: z.string().optional().describe("A refined, simple text query for keyword search (e.g., 'blue pottery')."),
  filters: z.object({
    category: z.string().optional().describe("The product category if mentioned (e.g., 'Pottery', 'Jewelry', 'Textiles', 'Painting')."),
    color: z.string().optional().describe("The color if mentioned (e.g., 'blue', 'red', 'green')."),
    style: z.string().optional().describe("The style or attribute if mentioned (e.g., 'minimalist', 'rustic')."),
  }).describe('Structured filters extracted from the query.'),
});
export type ProcessVoiceSearchOutput = z.infer<typeof ProcessVoiceSearchOutputSchema>;

export async function processVoiceSearch(
  input: ProcessVoiceSearchInput
): Promise<ProcessVoiceSearchOutput> {
  return processVoiceSearchFlow(input);
}

const transcriptionPrompt = ai.definePrompt({
    name: 'transcriptionForSearchPrompt',
    input: { schema: ProcessVoiceSearchInputSchema },
    prompt: `Transcribe the following audio recording to text. The user might be speaking in English, Hindi, or a mix of both (Hinglish). Prioritize accurate transcription of the mixed-language query.

Audio: {{{audioDataUri}}}`,
});

const queryExtractionPrompt = ai.definePrompt({
  name: 'queryExtractionPrompt',
  input: {schema: z.object({ transcription: z.string() })},
  output: {schema: ProcessVoiceSearchOutputSchema.pick({ searchQuery: true, filters: true }) },
  prompt: `You are an expert at understanding e-commerce search queries in English, Hindi, and Hinglish. Analyze the following transcribed text and extract structured search information.

Transcription: "{{{transcription}}}"

Your task is to:
1.  Identify the core product or item the user is looking for.
2.  Extract key attributes like category, color, or style.
3.  Generate a simple, clean \`searchQuery\` string in English for general keyword matching.
4.  Populate the \`filters\` object with any specific attributes you can identify. The valid categories are 'Pottery', 'Jewelry', 'Textiles', 'Painting'.

Examples:
- Transcription: "mujhe blue colour ki saree dikhao" -> searchQuery: "blue saree", filters: { category: "Textiles", color: "blue" }
- Transcription: "show me some rustic pottery" -> searchQuery: "rustic pottery", filters: { category: "Pottery", style: "rustic" }
- Transcription: "peeli painting" -> searchQuery: "yellow painting", filters: { category: "Painting", color: "yellow" }

Return a valid JSON object.
`,
});

const processVoiceSearchFlow = ai.defineFlow(
  {
    name: 'processVoiceSearchFlow',
    inputSchema: ProcessVoiceSearchInputSchema,
    outputSchema: ProcessVoiceSearchOutputSchema,
  },
  async input => {
    // Step 1: Transcribe the audio
    const transcriptionResult = await transcriptionPrompt(input);
    const transcribedText = transcriptionResult.text;

    // Step 2: Extract search criteria from the transcription
    const extractionResult = await queryExtractionPrompt({
      transcription: transcribedText,
    });
    
    const output = extractionResult.output;
    if (!output) {
        throw new Error("Failed to extract search criteria from transcription.");
    }

    return {
      transcribedText: transcribedText,
      searchQuery: output.searchQuery,
      filters: output.filters,
    };
  }
);
