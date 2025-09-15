
import PatronsCommissionClient from "@/components/marketplace/patrons-commission-client";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const materialOptions = [
    { id: 'material-silk', name: 'Woven Silk', description: 'Lustrous, soft, and delicately strong.' },
    { id: 'material-brass', name: 'Hammered Brass', description: 'Warm, golden tones with a hand-worked texture.' },
    { id: 'material-clay', name: 'Terracotta Clay', description: 'Earthy, porous, and rich in natural color.' },
    { id: 'material-wood', name: 'Aged Teakwood', description: 'Deep, rich grain with unparalleled durability.' },
    { id: 'material-gemstone', name: 'Raw Gemstones', description: 'Uncut, natural stones brimming with character.' },
    { id: 'material-leather', name: 'Vegetable-Tanned Leather', description: 'Tanned using natural materials, ages beautifully.' },
];

const hydratedMaterials = materialOptions.map(material => {
    const image = PlaceHolderImages.find(img => img.id === material.id);
    return {
        ...material,
        imageUrl: image?.imageUrl || '',
        imageHint: image?.imageHint || 'material texture',
    }
});


export default function PatronsCommissionPage() {
  return <PatronsCommissionClient materials={hydratedMaterials} />;
}
