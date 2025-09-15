import VignettesGrid from '@/components/marketplace/vignettes-grid';
import { vignettes, products } from '@/lib/data';

export default function VignettesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VignettesGrid vignettes={vignettes} products={products} />
    </div>
  );
}
