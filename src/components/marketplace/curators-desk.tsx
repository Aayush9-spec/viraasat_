
'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { generateCuratedCollection, GenerateCuratedCollectionOutput } from '@/ai/flows/generate-curated-collection';
import { products as allProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AnimatedHeading from '../shared/animated-heading';
import InteractiveProductCard from './interactive-product-card';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import FadeInOnScroll from '../shared/fade-in-on-scroll';

const CuratorNote = ({ content }: { content: string }) => (
  <Card className="h-full flex items-center justify-center p-6 bg-secondary/50 border-dashed">
    <CardContent className="p-0">
      <p className="text-center font-headline italic text-lg text-muted-foreground">"{content}"</p>
    </CardContent>
  </Card>
);

const InspirationalImage = ({ imageId }: { imageId: string }) => {
  const image = PlaceHolderImages.find(img => img.id === imageId);
  if (!image) return null;

  return (
    <div className="h-full w-full overflow-hidden rounded-lg relative">
      <Image
        src={image.imageUrl}
        alt={image.description}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        data-ai-hint={image.imageHint}
      />
    </div>
  );
};


export default function CuratorsDesk() {
  const { cartItems } = useCart();
  const [collection, setCollection] = useState<GenerateCuratedCollectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      try {
        const userContext = cartItems.map(item => ({ name: item.name, category: item.category }));
        const result = await generateCuratedCollection({ userContext });
        setCollection(result);
      } catch (error) {
        console.error("Failed to generate curated collection:", error);
        setCollection(null); // Set to null on error to show a fallback or nothing
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if there are items in the cart or on some other trigger
    // to avoid running on every page load.
    if (cartItems.length > 0) {
        fetchCollection();
    } else {
        // You could fetch a default collection here if desired
        setIsLoading(false);
    }
  }, [cartItems]);

  const renderItem = (item: GenerateCuratedCollectionOutput['items'][0]) => {
    switch (item.type) {
      case 'product':
        const product = allProducts.find(p => p.id === item.id);
        return product ? <InteractiveProductCard product={product} /> : null;
      case 'image':
        return <InspirationalImage imageId={item.id} />;
      case 'note':
        return <CuratorNote content={item.content || ''} />;
      default:
        return null;
    }
  };
  
  // Don't render anything if there's no collection and not loading
  if (!collection && !isLoading) {
    return (
        <FadeInOnScroll>
            <section className="my-12 md:my-24">
                <AnimatedHeading text="Featured Products" className="text-3xl md:text-4xl font-headline font-bold text-center mb-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {allProducts.slice(0, 6).map((product) => (
                    <InteractiveProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </FadeInOnScroll>
    );
  }

  if (isLoading) {
    return (
      <section className="my-12 md:my-24">
        <Skeleton className="h-10 w-1/2 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{gridAutoRows: '250px'}}>
          <Skeleton className="col-span-2 row-span-2" />
          <Skeleton className="col-span-1" />
          <Skeleton className="col-span-1" />
          <Skeleton className="col-span-2" />
        </div>
      </section>
    );
  }


  return (
    <FadeInOnScroll>
        <section className="my-12 md:my-24">
        <AnimatedHeading text={collection.title || "Curated For You"} className="text-3xl md:text-4xl font-headline font-bold text-center mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{gridAutoRows: '250px'}}>
            {collection.items.map((item, index) => (
            <div
                key={item.id + index}
                className={cn(
                    'group',
                    item.span === 2 ? 'col-span-2' : 'col-span-1',
                    item.span === 2 ? 'row-span-2' : 'row-span-1',
                )}
            >
                {renderItem(item)}
            </div>
            ))}
        </div>
        </section>
    </FadeInOnScroll>
  );
}
