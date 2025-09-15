'use server';
/**
 * @fileOverview Generates a personalized thank you video from an artisan.
 *
 * - generateArtisanThankYouVideo: A function that creates a thank you video.
 * - GenerateArtisanThankYouVideoInput: The input type for the function.
 * - GenerateArtisanThankYouVideoOutput: The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateArtisanThankYouVideoInputSchema = z.object({
  artisanName: z.string().describe("The name of the artisan's shop."),
  artisanCraft: z.string().describe("The artisan's primary craft (e.g., Pottery, Jewelry)."),
  productName: z.string().describe("The name of the product purchased."),
  productImageUrl: z.string().describe("URL of the purchased product's image."),
});
export type GenerateArtisanThankYouVideoInput = z.infer<typeof GenerateArtisanThankYouVideoInputSchema>;

const GenerateArtisanThankYouVideoOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a data URI."),
});
export type GenerateArtisanThankYouVideoOutput = z.infer<typeof GenerateArtisanThankYouVideoOutputSchema>;

export async function generateArtisanThankYouVideo(
  input: GenerateArtisanThankYouVideoInput
): Promise<GenerateArtisanThankYouVideoOutput> {
  return generateArtisanThankYouVideoFlow(input);
}

const generateArtisanThankYouVideoFlow = ai.defineFlow(
  {
    name: 'generateArtisanThankYouVideoFlow',
    inputSchema: GenerateArtisanThankYouVideoInputSchema,
    outputSchema: GenerateArtisanThankYouVideoOutputSchema,
  },
  async (input) => {
    const prompt = `
      A cinematic, warm, and heartfelt video.
      An artisan from '${input.artisanName}', who specializes in ${input.artisanCraft}, is in their workshop.
      Sunlight streams through a window.
      The artisan looks at the camera and smiles warmly.
      The video shows a quick shot of the purchased product, '${input.productName}'.
      The artisan gives a thankful nod.
      The final shot is a beautiful, slow-motion capture of the artisan's hands at work.
      The overall feeling is genuine, grateful, and artistic.
    `;

    let operation;
    try {
      const generateResponse = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: [
          { text: prompt },
          { media: { url: input.productImageUrl } },
        ],
        config: {
          durationSeconds: 8,
          aspectRatio: '16:9',
          personGeneration: 'allow_adult',
        },
      });
      operation = generateResponse.operation;
    } catch (e) {
        console.error("Error during initial video generation call:", e);
        throw new Error('Failed to start video generation.');
    }


    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait for the operation to complete
    while (!operation.done) {
      console.log('Checking video generation status...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        operation = await ai.checkOperation(operation);
      } catch (e) {
         console.error("Error while checking operation status:", e);
         // Potentially implement retry logic here or fail gracefully
         throw new Error('Failed to check operation status.');
      }
    }

    if (operation.error) {
      console.error('Video generation failed:', operation.error);
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType?.startsWith('video/'));
    
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the operation result.');
    }

    // The URL from Veo is temporary and needs to be fetched.
    // In a production app, you would download this and store it permanently.
    // For this prototype, we'll fetch and Base64 encode it to send to the client.
    
    const fetch = (await import('node-fetch')).default;
    const videoUrl = `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`;
    
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video from URL: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const videoDataUri = `data:video/mp4;base64,${videoBase64}`;

    return { videoDataUri };
  }
);
