
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { artisans } from '@/lib/data';
import type { Product, FestivalCampaign } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useFeatherlight } from '@/context/featherlight-context';
import { Badge } from '../ui/badge';

interface InteractiveProductCardProps {
  product: Product;
  festivalContext?: FestivalCampaign | null;
}

const performTransition = (callback: () => void) => {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  document.startViewTransition(callback);
}

export default function InteractiveProductCard({ product, festivalContext }: InteractiveProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const router = useRouter();
  const { isFeatherlightActive } = useFeatherlight();

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const imageUrl = product.imageUrls[0]?.url || 'https://picsum.photos/seed/default/600/400';
  const imageHint = product.imageUrls[0]?.hint || 'placeholder';

  // In Featherlight mode, request smaller and lower quality images
  const imageWidth = isFeatherlightActive ? 300 : 600;
  const imageHeight = isFeatherlightActive ? 200 : 400;
  const imageQuality = isFeatherlightActive ? 40 : 75;
  const imageSrc = imageUrl.includes('picsum.photos') 
    ? imageUrl.replace(/\/\d+\/\d+$/, `/${imageWidth}/${imageHeight}`)
    : imageUrl;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value).replace('₹', '');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFeatherlightActive) return;
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = (y / height - 0.5) * -15; // Invert for natural feel
    const rotateY = (x / width - 0.5) * 15;

    setStyle({
      '--x': `${x}px`,
      '--y': `${y}px`,
      'transform': `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    if (isFeatherlightActive) return;
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    });
  };

  const handleNavigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    performTransition(() => {
      router.push(href);
    });
  };

  const cardDynamicStyles = isFeatherlightActive ? {} : style;
  const cardClasses = cn(
    "group relative h-full bg-card transition-shadow duration-300",
    !isFeatherlightActive && "transform-style-3d transition-transform duration-300 ease-out will-change-transform",
    isFeatherlightActive && "shadow-md hover:shadow-xl"
  );

  const isFestivalProduct = festivalContext && festivalContext.curatedProductIds.includes(product.id);

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardDynamicStyles}
      className={cardClasses}
    >
      {/* Magnetic Glow */}
      {!isFeatherlightActive && (
        <div className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'radial-gradient(400px at var(--x) var(--y), hsla(0,0%,100%,0.15), transparent 80%)' }} />
      )}

      <div className="flex h-full flex-col overflow-hidden rounded-[inherit]">
        <a href={`/marketplace/products/${product.id}`} onClick={(e) => handleNavigate(e, `/marketplace/products/${product.id}`)} className="flex-grow flex flex-col">
          <CardHeader className="p-0">
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.name}
                width={imageWidth}
                height={imageHeight}
                quality={imageQuality}
                className="object-cover w-full h-full"
                data-ai-hint={imageHint}
                style={{ viewTransitionName: `product-image-${product.id}` }}
                // All images below the fold are lazy-loaded by default in Next.js
                // We can be explicit if needed for above-the-fold images by setting priority={true}
                loading="lazy"
              />
              {isFestivalProduct && (
                <Badge className="absolute top-2 right-2" style={{
                    backgroundColor: festivalContext.theme.accent,
                    color: festivalContext.theme.accentForeground,
                }}>
                    {festivalContext.name} Pick
                </Badge>
              )}
              {/* Glossy Shine Effect - disabled in featherlight */}
              {!isFeatherlightActive && (
                <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform-gpu bg-gradient-to-r from-transparent to-white/30 opacity-40 group-hover:animate-[card-shine_1s_ease-in-out_1]" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-headline leading-tight mb-1">{product.name}</CardTitle>
            <CardDescription>
              by {artisan ? artisan.shopName : "Unknown Artisan"}
            </CardDescription>
          </CardContent>
        </a>
        <div className={cn(
            "p-4 pt-0",
            !isFeatherlightActive && "transform-gpu translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
          )}>
           <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
            <Button variant="secondary" asChild>
              <a href={`/marketplace/products/${product.id}`} onClick={(e) => handleNavigate(e, `/marketplace/products/${product.id}`)}>View</a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
