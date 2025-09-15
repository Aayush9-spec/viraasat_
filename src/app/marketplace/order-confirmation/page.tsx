
import { products, artisans } from "@/lib/data";
import OrderConfirmationClient from "@/components/marketplace/order-confirmation-client";
import { generateArtisanThankYouVideo } from "@/ai/flows/generate-artisan-thank-you-video";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";


async function VideoGenerator({ product, artisan }: { product: any; artisan: any;}) {
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
        console.error("Failed to generate thank you video:", error);
    }
    return <OrderConfirmationClient
      product={product}
      artisan={artisan}
      userLocation={{ name: "Mumbai", x: 200, y: 700 }}
      videoDataUri={videoDataUri}
    />
}

export default async function OrderConfirmationPage() {
  const cookieStore = cookies();
  const lastProductId = cookieStore.get('lastProductId')?.value || "prod-1";

  const product = products.find((p) => p.id === lastProductId);
  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  if (!artisan) {
    notFound();
  }


  return (
    <Suspense fallback={<div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4"><Loader2 className="w-12 h-12 animate-spin text-primary" /><p className="text-muted-foreground">Preparing your confirmation...</p></div>}>
      <VideoGenerator product={product} artisan={artisan} />
    </Suspense>
  );
}
