
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ScrollytellingMission from '@/components/marketplace/scrollytelling-mission';
import FadeInOnScroll from "@/components/shared/fade-in-on-scroll";
import FestivalStore from '@/components/marketplace/festival-store';
import CuratorsDesk from '@/components/marketplace/curators-desk';

export default function MarketplacePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="bg-background parallax-bg">
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden flex items-center justify-center animated-gradient-hero">
        {heroImage && (
           <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover w-full h-full opacity-20"
            style={{ transform: `translateY(${scrollPosition * 0.4}px)` }}
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-primary/10" />
        <div 
          className="relative z-10 text-center text-foreground px-4"
          style={{ transform: `translateY(-${scrollPosition * 0.2}px)` }}
        >
          <p className="text-lg md:text-xl font-headline">Explore Our Collection</p>
          <h1 className="text-6xl md:text-8xl font-bold font-headline my-2">
            Viraasat
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto">
            Discover the essence of traditional art in our artisan marketplace. Find pieces you'll cherish for seasons to come, direct from the creators.
          </p>
        </div>
      </section>

      <div className="relative bg-background">
        <div className="absolute inset-x-0 top-0 -translate-y-1/2 z-10">
            <svg
            className="w-full h-auto text-background"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                opacity="0.33"
                d="M1440,32L1344,48C1248,64,1152,96,1056,90.7C960,85,864,43,768,53.3C672,64,576,128,480,128C384,128,288,64,192,42.7C96,21,0,43,0,43L0,120L1440,120L1440,32Z"
            />
            <path
                opacity="0.66"
                d="M1440,64L1344,58.7C1248,53,1152,43,1056,69.3C960,96,864,160,768,160C672,160,576,96,480,85.3C384,75,288,117,192,117.3C96,117,0,75,0,75L0,120L1440,120L1440,64Z"
            />
            <path
                d="M1440,96L1344,101.3C1248,107,1152,117,1056,106.7C960,96,864,64,768,58.7C672,53,576,75,480,90.7C384,107,288,117,192,106.7C96,96,0,64,0,64L0,120L1440,120L1440,96Z"
            />
            </svg>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        
        <FestivalStore />
        
        <CuratorsDesk />

        <FadeInOnScroll>
            <ScrollytellingMission />
        </FadeInOnScroll>
        
      </div>
    </div>
  );
}
