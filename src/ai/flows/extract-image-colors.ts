'use server';
/**
 * @fileOverview Extracts a color palette from an image.
 *
 * - extractImageColors - A function that extracts colors from an image.
 * - ExtractImageColorsInput - The input type for the extractImageColors function.
 * - ExtractImageColorsOutput - The return type for the extractImageColors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractImageColorsInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to analyze.'),
});
export type ExtractImageColorsInput = z.infer<typeof ExtractImageColorsInputSchema>;

const ColorPaletteSchema = z.object({
  vibrant: z.string().describe('A vibrant, eye-catching color. (Hex code)'),
  muted: z.string().describe('A soft, muted color. (Hex code)'),
  darkMuted: z.string().describe('A dark, muted color, suitable for text. (Hex code)'),
  lightMuted: z.string().describe('A light, muted color, suitable for backgrounds. (Hex code)'),
});

const ExtractImageColorsOutputSchema = z.object({
  palette: ColorPaletteSchema.describe('The extracted color palette.'),
});
export type ExtractImageColorsOutput = z.infer<typeof ExtractImageColorsOutputSchema>;

export async function extractImageColors(
  input: ExtractImageColorsInput
): Promise<ExtractImageColorsOutput> {
  return extractImageColorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractImageColorsPrompt',
  input: {schema: ExtractImageColorsInputSchema},
  output: {schema: ExtractImageColorsOutputSchema},
  prompt: `You are a color analysis expert. Analyze the following image and extract a harmonious color palette.

Image URL: {{{imageUrl}}}

Extract the following colors as hex codes:
- vibrant: An eye-catching, saturated color from the image.
- muted: A toned-down, subtle color from the image.
- darkMuted: A dark, desaturated color suitable for text.
- lightMuted: A very light, desaturated color suitable for page backgrounds.

Return the result as a JSON object.`,
});

const extractImageColorsFlow = ai.defineFlow(
  {
    name: 'extractImageColorsFlow',
    inputSchema: ExtractImageColorsInputSchema,
    outputSchema: ExtractImageColorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
