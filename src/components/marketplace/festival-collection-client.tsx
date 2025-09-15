
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FestivalCampaign, Product } from '@/lib/types';
import PageTransition from '../shared/page-transition';
import AnimatedHeading from '../shared/animated-heading';
import InteractiveProductCard from './interactive-product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FestivalCollectionClientProps {
  campaign: FestivalCampaign;
}

export default function FestivalCollectionClient({ campaign }: FestivalCollectionClientProps) {
  const [activeTab, setActiveTab] = useState(campaign.subCategories ? 'all' : '');
  
  const dynamicStyles = {
    '--festival-bg': campaign.theme.background,
    '--festival-primary': campaign.theme.primary,
    '--festival-primary-fg': campaign.theme.primaryForeground,
    '--festival-accent': campaign.theme.accent,
    '--festival-accent-fg': campaign.theme.accentForeground,
  } as React.CSSProperties;
  
  const filteredProducts = (tab: string): Product[] => {
    if (tab === 'all') return campaign.products;
    const subCategory = campaign.subCategories?.find(sc => sc.id === tab);
    if (!subCategory) return [];
    return campaign.products.filter(p => 
      subCategory.productTags.some(tag => p.tags?.includes(tag))
    );
  };

  return (
    <PageTransition>
      <div style={dynamicStyles}>
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden flex items-center justify-center text-primary-foreground">
          <Image
            src={campaign.bannerImageUrl}
            alt={`${campaign.name} banner`}
            fill
            className="object-cover w-full h-full"
            data-ai-hint={campaign.bannerImageHint}
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4"
          >
            <AnimatedHeading text={campaign.title} className="text-5xl md:text-7xl font-bold font-headline" style={{ color: 'var(--festival-primary)' }} />
            <p className="text-lg md:text-xl max-w-2xl mx-auto mt-4" style={{ color: 'var(--festival-primary-fg)' }}>
              {campaign.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Products Section */}
        <div className="bg-background py-12">
            <div className="container mx-auto px-4">
                {campaign.subCategories && campaign.subCategories.length > 0 ? (
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                {campaign.subCategories.map(sc => (
                                    <TabsTrigger key={sc.id} value={sc.id}>{sc.name}</TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <TabsContent value="all">
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {campaign.products.map((product) => (
                                    <InteractiveProductCard key={product.id} product={product} festivalContext={campaign} />
                                ))}
                            </div>
                        </TabsContent>

                         {campaign.subCategories.map(sc => (
                            <TabsContent key={sc.id} value={sc.id}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {filteredProducts(sc.id).map((product) => (
                                        <InteractiveProductCard key={product.id} product={product} festivalContext={campaign} />
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                     </Tabs>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {campaign.products.map((product) => (
                        <InteractiveProductCard key={product.id} product={product} festivalContext={campaign} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </PageTransition>
  );
}
