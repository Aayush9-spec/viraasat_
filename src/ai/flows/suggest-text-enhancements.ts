// This is a server action.
'use server';

/**
 * @fileOverview A text enhancement AI agent, for suggesting enhanced product descriptions.
 *
 * - suggestTextEnhancements - A function that enhances the provided product description.
 * - SuggestTextEnhancementsInput - The input type for the suggestTextEnhancements function.
 * - SuggestTextEnhancementsOutput - The return type for the suggestTextEnhancements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTextEnhancementsInputSchema = z.object({
  productDescription: z.string().describe('The current product description.'),
});
export type SuggestTextEnhancementsInput = z.infer<
  typeof SuggestTextEnhancementsInputSchema
>;

const SuggestTextEnhancementsOutputSchema = z.object({
  enhancedDescription: z
    .string()
    .describe('The enhanced product description.'),
});
export type SuggestTextEnhancementsOutput = z.infer<
  typeof SuggestTextEnhancementsOutputSchema
>;

export async function suggestTextEnhancements(
  input: SuggestTextEnhancementsInput
): Promise<SuggestTextEnhancementsOutput> {
  return suggestTextEnhancementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTextEnhancementsPrompt',
  input: {schema: SuggestTextEnhancementsInputSchema},
  output: {schema: SuggestTextEnhancementsOutputSchema},
  prompt: `You are an expert copywriter specializing in marketing artisan products.

You will receive a product description and will enhance it to be more appealing to customers.

Original Description: {{{productDescription}}}

Enhanced Description:`,
});

const suggestTextEnhancementsFlow = ai.defineFlow(
  {
    name: 'suggestTextEnhancementsFlow',
    inputSchema: SuggestTextEnhancementsInputSchema,
    outputSchema: SuggestTextEnhancementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
