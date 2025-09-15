import ArtisanMap from "@/components/marketplace/artisan-map";
import { artisans, products } from "@/lib/data";

export default function CreatorsPage() {
  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden">
      <ArtisanMap artisans={artisans} products={products} />
    </div>
  );
}
