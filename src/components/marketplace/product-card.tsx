import Image from "next/image";
import Link from "next/link";
import { artisans } from "@/lib/data";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const artisan = artisans.find((a) => a.id === product.artisanId);
  const imageUrl = product.imageUrls[0]?.url || 'https://picsum.photos/seed/default/600/400';
  const imageHint = product.imageUrls[0]?.hint || 'placeholder';

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      <Link href={`/marketplace/products/${product.id}`} className="flex-grow">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover w-full h-full"
              data-ai-hint={imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline leading-tight mb-1">{product.name}</CardTitle>
          <CardDescription>
            by {artisan ? artisan.shopName : "Unknown Artisan"}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
        <Button variant="secondary" asChild>
          <Link href={`/marketplace/products/${product.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
