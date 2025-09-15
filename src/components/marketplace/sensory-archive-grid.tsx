'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import AnimatedHeading from '../shared/animated-heading';
import PageTransition from '../shared/page-transition';

interface SensoryItem {
  id: string;
  name: string;
  imageId: string;
  audioSrc: string;
}

interface SensoryArchiveGridProps {
  items: SensoryItem[];
}

const SensoryArchiveGrid: React.FC<SensoryArchiveGridProps> = ({ items }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (src: string) => {
    if (isMuted || !audioRef.current) return;
    audioRef.current.src = src;
    audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
  };

  const stopSound = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <PageTransition>
      <div className="relative">
        <div className="text-center mb-12">
          <AnimatedHeading text="The Sensory Archive" className="text-4xl md:text-5xl font-headline font-bold" />
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            An experiential library of materials. Hover to see and hear the essence of craftsmanship.
          </p>
        </div>

        <div className="absolute top-0 right-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const image = PlaceHolderImages.find(p => p.id === item.imageId);
            return (
              <motion.div
                key={item.id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-lg group"
                onMouseEnter={() => playSound(item.audioSrc)}
                onMouseLeave={stopSound}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                    data-ai-hint={image.imageHint}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-semibold text-white font-headline">{item.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
        <audio ref={audioRef} preload="auto" />
      </div>
    </PageTransition>
  );
};

export default SensoryArchiveGrid;
