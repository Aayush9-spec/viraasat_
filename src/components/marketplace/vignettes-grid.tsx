'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Vignette, Product } from '@/lib/types';
import AnimatedHeading from '../shared/animated-heading';
import PageTransition from '../shared/page-transition';

interface VignettesGridProps {
  vignettes: Vignette[];
  products: Product[];
}

const VignettesGrid: React.FC<VignettesGridProps> = ({ vignettes, products }) => {
  return (
    <PageTransition>
      <div className="text-center mb-12">
        <AnimatedHeading text="Vignettes of Viraasat" className="text-4xl md:text-5xl font-headline font-bold" />
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          See our handcrafted pieces in their new homes. Authentic stories and styles from our community.
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4"
      >
        {vignettes.map((vignette) => {
          const image = PlaceHolderImages.find(p => p.id === vignette.imageId);
          const product = products.find(p => p.id === vignette.productId);
          if (!image || !product) return null;

          return (
            <motion.div
              key={vignette.id}
              className={cn(
                "relative group rounded-lg overflow-hidden shadow-lg",
                vignette.span === 2 ? "md:col-span-2" : "md:col-span-1",
                 vignette.span === 2 ? "md:row-span-2" : "md:row-span-1",
                 "col-span-2"
              )}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, amount: 0.2 }}
               transition={{ duration: 0.6 }}
            >
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover w-full h-full transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-75"
                data-ai-hint={image.imageHint}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.div initial={{ y: 20 }} whileHover={{ y: 0 }}>
                  <blockquote className="text-white text-lg lg:text-xl font-headline italic mb-2">
                    "{vignette.quote}"
                  </blockquote>
                  <p className="text-white/80 text-sm">— {vignette.customerName}, {vignette.customerLocation}</p>
                </motion.div>
              </div>

              <Link href={`/marketplace/products/${product.id}`}>
                <motion.div 
                    className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground py-1 px-3 rounded-full text-sm font-semibold"
                    initial={{ y: -20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                  {product.name}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default VignettesGrid;
