import ViraasatStylistClient from "@/components/marketplace/heritage-stylist-client";
import { products } from "@/lib/data";

export default function ViraasatStylistPage() {
  return <ViraasatStylistClient allProducts={products} />;
}
