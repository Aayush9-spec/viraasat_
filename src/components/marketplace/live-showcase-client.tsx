'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artisan, Product } from '@/lib/types';
import CountdownTimer from './countdown-timer';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Send, ShoppingBag, Video, VideoOff } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '../ui/input';

type ShowcaseState = 'PRE_LIVE' | 'LIVE' | 'POST_LIVE';

interface LiveShowcaseClientProps {
  artisan: Artisan;
  exclusiveProducts: Product[];
  eventTimeISO: string;
}

const mockMessages = [
    { user: "Elena", message: "This is beautiful! What kind of clay is that?" },
    { user: "Raj", message: "Wow, the precision is incredible." },
    { user: "Chloe", message: "I just bought the Azure Pot! So excited! 😍" },
    { user: "Moderator", message: "Welcome everyone! Feel free to ask questions.", isMod: true },
    { user: "Sam", message: "How long does it take to fire one piece?" },
];

export default function LiveShowcaseClient({ artisan, exclusiveProducts, eventTimeISO }: LiveShowcaseClientProps) {
  const [currentState, setCurrentState] = useState<ShowcaseState>('PRE_LIVE');
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const checkEventStatus = () => {
      const now = new Date();
      const eventTime = new Date(eventTimeISO);
      const eventEndTime = new Date(eventTime.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

      if (now < eventTime) {
        setCurrentState('PRE_LIVE');
      } else if (now >= eventTime && now < eventEndTime) {
        setCurrentState('LIVE');
      } else {
        setCurrentState('POST_LIVE');
      }
    };

    checkEventStatus();
    const interval = setInterval(checkEventStatus, 1000);

    return () => clearInterval(interval);
  }, [eventTimeISO]);
  
  // Simulate new messages and sales
  useEffect(() => {
    if (currentState !== 'LIVE') return;
    
    const saleToastInterval = setInterval(() => {
        const randomProduct = exclusiveProducts[Math.floor(Math.random() * exclusiveProducts.length)];
        toast({
            title: "🎉 Item Sold!",
            description: `Someone just purchased ${randomProduct.name}.`,
        });
    }, 15000); // every 15 seconds

    return () => clearInterval(saleToastInterval);

  }, [currentState, exclusiveProducts, toast]);


  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to Cart!',
      description: `${product.name} is waiting for you.`,
    });
  };

  const PreLiveState = () => {
    const showcaseImage = PlaceHolderImages.find(p => p.id === 'live-showcase-promo');
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="font-headline text-primary">Artisan in Residence</p>
          <h1 className="text-4xl md:text-6xl font-bold font-headline mt-2 mb-4">Live from the Workshop</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join us for an exclusive live demonstration with {artisan.shopName}, master of {artisan.craft}.
            Get a behind-the-scenes look at the craft and a chance to purchase limited-edition pieces.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="my-8">
            <CountdownTimer targetDate={eventTimeISO} />
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.8, duration: 0.7 }}
            className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center bg-card p-8 rounded-2xl shadow-xl"
        >
            <div className="text-left">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                    <AvatarImage src={artisan.profileImageUrl.url} alt={artisan.shopName} />
                    <AvatarFallback>{artisan.shopName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold font-headline">{artisan.shopName}</h2>
                <p className="text-muted-foreground mt-2">{artisan.bio}</p>
                <p className="mt-4">{artisan.story}</p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden">
                {showcaseImage && (
                    <Image src={showcaseImage.imageUrl} alt={artisan.shopName} width={800} height={450} className="object-cover w-full h-full" data-ai-hint={showcaseImage.imageHint} />
                )}
            </div>
        </motion.div>
      </div>
    );
  };

  const LiveState = () => (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-black">
      {/* Video Player */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        {/* In a real app, this would be a <video> tag with a live stream source. We'll use a placeholder. */}
        <div className="aspect-video w-full bg-background flex flex-col items-center justify-center text-muted-foreground">
            <Video className="w-16 h-16 mb-4"/>
            <p>Live Stream Placeholder</p>
            <p className="text-sm">In a real application, this would be a live video feed.</p>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-white font-semibold bg-black/50 px-2 py-1 rounded-md text-sm">LIVE</span>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-card border-l flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold font-headline">Live with {artisan.shopName}</h2>
          <p className="text-sm text-muted-foreground">{artisan.craft} Demonstration</p>
        </div>
        
        {/* Exclusive Products */}
        <div className="p-4 border-b">
            <h3 className="font-semibold mb-2 text-primary">Exclusive Collection</h3>
            <div className="space-y-3">
                {exclusiveProducts.map(product => (
                    <div key={product.id} className="flex gap-3 items-center">
                        <Image src={product.imageUrls[0].url} alt={product.name} width={50} height={50} className="rounded-md aspect-square object-cover" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}</p>
                        </div>
                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                            <ShoppingBag className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat/Q&A */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="font-semibold p-4 pb-2">Community Q&A</h3>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4">
                {mockMessages.map((msg, i) => (
                    <div key={i} className={`text-sm ${msg.isMod ? 'bg-secondary/80 p-2 rounded-lg' : ''}`}>
                        <span className={`font-bold ${msg.isMod ? 'text-primary' : ''}`}>{msg.user}:</span>
                        <span className="ml-2 text-muted-foreground">{msg.message}</span>
                    </div>
                ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            <div className="relative">
                <Input placeholder="Ask a question..." className="pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4"/>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PostLiveState = () => (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <VideoOff className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-4xl font-bold font-headline">The Live Event has Ended</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Thank you for joining our session with {artisan.shopName}.
              You can explore more of their work in our marketplace.
          </p>
          <Button asChild className="mt-8">
              <Link href="/marketplace">Continue Exploring</Link>
          </Button>
      </div>
  );


  return (
    <AnimatePresence mode="wait">
        <motion.div
            key={currentState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {currentState === 'PRE_LIVE' && <PreLiveState />}
            {currentState === 'LIVE' && <LiveState />}
            {currentState === 'POST_LIVE' && <PostLiveState />}
        </motion.div>
    </AnimatePresence>
  );
}
