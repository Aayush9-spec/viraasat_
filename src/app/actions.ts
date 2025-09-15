'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { productSchema, type ProductFormState } from '@/lib/schemas';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';


export async function addProduct(
  prevState: ProductFormState,
  formData: FormData
) {

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        stock: formData.get('stock'),
        price: formData.get('price'),
        category: formData.get('category'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Failed to create product.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // In a real app, you would save this to a database.
    // For this prototype, we'll add it to our in-memory data array.
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        artisanId: 'artisan-1', // Assuming the logged-in artisan
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        stock: validatedFields.data.stock,
        price: validatedFields.data.price,
        category: validatedFields.data.category.charAt(0).toUpperCase() + validatedFields.data.category.slice(1) as Product['category'],
        imageUrls: validatedFields.data.image ? [{ id: `img-${Date.now()}`, url: validatedFields.data.image, hint: 'product photo' }] : [],
    };

    products.unshift(newProduct); // Add to the beginning of the array

    revalidatePath('/artisan-dashboard/products');
    redirect('/artisan-dashboard/products');
}
