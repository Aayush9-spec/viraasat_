
import { products, artisans } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { notFound } from "next/navigation";
import HeirloomLedgerClient from "@/components/marketplace/heirloom-ledger-client";

// In a real app, this would be determined by the logged-in user's owned products.
// For this prototype, we'll feature one specific product.
const FEATURED_PRODUCT_ID = "prod-3"; // Earthy Tone Woven Throw

export default function HeirloomLedgerPage() {
  const product = products.find((p) => p.id === FEATURED_PRODUCT_ID);
  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  if (!artisan) {
    notFound();
  }

  // Mock ledger entries. In a real app, this would come from a database.
  const mockEntries = [
    {
      id: "entry-1",
      type: "purchase",
      date: "2023-05-20",
      title: "The Journey Begins",
      text: "Acquired from Viraasat, originally crafted by " + artisan.shopName,
      imageUrl: product.imageUrls[0].url,
      imageHint: product.imageUrls[0].hint,
    },
    {
      id: "entry-2",
      type: "user",
      date: "2023-06-15",
      title: "Our New Home's Centerpiece",
      text: "We finally moved into our new apartment! This beautiful throw was the first decorative piece we added. It instantly made the space feel warm and ours.",
      imageUrl: PlaceHolderImages.find(p => p.id === 'vignette-1')?.imageUrl,
      imageHint: PlaceHolderImages.find(p => p.id === 'vignette-1')?.imageHint,
    },
    {
      id: "entry-3",
      type: "user",
      date: "2024-01-01",
      title: "First New Year",
      text: "Cozying up under this throw as we watched the fireworks. It's become a part of our little family traditions already.",
      imageUrl: PlaceHolderImages.find(p => p.id === 'heirloom-1')?.imageUrl,
      imageHint: PlaceHolderImages.find(p => p.id === 'heirloom-1')?.imageHint,
    },
    {
      id: "entry-4",
      type: "audio",
      date: "2024-05-20",
      title: "One Year Anniversary Note",
      text: "A short reflection on a year with this piece.",
      // In a real app, this would be a URL to an audio file.
    },
  ];


  return (
    <HeirloomLedgerClient 
        product={product} 
        artisan={artisan}
        initialEntries={mockEntries}
    />
  );
}
