import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
    price: z.coerce.number().min(0, 'Price cannot be negative.'),
    category: z.enum(['pottery', 'jewelry', 'textiles', 'painting'], {
        required_error: 'Please select a category.',
    }),
    image: z.string().optional().refine(val => !val || val.startsWith('data:image/'), {
        message: 'Please upload a valid image.',
    }),
});

export type ProductFormState = {
    message: string;
    errors?: {
        name?: string[];
        description?: string[];
        stock?: string[];
        price?: string[];
        category?: string[];
        image?: string[];
    };
};
