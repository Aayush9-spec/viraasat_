"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Artisan, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "@/components/marketplace/product-card";

interface ArtisanMapProps {
  artisans: Artisan[];
  products: Product[];
}

export default function ArtisanMap({ artisans, products }: ArtisanMapProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [hoveredArtisan, setHoveredArtisan] = useState<Artisan | null>(null);

  const handleSelectArtisan = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
  };

  const handleClosePanel = () => {
    setSelectedArtisan(null);
  };

  const artisanProducts = selectedArtisan
    ? products.filter((p) => p.artisanId === selectedArtisan.id)
    : [];

  const viewBoxWidth = 1000;
  const viewBoxHeight = 1200;

  const getTransform = () => {
    if (selectedArtisan?.location) {
      const { x, y } = selectedArtisan.location;
      const scale = 2; // Zoom factor
      const translateX = viewBoxWidth / 2 - x * scale;
      const translateY = viewBoxHeight / 2 - y * scale;
      return `translate(${translateX}, ${translateY}) scale(${scale})`;
    }
    return "translate(0, 0) scale(1)";
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      <div className="w-full h-full">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: getTransform() }}
        >
          <g>
            {/* Simplified SVG Map of India - Paths */}
            <path d="M466.1 928.2l-3.5-3.4-1.3-4.2-3.8-1.5-3.4-4.8-1-5.1-4.8-3.1-3.1-5.1-1.3-4.5-3.8-2.1-2.1-4.2-2.1-5.8-3.5-2.8-2.4-5.1-2.1-5.1 1.8-4.5 1.1-2.8 5.6-3.1 3.1-3.5 6.3-4.5 3.1-3.1 4.2-1.8 4.2-5.1 1-3.8 2.8-1.8 1.8-3.5 1.5-2.8 1-3.8-1.3-4.8-3.5-4.2-1.8-2.8-3.1-5.5-1.5-4.5-1.8-3.1-2.4-4.8-1-3.8-1-3.1-2.1-4.5-1.3-3.8-1.5-3.5-2.4-2.8-1.8-5.1-3.1-2.8-2.4-3.1-1-3.5-1.8-3.1-3.1-3.1-1-2.8-1.3-2.4-3.8-3.1-1.8-1.8-1.5-2.8-3.1-3.1-1.8-2.1-2.1-1.8-1.8-1-3.1-2.8-1.5-2.1-1.5-1.8-2.1-2.1-1.3-2.1-1.5-1.8-1-1.8-1-1.5-1-1.3-1.3-1-1.3-1.3-1-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1.3-1-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.3-1.z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
            <path d="M433.9 133.2l4.8 1.5 2.1 2.8 1.8 4.2 3.8 2.8 2.4 2.8 2.4 4.5 3.1 3.1 1.8 2.8 2.8 3.5 1.5 3.8 2.4 2.1 2.1 3.1 1.3 3.1 1.5 2.8 1.5 3.5 1 2.8 1.3 3.1 1 2.4 1 2.1 1 1.8 1.3 1.5 1 1.3 1 1.3 1.3 1 1.3 1.3 1.3 1 1.3 1.3 1.3 1 1.3 1.3 1.3 1.3 1.3 1 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.3 1.z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
          </g>

          {/* Artisan Points */}
          {artisans.map((artisan) => (
            <g
              key={artisan.id}
              transform={`translate(${artisan.location.x}, ${artisan.location.y})`}
              className="cursor-pointer"
              onClick={() => handleSelectArtisan(artisan)}
              onMouseEnter={() => setHoveredArtisan(artisan)}
              onMouseLeave={() => setHoveredArtisan(null)}
            >
              <circle
                r="10"
                fill="hsl(var(--primary))"
                className="animate-pulse"
              />
              <circle
                r="5"
                fill="hsl(var(--primary-foreground))"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Hover Tooltip */}
      {hoveredArtisan && !selectedArtisan && (
        <div
          className="absolute pointer-events-none p-2 text-sm bg-background/80 border border-border rounded-md shadow-lg"
          style={{
            left: `${hoveredArtisan.location.x}px`,
            top: `${hoveredArtisan.location.y}px`,
            transform: "translate(-50%, -150%)",
          }}
        >
          <p className="font-bold">{hoveredArtisan.shopName}</p>
          <p className="text-muted-foreground">{hoveredArtisan.craft}</p>
        </div>
      )}

      {/* Story Panel */}
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full md:w-[450px] bg-background/90 backdrop-blur-sm border-l border-border shadow-2xl transition-transform duration-700 ease-in-out z-10",
          selectedArtisan ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          {selectedArtisan && (
            <div className="p-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClosePanel}
                className="absolute top-2 right-2"
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={selectedArtisan.profileImageUrl.url}
                  alt={selectedArtisan.shopName}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-primary"
                  data-ai-hint={selectedArtisan.profileImageUrl.hint}
                />
                <div>
                  <h2 className="text-2xl font-bold font-headline">
                    {selectedArtisan.shopName}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4"/>{selectedArtisan.location.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-semibold">{selectedArtisan.bio}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedArtisan.story}
                </p>
              </div>

              <h3 className="text-xl font-headline font-bold mb-4">
                Products by {selectedArtisan.shopName}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {artisanProducts.length > 0 ? (
                  artisanProducts.map((product) => (
                    <Link href={`/marketplace/products/${product.id}`} key={product.id}>
                        <div className="flex items-center gap-4 p-2 border rounded-lg hover:bg-muted transition-colors">
                            <Image
                                src={product.imageUrls[0].url}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover aspect-square"
                                data-ai-hint={product.imageUrls[0].hint}
                            />
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-primary">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(product.price)}</p>
                            </div>
                        </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No products found for this artisan yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

       {/* Title & Legend */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="text-3xl font-bold font-headline text-foreground">Meet the Artisans</h1>
        <p className="text-muted-foreground">Click on a point to explore their stories.</p>
      </div>
    </div>
  );
}
