'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { styleMyRoom } from '@/ai/flows/style-my-room';
import { Image as ImageIcon, Loader2, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import PageTransition from '../shared/page-transition';
import AnimatedHeading from '../shared/animated-heading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ViraasatStylistClientProps {
  allProducts: Product[];
}

export default function ViraasatStylistClient({ allProducts }: ViraasatStylistClientProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>('Monsoon Serenity');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStyledImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleStyleRoom = async () => {
    if (!originalImage) {
      toast({ title: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    if (selectedProductIds.length === 0) {
      toast({ title: 'Please select at least one product.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setStyledImage(null);
    try {
      const result = await styleMyRoom({
        roomImageDataUri: originalImage,
        productIds: selectedProductIds,
        theme,
      });
      setStyledImage(result.styledImageDataUri);
      toast({ title: 'Styling Complete!', description: 'Your personalized room has been generated.' });
    } catch (error) {
      console.error('Error styling room:', error);
      toast({
        title: 'Styling Failed',
        description: 'Could not generate the styled image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <AnimatedHeading text="Viraasat Stylist" className="text-4xl md:text-5xl font-headline font-bold" />
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Upload a photo of your space, select inspirational products, and let our AI stylist create a bespoke look for your home.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <Card className="lg:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">1. Configure Your Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="image-upload" className="font-semibold mb-2 block">Upload Your Room</Label>
                    <div className="relative flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-center text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag & drop
                            </p>
                        </div>
                        <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                 <div>
                    <Label className="font-semibold mb-2 block">Select Inspirational Products</Label>
                    <ScrollArea className="h-64 border rounded-md p-4">
                        <div className="space-y-4">
                        {allProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleProductSelect(product.id)}
                                className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors ${selectedProductIds.includes(product.id) ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}
                            >
                                <Image src={product.imageUrls[0].url} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </div>

                <div>
                  <Label htmlFor="theme-select" className="font-semibold mb-2 block">Choose a Theme</Label>
                   <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme-select">
                          <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Monsoon Serenity">Monsoon Serenity</SelectItem>
                          <SelectItem value="Desert Warmth">Desert Warmth</SelectItem>
                          <SelectItem value="Himalayan Calm">Himalayan Calm</SelectItem>
                          <SelectItem value="Coastal Breeze">Coastal Breeze</SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                <Button size="lg" className="w-full" onClick={handleStyleRoom} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Styling...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-4 w-4" /> Style My Room
                        </>
                    )}
                </Button>
            </CardContent>
          </Card>
          
          {/* Results Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">2. Your Space</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                        {originalImage ? (
                            <Image src={originalImage} alt="Your Room" width={1280} height={720} className="object-contain h-full w-full rounded-lg" />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImageIcon className="mx-auto h-12 w-12" />
                                <p>Your uploaded image will appear here.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

             <div className="text-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground animate-bounce" />
             </div>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        3. AI Styled Result
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                        {isLoading && (
                            <div className="text-center text-primary">
                                <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                                <p className="mt-4 font-semibold">Generating your bespoke interior...</p>
                                <p className="text-sm text-muted-foreground">This may take a moment.</p>
                            </div>
                        )}
                        {!isLoading && styledImage && (
                            <Image src={styledImage} alt="Styled Room" width={1280} height={720} className="object-cover h-full w-full rounded-lg" />
                        )}
                        {!isLoading && !styledImage && (
                            <div className="text-center text-muted-foreground">
                                <Wand2 className="mx-auto h-12 w-12" />
                                <p>Your styled room will appear here.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
