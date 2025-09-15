import { notFound } from "next/navigation";
import { artisans, products } from "@/lib/data";
import { extractImageColors } from "@/ai/flows/extract-image-colors";
import ProductDetailClient from "./product-detail-client";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  
  let colorPalette;
  try {
    const colorResult = await extractImageColors({ imageUrl: product.imageUrls[0].url });
    colorPalette = colorResult.palette;
  } catch (error) {
    console.error("Failed to extract image colors:", error);
    // Provide a fallback palette if the AI call fails
    colorPalette = {
      vibrant: '#F97316', // Default primary
      muted: '#F3F4F6', // Default secondary
      darkMuted: '#1F2937', // Default text
      lightMuted: '#FFFFFF', // Default background
    };
  }

  return (
    <ProductDetailClient 
      product={product} 
      artisan={artisan} 
      colorPalette={colorPalette} 
    />
  );
}
