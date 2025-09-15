
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, MapPin, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AnimatedHeading from '../shared/animated-heading';
import PageTransition from '../shared/page-transition';

// We need to define the props based on the hydrated data from the page
// This is a simplified version, you might want to expand these types
type Product = { id: string; name: string; imageUrls: { url: string; hint: string }[] };
type Artisan = { id: string; shopName: string; profileImageUrl: { url: string; hint: string } };
type ImagePlaceholder = { imageUrl: string; description: string; imageHint: string };

type HydratedBox = {
  id: string;
  quarter: string;
  theme: string;
  description: string;
  status: 'current' | 'past';
  heroItem?: Product;
  featuredArtisans: Artisan[];
  images: {
    ambience?: ImagePlaceholder;
    map?: ImagePlaceholder;
    items: ImagePlaceholder[];
  }
};

interface LegacyBoxClientProps {
  currentBox?: HydratedBox;
  pastBoxes: HydratedBox[];
}

export default function LegacyBoxClient({ currentBox, pastBoxes }: LegacyBoxClientProps) {
  if (!currentBox) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20 text-center">
          <AnimatedHeading text="The Legacy Box" className="text-4xl md:text-5xl font-bold font-headline" />
          <p className="mt-4 text-lg text-muted-foreground">The next curated experience is coming soon. Stay tuned.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative bg-secondary/30 pt-20 pb-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="secondary" className="text-sm font-semibold mb-4">Quarterly Subscription</Badge>
            <AnimatedHeading text="The Legacy Box" className="text-5xl md:text-7xl font-bold font-headline" />
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              A quarterly cultural deep-dive. Each box is a curated journey into the heart of a specific region and its craft, transforming you from customer to connoisseur.
            </p>
            <Button size="lg" className="mt-8 btn-gradient">Subscribe Now - ₹3,999/quarter</Button>
          </motion.div>
        </div>
      </div>

      {/* Current Box Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold font-headline">{currentBox.quarter}</p>
            <h2 className="text-4xl md:text-5xl font-bold font-headline mt-2">{currentBox.theme}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
              <p className="text-xl leading-relaxed text-muted-foreground">{currentBox.description}</p>
              <Card className="bg-secondary/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Box className="w-5 h-5 text-primary" /> What's Inside</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>One exclusive, high-quality 'hero' item.</li>
                    <li>Two smaller, complementary artisanal items.</li>
                    <li>A booklet telling the stories of the artisans.</li>
                    <li>A sensory element like local spices or tea.</li>
                  </ul>
                </CardContent>
              </Card>
              <div>
                <h3 className="font-headline text-lg font-semibold mb-3">Featured Artisans</h3>
                <div className="flex space-x-4">
                  {currentBox.featuredArtisans.map(artisan => (
                    <Link href="/marketplace/creators" key={artisan.id} className="text-center group">
                      <Avatar className="h-16 w-16 mb-2 border-2 border-transparent group-hover:border-primary transition-all">
                        <AvatarImage src={artisan.profileImageUrl?.url} alt={artisan.shopName} />
                        <AvatarFallback>{artisan.shopName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium">{artisan.shopName}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div 
                className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {currentBox.images.ambience && (
                    <div className="col-span-2 row-span-1 relative rounded-lg overflow-hidden shadow-lg">
                        <Image src={currentBox.images.ambience.imageUrl} alt={currentBox.images.ambience.description} fill className="object-cover" />
                    </div>
                )}
                {currentBox.heroItem && (
                    <div className="col-span-1 row-span-1 relative rounded-lg overflow-hidden shadow-lg">
                        <Image src={currentBox.heroItem.imageUrls[0].url} alt={currentBox.heroItem.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-end">
                            <h4 className="font-bold text-white font-headline text-sm">Hero Item: {currentBox.heroItem.name}</h4>
                        </div>
                    </div>
                )}
                {currentBox.images.map && (
                    <div className="col-span-1 row-span-1 relative rounded-lg overflow-hidden shadow-lg">
                         <Image src={currentBox.images.map.imageUrl} alt={currentBox.images.map.description} fill className="object-cover" />
                    </div>
                )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Past Boxes Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Your Collector's Archive</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastBoxes.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col group">
                  {box.images.ambience && (
                    <div className="relative h-48">
                      <Image src={box.images.ambience.imageUrl} alt={box.theme} fill className="object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-primary font-semibold">{box.quarter}</p>
                    <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{box.theme}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{box.description.substring(0, 100)}...</p>
                    <Button variant="link" className="p-0 h-auto self-start mt-4">View Details &rarr;</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
