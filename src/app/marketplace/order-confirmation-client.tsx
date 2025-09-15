"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, Rocket, Home, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Artisan, Product } from "@/lib/types";
import { Logo } from "../shared/logo";

interface OrderConfirmationClientProps {
  product: Product;
  artisan: Artisan;
  userLocation: { name: string; x: number; y: number };
  videoDataUri: string;
}

const timelineSteps = [
  { text: "Hand-packed by the artisan", icon: Package },
  { text: "Journeying to you", icon: Rocket },
  { text: "Arrival", icon: Home },
];

export default function OrderConfirmationClient({
  product,
  artisan,
  userLocation,
  videoDataUri,
}: OrderConfirmationClientProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = timelineSteps.map((_, index) =>
      setTimeout(() => {
        setActiveStep(index + 1);
      }, (index + 1) * 2500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const pathD = `M${artisan.location.x},${artisan.location.y} Q${(artisan.location.x + userLocation.x) / 2 - 50},${(artisan.location.y + userLocation.y) / 2} ${userLocation.x},${userLocation.y}`;

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden">
      <header className="absolute top-6 left-6">
        <Link href="/marketplace">
            <Logo />
        </Link>
      </header>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Your Viraasat Journey Begins
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Thank you for your order. A piece of tradition is on its way to you.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Map Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative lg:col-span-2 h-[400px] lg:h-[500px] border rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 1000 1200" className="w-full h-full opacity-30">
            <path d="M466.1 928.2l-3.5-3.4-1.3-4.2-3.8-1.5-3.4-4.8-1-5.1-4.8-3.1-3.1-5.1-1.3-4.5-3.8-2.1-2.1-4.2-2.1-5.8-3.5-2.8-2.4-5.1-2.1-5.1 1.8-4.5 1.1-2.8 5.6-3.1 3.1-3.5 6.3-4.5 3.1-3.1 4.2-1.8 4.2-5.1 1-3.8 2.8-1.8 1.8-3.5 1.5-2.8 1-3.8-1.3-4.8-3.5-4.2-1.8-2.8-3.1-5.5-1.5-4.5-1.8-3.1-2.4-4.8-1-3.8-1-3.1-2.1-4.5-1.3-3.8-1.5-3.5-2.4-2.8-1.8-5.1-3.1-2.8-2.4-3.1-1-3.5-1.8-3.1-3.1-3.1-1-2.8-1.3-2.4-3.8-3.1-1.8-1.8-1.5-2.8-3.1-3.1-1.8-2.1-2.1-1.8-1.8-1-3.1-2.8-1.5-2.1-1.5-1.8-2.1-2.1-1.3-2.1-1.5-1.8-1-1.8-1-1.5-1-1.3-1.3-1-1.3-1.3-1-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
            <path d="M433.9 133.2l4.8 1.5 2.1 2.8 1.8 4.2 3.8 2.8 2.4 2.8 2.4 4.5 3.1 3.1 1.8 2.8 2.8 3.5 1.5 3.8 2.4 2.1 2.1 3.1 1.3 3.1 1.5 2.8 1.5 3.5 1 2.8 1.3 3.1 1 2.4 1 2.1 1 1.8 1.3 1.5 1 1.3 1 1.3 1.3 1 1.3 1.3 1.3 1 1.3 1.3 1.3 1 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
          </svg>
          <svg className="absolute w-full h-full" viewBox="0 0 1000 1200">
            <g>
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="16"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin="2s"
                />
              </motion.path>
              
              <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
              >
                <circle cx={artisan.location.x} cy={artisan.location.y} r="6" fill="hsl(var(--primary))" />
                <text x={artisan.location.x + 10} y={artisan.location.y + 4} className="text-sm font-semibold fill-current">{artisan.location.name}</text>
              </motion.g>

              <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
              >
                <circle cx={userLocation.x} cy={userLocation.y} r="6" fill="hsl(var(--accent))" />
                <text x={userLocation.x + 10} y={userLocation.y + 4} className="text-sm font-semibold fill-current">{userLocation.name}</text>
              </motion.g>
            </g>
          </svg>
           <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, type: 'spring', stiffness: 100 }}
              className="absolute p-2 bg-background/80 rounded-lg shadow-lg flex items-center gap-2"
              style={{ top: `${(artisan.location.y + userLocation.y)/2}%`, left: `${(artisan.location.x + userLocation.x)/2}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Image src={product.imageUrls[0].url} alt={product.name} width={40} height={40} className="rounded-md" />
              <p className="font-semibold text-sm pr-2">{product.name}</p>
            </motion.div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col gap-6"
        >
          {/* Thank You Video */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-headline text-xl mb-3">A Message from the Creator</h3>
            <div className="aspect-video bg-black rounded-md flex items-center justify-center">
              {videoDataUri ? (
                <video src={videoDataUri} controls autoPlay muted loop className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary"/>
                  <p>Generating your personalized thank you message...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Timeline */}
          <div>
            <h3 className="font-headline text-xl mb-4">Your Order's Journey</h3>
            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center
                      ${activeStep > index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <AnimatePresence>
                        {activeStep > index ? (
                           <motion.div initial={{scale: 0}} animate={{scale: 1}}>
                            <CheckCircle className="w-5 h-5" />
                           </motion.div>
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <p className={`font-medium ${activeStep > index ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12"
      >
        <Button asChild>
          <Link href="/marketplace">Continue Exploring</Link>
        </Button>
      </motion.div>
    </div>
  );
}
