import LegacyBoxClient from "@/components/marketplace/legacy-box-client";
import { legacyBoxes, artisans, products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LegacyBoxPage() {

  const getArtisanDetails = (artisanId: string) => artisans.find(a => a.id === artisanId);
  const getProductDetails = (productId: string) => products.find(p => p.id === productId);
  const getImageDetails = (imageId: string) => PlaceHolderImages.find(i => i.id === imageId);

  const hydratedBoxes = legacyBoxes.map(box => ({
    ...box,
    heroItem: getProductDetails(box.heroItemId),
    featuredArtisans: box.featuredArtisanIds.map(getArtisanDetails).filter(Boolean),
    images: {
      ambience: getImageDetails(box.imageIds.ambience),
      map: getImageDetails(box.imageIds.map),
      items: box.imageIds.items.map(getImageDetails).filter(Boolean),
    }
  }));
  
  const currentBox = hydratedBoxes.find(b => b.status === 'current');
  const pastBoxes = hydratedBoxes.filter(b => b.status === 'past');

  return <LegacyBoxClient currentBox={currentBox} pastBoxes={pastBoxes} />;
}
