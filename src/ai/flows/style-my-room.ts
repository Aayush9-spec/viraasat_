'use server';
/**
 * @fileOverview An AI agent that styles a user's room with products.
 *
 * - styleMyRoom - A function that generates a stylized image of a room.
 * - StyleMyRoomInput - The input type for the styleMyRoom function.
 * - StyleMyRoomOutput - The return type for the styleMyRoom function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { products } from '@/lib/data';

const StyleMyRoomInputSchema = z.object({
  roomImageDataUri: z
    .string()
    .describe(
      "The photo of the user's room, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  productIds: z.array(z.string()).describe("An array of product IDs to style the room with."),
  theme: z.string().describe("The stylistic theme to apply (e.g., 'Monsoon Serenity', 'Desert Warmth').")
});
export type StyleMyRoomInput = z.infer<typeof StyleMyRoomInputSchema>;

const StyleMyRoomOutputSchema = z.object({
  styledImageDataUri: z
    .string()
    .describe('The AI-generated image of the styled room as a data URI.'),
});
export type StyleMyRoomOutput = z.infer<typeof StyleMyRoomOutputSchema>;

export async function styleMyRoom(
  input: StyleMyRoomInput
): Promise<StyleMyRoomOutput> {
  return styleMyRoomFlow(input);
}

const styleMyRoomFlow = ai.defineFlow(
  {
    name: 'styleMyRoomFlow',
    inputSchema: StyleMyRoomInputSchema,
    outputSchema: StyleMyRoomOutputSchema,
  },
  async ({ roomImageDataUri, productIds, theme }) => {
    
    const selectedProducts = products.filter(p => productIds.includes(p.id));
    
    const productPrompts = selectedProducts.map(p => ({
        text: `- ${p.name}: ${p.description}`,
        media: { url: p.imageUrls[0].url }
    }));

    const promptText = `
      You are an expert interior designer for the "Heritage" marketplace.
      Your task is to re-imagine the user's room based on a selected theme and products.

      **Theme:** ${theme}
      
      **User's Room:**
      You will be given an image of the user's room.
      
      **Inspirational Products:**
      You will be given images and descriptions of products to draw inspiration from.

      **Instructions:**
      1.  Analyze the user's room image to understand its layout, lighting, and basic furniture.
      2.  Analyze the provided inspirational products for their colors, textures, and styles.
      3.  Generate a **new, photorealistic image** of the user's room, tastefully decorated with items **inspired by** the selected products and matching the '${theme}' theme.
      4.  **Do NOT just paste the product images into the room.** Instead, integrate their essence. For example, if a "Turquoise Dream Necklace" is selected, add decorative elements with similar turquoise colors and intricate patterns. If a "Woven Throw" is selected, add a beautifully draped textile with a similar texture to the sofa.
      5.  The result should be a beautiful, professionally styled interior design photo that looks like a high-end magazine feature. The lighting should be natural and harmonious.
      6.  Maintain the original room's core architecture (walls, windows, main furniture shapes) but enhance the decor.
      7.  Return only the generated image.
    `;

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { text: promptText },
            { media: { url: roomImageDataUri } },
            ...productPrompts
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }

    return { styledImageDataUri: media.url };
  }
);
