
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { getCurrentFestivalCampaign } from '@/lib/festival-service';
import type { FestivalCampaign } from '@/lib/types';
import InteractiveProductCard from './interactive-product-card';
import { Switch } from '../ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function FestivalStore() {
  const [campaign, setCampaign] = useState<FestivalCampaign | null>(null);
  const [isGifting, setIsGifting] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFestivalData() {
        setIsLoading(true);
        const currentCampaign = await getCurrentFestivalCampaign();
        
        if (currentCampaign) {
            setCampaign(currentCampaign);

            const notificationShownKey = `festival-notif-${currentCampaign.id}`;
            if (!sessionStorage.getItem(notificationShownKey)) {
                setTimeout(() => {
                toast({
                    title: `${currentCampaign.name} is here!`,
                    description: currentCampaign.notification,
                });
                sessionStorage.setItem(notificationShownKey, 'true');
                }, 5000);
            }
        }
        setIsLoading(false);
    }
    fetchFestivalData();
  }, [toast]);

  if (isLoading || !campaign) {
    return null; // Don't render anything if loading or no campaign is active
  }

  const dynamicStyles = {
    '--festival-bg': campaign.theme.background,
    '--festival-primary': campaign.theme.primary,
    '--festival-primary-fg': campaign.theme.primaryForeground,
    '--festival-accent': campaign.theme.accent,
    '--festival-accent-fg': campaign.theme.accentForeground,
  } as React.CSSProperties;

  return (
    <section
      className="my-12 md:my-24 rounded-2xl p-4 md:p-8 relative overflow-hidden text-white shadow-2xl transition-all hover:shadow-[0_0_40px_10px_rgba(0,0,0,0.2)]"
      style={dynamicStyles}
    >
        <Link href={`/marketplace/collections/${campaign.collectionId}`} className="absolute inset-0 z-0">
            <Image
                src={campaign.bannerImageUrl}
                alt={`${campaign.name} banner`}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={campaign.bannerImageHint}
            />
            <div className="absolute inset-0 bg-black/50 "/>
        </Link>

      <div className="relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link href={`/marketplace/collections/${campaign.collectionId}`}>
            <h2
                className="text-4xl md:text-5xl font-headline font-bold"
                style={{ color: 'var(--festival-primary)' }}
            >
                {campaign.title}
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: 'var(--festival-primary-fg)' }}>
                {campaign.subtitle}
            </p>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaign.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <InteractiveProductCard product={product} festivalContext={campaign} />
            </motion.div>
          ))}
        </div>
        
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-4 bg-black/20 p-6 rounded-lg backdrop-blur-sm"
        >
            <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8" style={{ color: 'var(--festival-accent)' }} />
                <Label htmlFor="gifting-switch" className="text-lg font-semibold" style={{ color: 'var(--festival-accent-fg)' }}>
                    Sending as a gift?
                </Label>
                 <Switch
                    id="gifting-switch"
                    checked={isGifting}
                    onCheckedChange={setIsGifting}
                    className="data-[state=checked]:bg-[var(--festival-accent)]"
                />
            </div>
            {campaign.offerCode && (
              <div className="text-center">
                  <p className="font-semibold" style={{ color: 'var(--festival-accent-fg)' }}>Use code <span className="p-1 rounded-md" style={{backgroundColor: 'var(--festival-accent)', color: 'var(--festival-accent-fg)'}}>{campaign.offerCode}</span> for 15% off!</p>
              </div>
            )}
        </motion.div>
      </div>
    </section>
  );
}
