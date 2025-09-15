import { products } from "@/lib/data";
import GiftingConciergeClient from "@/components/marketplace/gifting-concierge-client";

export default function GiftingConciergePage() {
  return <GiftingConciergeClient allProducts={products} />;
}
