
'use client';

import Image from "next/image";
import Link from "next/link";
import AiInsights from "@/components/marketplace/ai-insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import PageTransition from "@/components/shared/page-transition";
import type { Product, Artisan } from "@/lib/types";
import { useCart } from "@/context/cart-context";
import PincodeChecker from "@/components/marketplace/pincode-checker";

type ColorPalette = {
  vibrant: string;
  muted: string;
  darkMuted: string;
  lightMuted: string;
};

interface ProductDetailClientProps {
  product: Product;
  artisan: Artisan | undefined;
  colorPalette: ColorPalette;
}

export default function ProductDetailClient({ product, artisan, colorPalette }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(value);

  const dynamicStyles = {
    '--page-bg': colorPalette.lightMuted,
    '--page-fg': colorPalette.darkMuted,
    '--page-accent': colorPalette.vibrant,
    '--page-muted': colorPalette.muted,
  } as React.CSSProperties;

  return (
    <PageTransition>
      <div style={dynamicStyles} className="bg-[var(--page-bg)] text-[var(--page-fg)] transition-colors duration-1000">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div>
              <div className="aspect-w-4 aspect-h-3 mb-4">
                <Image
                    src={product.imageUrls[0].url}
                    alt={product.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    data-ai-hint={product.imageUrls[0].hint}
                    style={{ viewTransitionName: `product-image-${product.id}` }}
                  />
              </div>
              {/* Thumbnails could go here */}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                <Badge variant="secondary" style={{ backgroundColor: 'var(--page-muted)', color: 'var(--page-fg)' }} className="mb-2">{product.category}</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold font-headline">{product.name}</h1>
                {artisan && (
                  <p className="text-xl text-muted-foreground mt-1">
                    by <Link href="#" className="text-[var(--page-accent)] hover:underline">{artisan.shopName}</Link>
                  </p>
                )}
              </div>

              <p className="text-3xl font-semibold font-headline text-[var(--page-accent)]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}</p>
              
              <p className="text-base leading-relaxed">{product.description}</p>

              <Separator />

              <PincodeChecker />

              <Separator />
              
              <div>
                <Button size="lg" className="w-full sm:w-auto text-white" style={{ backgroundColor: 'var(--page-accent)' }} onClick={() => addToCart(product)}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <p className="text-sm text-muted-foreground mt-2">{product.stock} in stock</p>
              </div>

              <Separator />
              
              <AiInsights product={product} />

            </div>
          </div>
          
          {/* Artisan Story Section */}
          {artisan && (
            <div className="mt-20">
              <Card className="bg-white/50 dark:bg-black/20">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">About the Artisan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src={artisan.profileImageUrl.url} alt={artisan.shopName} data-ai-hint={artisan.profileImageUrl.hint} />
                        <AvatarFallback>{artisan.shopName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold font-headline">{artisan.shopName}</h3>
                      <p className="text-muted-foreground mb-4">{artisan.bio}</p>
                      <p className="text-base leading-relaxed">{artisan.story}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
