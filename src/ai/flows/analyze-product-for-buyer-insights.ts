'use server';
/**
 * @fileOverview Provides AI-powered insights for a product, such as key features and stylistic tags, to help buyers quickly understand if the product matches their taste.
 *
 * - analyzeProductForBuyerInsights - A function that analyzes a product and provides insights for buyers.
 * - AnalyzeProductInput - The input type for the analyzeProductForBuyerInsights function.
 * - AnalyzeProductOutput - The return type for the analyzeProductForBuyerInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product to be analyzed.'),
  productImageUrls: z
    .array(z.string())
    .describe('Array of URLs of the product images.'),
  productCategory: z.string().describe('The category of the product.'),
  productName: z.string().describe('The name of the product'),
});
export type AnalyzeProductInput = z.infer<typeof AnalyzeProductInputSchema>;

const AnalyzeProductOutputSchema = z.object({
  keyFeatures: z
    .array(z.string())
    .describe('Key features of the product extracted from the description.'),
  styleTags: z
    .array(z.string())
    .describe('Stylistic tags that describe the product aesthetic.'),
  potentialUseCases: z
    .array(z.string())
    .describe('Potential use cases for the product.'),
  summary: z
    .string()
    .describe(
      'A short summary of the product based on the description and images'
    ),
});
export type AnalyzeProductOutput = z.infer<typeof AnalyzeProductOutputSchema>;

export async function analyzeProductForBuyerInsights(
  input: AnalyzeProductInput
): Promise<AnalyzeProductOutput> {
  return analyzeProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductPrompt',
  input: {schema: AnalyzeProductInputSchema},
  output: {schema: AnalyzeProductOutputSchema},
  prompt: `You are an AI assistant that provides insights for buyers about products. Analyze the following product description, images, and other available data to provide key features, style/aesthetic tags, potential use cases, and a summary.

Product Name: {{{productName}}}
Product Category: {{{productCategory}}}
Product Description: {{{productDescription}}}
Product Image URLs: {{#each productImageUrls}}{{{this}}} {{/each}}

Output a JSON object with the following keys:
- keyFeatures: A list of the most important features (e.g., Hand-painted, Sustainable materials, Unique design).
- styleTags: A list of stylistic tags (e.g., Boho Chic, Minimalist, Rustic Charm) that might appeal to the buyer.
- potentialUseCases: Suggest how the product could be used or styled (e.g., Perfect for a gift, Adds a pop of color to your living room).
- summary: A short summary of the product based on the description and images

Make sure the output is a valid JSON object.
`,
});

const analyzeProductFlow = ai.defineFlow(
  {
    name: 'analyzeProductFlow',
    inputSchema: AnalyzeProductInputSchema,
    outputSchema: AnalyzeProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
