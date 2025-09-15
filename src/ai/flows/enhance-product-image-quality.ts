'use server';
/**
 * @fileOverview This file defines a Genkit flow for enhancing the quality of product images using Google Cloud Vision API.
 *
 * - enhanceProductImageQuality - A function that enhances the quality of a product image.
 * - EnhanceProductImageQualityInput - The input type for the enhanceProductImageQuality function.
 * - EnhanceProductImageQualityOutput - The return type for the enhanceProductImageQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProductImageQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceProductImageQualityInput = z.infer<typeof EnhanceProductImageQualityInputSchema>;

const EnhanceProductImageQualityOutputSchema = z.object({
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced photo of the product as a data URI.'),
});
export type EnhanceProductImageQualityOutput = z.infer<typeof EnhanceProductImageQualityOutputSchema>;

export async function enhanceProductImageQuality(
  input: EnhanceProductImageQualityInput
): Promise<EnhanceProductImageQualityOutput> {
  return enhanceProductImageQualityFlow(input);
}

const enhanceProductImageQualityPrompt = ai.definePrompt({
  name: 'enhanceProductImageQualityPrompt',
  input: {schema: EnhanceProductImageQualityInputSchema},
  output: {schema: EnhanceProductImageQualityOutputSchema},
  prompt: `You are an AI assistant designed to enhance the quality of product images.

  Given a product image, you will enhance its quality by sharpening, reducing noise, correcting colors, and optimizing the background.

  The enhanced image will be returned as a data URI.

  Here is the product image:

  {{media url=photoDataUri}}
  `,
});

const enhanceProductImageQualityFlow = ai.defineFlow(
  {
    name: 'enhanceProductImageQualityFlow',
    inputSchema: EnhanceProductImageQualityInputSchema,
    outputSchema: EnhanceProductImageQualityOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: 'enhance this image. improve sharpness, reduce noise, correct colors, optimize the background, improve exposure and contrast. return the result as a data URI.'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {enhancedPhotoDataUri: media.url!};
  }
);
