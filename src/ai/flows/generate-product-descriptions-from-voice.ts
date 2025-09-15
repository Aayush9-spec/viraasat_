'use server';
/**
 * @fileOverview An AI agent that generates product descriptions from voice recordings.
 *
 * - generateProductDescriptionsFromVoice - A function that handles the product description generation process.
 * - GenerateProductDescriptionsFromVoiceInput - The input type for the generateProductDescriptionsFromVoice function.
 * - GenerateProductDescriptionsFromVoiceOutput - The return type for the generateProductDescriptionsFromVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionsFromVoiceInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the product's description, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductDescriptionsFromVoiceInput = z.infer<typeof GenerateProductDescriptionsFromVoiceInputSchema>;

const GenerateProductDescriptionsFromVoiceOutputSchema = z.object({
  originalDescription: z.string().describe('The original transcribed text from the audio recording.'),
  enhancedDescription: z.string().describe('The AI-enhanced product description for better market appeal.'),
});
export type GenerateProductDescriptionsFromVoiceOutput = z.infer<typeof GenerateProductDescriptionsFromVoiceOutputSchema>;

export async function generateProductDescriptionsFromVoice(
  input: GenerateProductDescriptionsFromVoiceInput
): Promise<GenerateProductDescriptionsFromVoiceOutput> {
  return generateProductDescriptionsFromVoiceFlow(input);
}

const transcriptionPrompt = ai.definePrompt({
    name: 'transcriptionPrompt',
    input: { schema: z.object({ audioDataUri: z.string() }) },
    prompt: `Transcribe the following audio recording to text: {{{audioDataUri}}}`,
});


const enhancementPrompt = ai.definePrompt({
  name: 'generateProductDescriptionsFromVoicePrompt',
  input: {schema: z.object({
    transcription: z.string()
  })},
  output: {schema: z.object({
    enhancedDescription: z.string()
  })},
  prompt: `You are an expert marketing copywriter specializing in artisanal products. A local artisan has provided you with the following product description as transcribed from their audio recording:

Original Transcription: {{{transcription}}}

Your goal is to:
1.  Correct any grammar or spelling errors in the original transcription.
2.  Enhance the description to make it more engaging and appealing to potential buyers.

Provide only the enhanced description.
`,
});

const generateProductDescriptionsFromVoiceFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionsFromVoiceFlow',
    inputSchema: GenerateProductDescriptionsFromVoiceInputSchema,
    outputSchema: GenerateProductDescriptionsFromVoiceOutputSchema,
  },
  async input => {
    const transcriptionResult = await transcriptionPrompt(input);
    const transcription = transcriptionResult.text;

    const {output} = await enhancementPrompt({
      transcription,
    });
    return {
      originalDescription: transcription,
      enhancedDescription: output!.enhancedDescription,
    };
  }
);
