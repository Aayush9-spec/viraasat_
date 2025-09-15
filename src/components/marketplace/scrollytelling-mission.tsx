'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Package, Users, Leaf } from 'lucide-react';

const missionSteps = [
  {
    icon: Package,
    title: 'Sourcing the Finest Materials',
    description: 'We believe that exceptional craft begins with exceptional materials. We partner with suppliers who share our commitment to quality and ethical sourcing, ensuring every product is made from the best nature has to offer.',
    imageId: 'scrolly-1',
  },
  {
    icon: Users,
    title: 'Empowering Local Artisans',
    description: 'Our mission is to provide a platform for talented local artisans to showcase their skills and reach a broader audience. By connecting them with you, we help preserve traditional crafts and support communities.',
    imageId: 'scrolly-2',
  },
  {
    icon: Leaf,
    title: 'A Commitment to Sustainability',
    description: 'From reclaimed materials to eco-friendly processes, sustainability is at the core of our values. We strive to create products that are not only beautiful but also kind to our planet, ensuring a better future for generations to come.',
    imageId: 'scrolly-3',
  },
];

const ScrollytellingMission: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-step-index') || '0', 10);
          setActiveStep(index);
        }
      });
    }, observerOptions);

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="my-12 md:my-24 relative">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Our Mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="relative">
            {missionSteps.map((step, index) => (
                <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                data-step-index={index}
                className={cn(
                    'transition-opacity duration-500 ease-in-out min-h-[60vh] flex flex-col justify-center',
                    activeStep === index ? 'opacity-100' : 'opacity-30'
                )}
                >
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold">{step.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                </p>
                </div>
            ))}
            </div>

            {/* Right Column: Sticky Image */}
            <div className="h-screen sticky top-0 flex items-center justify-center">
                <div className="relative w-full aspect-[3/4] max-w-md rounded-xl overflow-hidden shadow-2xl">
                    {missionSteps.map((step, index) => {
                    const image = PlaceHolderImages.find((img) => img.id === step.imageId);
                    if (!image) return null;
                    return (
                        <Image
                        key={step.imageId}
                        src={image.imageUrl}
                        alt={step.title}
                        fill
                        data-ai-hint={image.imageHint}
                        className={cn(
                            'object-cover transition-opacity duration-1000 ease-in-out',
                            activeStep === index ? 'opacity-100' : 'opacity-0'
                        )}
                        />
                    );
                    })}
                </div>
            </div>
        </div>
    </section>
  );
};

export default ScrollytellingMission;
