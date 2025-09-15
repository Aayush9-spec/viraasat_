import HeritageStylistClient from "@/components/marketplace/heritage-stylist-client";
import { products } from "@/lib/data";

export default function HeritageStylistPage() {
  return <HeritageStylistClient allProducts={products} />;
}
