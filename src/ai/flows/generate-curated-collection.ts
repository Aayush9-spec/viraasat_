
'use server';
/**
 * @fileOverview An AI agent that generates a curated collection of products, images, and notes for a user's homepage.
 *
 * - generateCuratedCollection - A function that creates a personalized "Curator's Desk" mood board.
 * - GenerateCuratedCollectionInput - The input type for the function.
 * - GenerateCuratedCollectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {products} from '@/lib/data';
import {PlaceHolderImages} from '@/lib/placeholder-images';

const allProducts = products.map(p => ({id: p.id, name: p.name, category: p.category}));
const allInspirationalImages = PlaceHolderImages.filter(img => img.id.startsWith('product') || img.id.startsWith('scrolly')).map(img => ({id: img.id, description: img.description}));

const GenerateCuratedCollectionInputSchema = z.object({
  userContext: z.array(z.object({
      name: z.string(),
      category: z.string(),
  })).describe("A list of products the user has shown interest in (e.g., items in their cart).")
});
export type GenerateCuratedCollectionInput = z.infer<typeof GenerateCuratedCollectionInputSchema>;

const ItemSchema = z.object({
    type: z.enum(['product', 'image', 'note']),
    id: z.string().describe("For 'product' or 'image' type, the ID of the item. For 'note' type, a unique string like 'note-1'."),
    span: z.number().min(1).max(2).describe("The column span for the grid item (1 for small, 2 for large). Also determines row span (1 for small, 2 for large)."),
    content: z.string().optional().describe("For 'note' type, the text content of the note."),
});

const GenerateCuratedCollectionOutputSchema = z.object({
  title: z.string().describe("A creative, personalized title for the collection, e.g., 'For the Lover of Earthy Tones'."),
  items: z.array(ItemSchema).min(5).max(7).describe("An array of 5-7 items to display in the grid. Aim for a visually pleasing mix of products, images, and notes with varied spans. Use a large (span 2) item as a centerpiece."),
});
export type GenerateCuratedCollectionOutput = z.infer<typeof GenerateCuratedCollectionOutputSchema>;


export async function generateCuratedCollection(
  input: GenerateCuratedCollectionInput
): Promise<GenerateCuratedCollectionOutput> {
  return generateCuratedCollectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCuratedCollectionPrompt',
  input: {schema: GenerateCuratedCollectionInputSchema},
  output: {schema: GenerateCuratedCollectionOutputSchema},
  prompt: `You are an expert curator and interior designer for a high-end artisan marketplace called "Viraasat." Your task is to create a personalized "Curator's Desk" mood board for a returning user.

Based on the user's interests, you will generate a visually appealing and thematically coherent collection for a 4-column grid.

**User's Current Interests (e.g., items in cart):**
{{#if userContext.length}}
  {{#each userContext}}
  - {{this.name}} ({{this.category}})
  {{/each}}
{{else}}
  The user has not shown any specific interests yet. Please create a general, welcoming collection with a title like "Handpicked for You".
{{/if}}

**Available Products for Curation (you must use these exact IDs):**
${JSON.stringify(allProducts)}

**Available Inspirational Images for Curation (you must use these exact IDs):**
${JSON.stringify(allInspirationalImages)}

**Your Task:**
1.  **Create a Title:** Write a short, elegant, and personal title for the collection. If the user has interests, reflect them in the title.
2.  **Select Items:** Choose a mix of 5 to 7 items from the available products and images.
3.  **Write Curator's Notes:** Add 1-2 short, personal notes (as 'note' type items). These notes should feel like a stylist's advice, connecting the pieces or speaking to the user's taste. For example: "A touch of brass to complement the rustic pottery." or "Inspired by your eye for minimalist design..."
4.  **Define Layout:** For each item, decide its span. A span of 1 means it takes up 1 column and 1 row (a square). A span of 2 means it takes up 2 columns and 2 rows (a large square). You must create a layout that fits within a 4-column grid structure. A good layout often has one 'span 2' item as a centerpiece, surrounded by 'span 1' items. For example, a 7-item layout could be one span-2 item and five span-1 items, which perfectly fits into 2 rows of a 4-column grid.
5.  **Assemble the Output:** Return a JSON object following the specified output schema. Ensure the total number of items is between 5 and 7.
`,
});

const generateCuratedCollectionFlow = ai.defineFlow(
  {
    name: 'generateCuratedCollectionFlow',
    inputSchema: GenerateCuratedCollectionInputSchema,
    outputSchema: GenerateCuratedCollectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
