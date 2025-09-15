'use server';
/**
 * @fileOverview An AI agent that suggests gifts based on user input.
 *
 * - suggestGifts - A function that suggests gifts.
 * - SuggestGiftsInput - The input type for the suggestGifts function.
 * - SuggestGiftsOutput - The return type for the suggestGifts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {products} from '@/lib/data';

const allProducts = products.map(p => ({id: p.id, name: p.name, category: p.category, description: p.description, price: p.price }));


const SuggestGiftsInputSchema = z.object({
  recipient: z.string().describe("The person receiving the gift (e.g., 'Spouse', 'Mother', 'Friend')."),
  occasion: z.string().describe("The occasion for the gift (e.g., 'Birthday', 'Anniversary', 'Thank You')."),
  tasteProfile: z.string().describe("Notes about the recipient's style and preferences (e.g., 'loves minimalist design, earthy colors, and silver jewelry')."),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }).describe("The desired price range for the gift in INR."),
});
export type SuggestGiftsInput = z.infer<typeof SuggestGiftsInputSchema>;

const GiftSuggestionSchema = z.object({
    productId: z.string().describe("The ID of the suggested product."),
    reason: z.string().describe("A short, personal reason why this gift is a good match for the recipient and occasion."),
});

const SuggestGiftsOutputSchema = z.object({
  suggestions: z.array(GiftSuggestionSchema).max(3).describe("An array of up to 3 curated gift suggestions."),
});
export type SuggestGiftsOutput = z.infer<typeof SuggestGiftsOutputSchema>;

export async function suggestGifts(
  input: SuggestGiftsInput
): Promise<SuggestGiftsOutput> {
  return suggestGiftsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGiftsPrompt',
  input: {schema: SuggestGiftsInputSchema},
  output: {schema: SuggestGiftsOutputSchema},
  prompt: `You are a thoughtful and expert gift concierge for "Viraasat," a marketplace for high-end artisanal goods. Your task is to provide personalized gift recommendations.

**Context:**
- Recipient: {{recipient}}
- Occasion: {{occasion}}
- Recipient's Taste Profile: "{{tasteProfile}}"
- Price Range (INR): {{priceRange.min}} - {{priceRange.max}}

**Available Products:**
${JSON.stringify(allProducts)}

**Your Task:**
1.  Analyze the recipient, occasion, and taste profile.
2.  Filter the available products based on the price range.
3.  Select up to 3 of the most suitable products from the filtered list.
4.  For each selected product, provide its \`productId\` and write a short, warm, and personal \`reason\` explaining why it's a perfect choice. The reason should connect the product to the recipient's tastes and the occasion.

**Example Reason:** "For a lover of minimalist design, this serene azure pot would bring a touch of calm to her home office, making it a thoughtful birthday gift."

Return a JSON object with a "suggestions" array.
`,
});

const suggestGiftsFlow = ai.defineFlow(
  {
    name: 'suggestGiftsFlow',
    inputSchema: SuggestGiftsInputSchema,
    outputSchema: SuggestGiftsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
