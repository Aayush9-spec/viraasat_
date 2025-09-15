
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Loader2, PlayCircle, X } from "lucide-react";
import type { Artisan, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Logo } from "../shared/logo";

interface VirtualUnboxingClientProps {
  product: Product;
  artisan: Artisan;
  senderName: string;
  senderMessage: string;
  videoDataUri: string;
}

type UnboxingState = "start" | "unboxing" | "revealed";

export default function VirtualUnboxingClient({
  product,
  artisan,
  senderName,
  senderMessage,
  videoDataUri,
}: VirtualUnboxingClientProps) {
  const [state, setState] = useState<UnboxingState>("start");
  const [showVideo, setShowVideo] = useState(false);

  const handleUnbox = () => {
    setState("unboxing");
    setTimeout(() => setState("revealed"), 2500); // Corresponds to animation duration
  };

  const containerVariants = {
    start: { backgroundColor: "hsl(var(--background))" },
    revealed: { backgroundColor: "hsl(var(--muted))" },
  };

  const boxVariants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 2.5, rotate: 10 },
  };

  const lidVariants = {
    closed: { y: 0, rotateX: 0 },
    open: { y: -100, z: 200, rotateX: 65, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-1000"
      variants={containerVariants}
      animate={state}
      initial="start"
    >
      <header className="absolute top-6 left-6 z-20">
        <Link href="/marketplace">
          <Logo />
        </Link>
      </header>

      <AnimatePresence>
        {state === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-headline">A Gift For You</h1>
            <p className="text-muted-foreground mt-2 text-lg">from {senderName}</p>
            <Button size="lg" className="mt-8" onClick={handleUnbox}>
              <Gift className="mr-2 h-5 w-5" />
              Unbox Your Gift
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(state === "unboxing" || state === "revealed") && (
          <motion.div
            key="box-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute"
            style={{ perspective: 1000 }}
          >
            <motion.div
              variants={boxVariants}
              animate={state === "revealed" ? "open" : "closed"}
              transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              className="relative w-48 h-32 md:w-64 md:h-40 bg-card border shadow-lg"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Box Base */}
              <div className="absolute inset-0 bg-primary/10" />
              {/* Box Lid */}
              <motion.div
                variants={lidVariants}
                animate={state === "revealed" ? "open" : "closed"}
                className="absolute top-0 left-0 w-full h-full bg-primary/90 border-b-4 border-primary origin-bottom"
                style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {state === "revealed" && (
          <motion.div
            key="revealed-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
            className="w-full max-w-4xl z-10 p-8 grid md:grid-cols-2 gap-8 items-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 1.2, duration: 0.8, type: "spring" } }}
              className="relative aspect-square"
            >
              <Image 
                src={product.imageUrls[0].url} 
                alt={product.name}
                fill
                className="object-contain drop-shadow-2xl"
                data-ai-hint={product.imageUrls[0].hint}
              />
            </motion.div>
            <div className="text-left space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h2>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "{senderMessage}"
                <cite className="block not-italic font-semibold mt-2">— {senderName}</cite>
              </blockquote>
              <p className="text-sm">
                This beautiful piece was handcrafted by <span className="font-semibold">{artisan.shopName}</span>, a specialist in {artisan.craft}.
              </p>
              <div>
                <Button onClick={() => setShowVideo(true)}>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  A Message from the Creator
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl relative">
              <Button variant="ghost" size="icon" className="absolute -top-10 right-0 text-white" onClick={() => setShowVideo(false)}>
                <X />
              </Button>
              <div className="aspect-video">
                {videoDataUri ? (
                  <video src={videoDataUri} controls autoPlay className="w-full h-full object-cover rounded-t-lg" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                    <p>Loading message...</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-headline text-lg">A Thank You from {artisan.shopName}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
