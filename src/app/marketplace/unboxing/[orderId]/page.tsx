import { products, artisans } from "@/lib/data";
import { generateArtisanThankYouVideo } from "@/ai/flows/generate-artisan-thank-you-video";
import { notFound } from "next/navigation";
import VirtualUnboxingClient from "@/components/marketplace/virtual-unboxing-client";

// Mock Data - In a real app, this would come from the database based on orderId
const MOCK_GIFT_DATA = {
  productId: "prod-2", // Turquoise Dream Necklace
  senderName: "Priya",
  senderMessage: "Happy Birthday, Anjali! Hope this brings a little sparkle to your day. Can't wait to celebrate with you soon!",
};

export default async function UnboxingPage({ params }: { params: { orderId: string } }) {
  // In a real app, you'd use params.orderId to fetch order details
  const product = products.find((p) => p.id === MOCK_GIFT_DATA.productId);
  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  if (!artisan) {
    notFound();
  }

  // We can reuse the thank you video generation for a personal touch
  let videoDataUri = "";
  try {
    const videoResult = await generateArtisanThankYouVideo({
      artisanName: artisan.shopName,
      artisanCraft: artisan.craft,
      productName: product.name,
      productImageUrl: product.imageUrls[0].url,
    });
    videoDataUri = videoResult.videoDataUri;
  } catch (error) {
    console.error("Failed to generate artisan video for unboxing:", error);
    // Fallback in case video generation fails
  }

  return (
    <VirtualUnboxingClient
      product={product}
      artisan={artisan}
      senderName={MOCK_GIFT_DATA.senderName}
      senderMessage={MOCK_GIFT_DATA.senderMessage}
      videoDataUri={videoDataUri}
    />
  );
}
