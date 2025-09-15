'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Gift, HeartHandshake, Loader2, Sparkles, Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { suggestGifts, SuggestGiftsOutput } from '@/ai/flows/suggest-gifts';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '../shared/page-transition';
import AnimatedHeading from '../shared/animated-heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Link from 'next/link';

interface GiftingConciergeClientProps {
  allProducts: Product[];
}

type Step = 'define' | 'results' | 'finalize';
type GiftSuggestion = SuggestGiftsOutput['suggestions'][0] & { product: Product };

export default function GiftingConciergeClient({ allProducts }: GiftingConciergeClientProps) {
  const [step, setStep] = useState<Step>('define');
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [tasteProfile, setTasteProfile] = useState('');
  const [priceRange, setPriceRange] = useState([20, 150]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | null>(null);

  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!recipient || !occasion) {
      toast({ title: 'Please select a recipient and occasion.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await suggestGifts({
        recipient,
        occasion,
        tasteProfile,
        priceRange: { min: priceRange[0], max: priceRange[1] },
      });
      
      const hydratedSuggestions = result.suggestions.map(s => ({
        ...s,
        product: allProducts.find(p => p.id === s.productId)!
      })).filter(s => s.product);

      setSuggestions(hydratedSuggestions);
      setStep('results');

    } catch (error) {
      console.error('Error getting gift suggestions:', error);
      toast({ title: 'Could not get suggestions. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectGiftAndProceed = (suggestion: GiftSuggestion) => {
    setSelectedGift(suggestion);
    setStep('finalize');
  }
  
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);

  const progressValue = step === 'define' ? 25 : step === 'results' ? 65 : 100;
  
  const renderDefineStep = () => (
    <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <Label className="font-semibold text-base mb-2 block">Who is the gift for?</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a recipient..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Spouse">Spouse / Partner</SelectItem>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Business Partner">Business Partner</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="font-semibold text-base mb-2 block">What's the occasion?</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select an occasion..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                        <SelectItem value="Thank You">Thank You</SelectItem>
                        <SelectItem value="Housewarming">Housewarming</SelectItem>
                        <SelectItem value="Just Because">Just Because</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div>
            <Label className="font-semibold text-base mb-2 block">Tell us about their taste (optional)</Label>
            <Textarea 
                value={tasteProfile}
                onChange={e => setTasteProfile(e.target.value)}
                placeholder="e.g., Loves minimalist design, earthy colors, silver jewelry, and enjoys gardening." 
                className="text-base min-h-[100px]"
            />
        </div>
        <div>
            <Label className="font-semibold text-base mb-2 block">Price Range</Label>
            <div className="flex justify-between font-medium text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Slider
                min={0}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={(value) => Array.isArray(value) && setPriceRange(value)}
            />
        </div>
        <div className="flex justify-end">
            <Button size="lg" onClick={handleGetSuggestions} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Find the Perfect Gift
            </Button>
        </div>
    </CardContent>
  );
  
  const renderResultsStep = () => (
    <CardContent>
        <p className="text-center mb-8 text-muted-foreground">Based on your preferences, here are a few ideas our concierge has curated for you.</p>
        <div className="grid md:grid-cols-3 gap-6">
            {suggestions.map((suggestion) => (
                <Card key={suggestion.productId} className="flex flex-col">
                    <CardHeader>
                        <div className="aspect-video relative mb-4">
                            <Image src={suggestion.product.imageUrls[0].url} alt={suggestion.product.name} fill className="rounded-md object-cover" />
                        </div>
                        <CardTitle className="font-headline text-xl">{suggestion.product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <blockquote className="border-l-2 pl-4 text-sm italic text-muted-foreground">"{suggestion.reason}"</blockquote>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-between items-center">
                        <span className="font-semibold text-lg text-primary">{formatPrice(suggestion.product.price)}</span>
                        <Button onClick={() => selectGiftAndProceed(suggestion)}>Select This Gift</Button>
                    </div>
                </Card>
            ))}
        </div>
        <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setStep('define')}><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Button>
        </div>
    </CardContent>
  );
  
  const renderFinalizeStep = () => (
     <CardContent>
         <div className="grid md:grid-cols-2 gap-8 items-start">
             <div>
                <h3 className="font-semibold text-lg mb-4">Your Selected Gift</h3>
                <Card>
                    <CardContent className="p-4 flex gap-4 items-center">
                        <Image src={selectedGift!.product.imageUrls[0].url} alt={selectedGift!.product.name} width={80} height={80} className="rounded-md object-cover" />
                        <div>
                            <p className="font-bold">{selectedGift!.product.name}</p>
                            <p className="text-primary font-semibold">{formatPrice(selectedGift!.product.price)}</p>
                        </div>
                    </CardContent>
                </Card>
             </div>
             <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Add a Personal Note</h3>
                    <Textarea placeholder={`Happy ${occasion}, Ananya! Hope you love this.`} className="min-h-[100px]" />
                </div>
                <div>
                     <h3 className="font-semibold text-lg mb-2">Gift Wrapping</h3>
                     <RadioGroup defaultValue="standard" className="flex gap-4">
                         <Label htmlFor="wrap-standard" className="cursor-pointer block border rounded-lg p-4 has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                            <RadioGroupItem value="standard" id="wrap-standard" className="sr-only" />
                             <p className="font-semibold">Standard Wrap</p>
                             <p className="text-sm text-muted-foreground">Elegant craft paper. Free.</p>
                         </Label>
                         <Label htmlFor="wrap-premium" className="cursor-pointer block border rounded-lg p-4 has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                            <RadioGroupItem value="premium" id="wrap-premium" className="sr-only" />
                             <p className="font-semibold">Premium Fabric Wrap</p>
                             <p className="text-sm text-muted-foreground">Furoshiki style. +$5.00</p>
                         </Label>
                     </RadioGroup>
                </div>
             </div>
         </div>
         <div className="mt-8 flex justify-between items-center">
            <Button variant="outline" onClick={() => setStep('results')}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Suggestions</Button>
            <Button size="lg" asChild>
                <Link href="/marketplace/order-confirmation">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
         </div>
     </CardContent>
  );


  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <AnimatedHeading text="The Gifting Concierge" className="text-4xl md:text-5xl font-headline font-bold" />
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Let us help you find a memorable, handcrafted gift for any occasion.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
                <CardHeader className="p-6">
                    <div className="mb-4">
                        <Progress value={progressValue} className="h-2" />
                    </div>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                        {step === 'define' && <><HeartHandshake className="w-6 h-6 text-primary"/><span>1. Tell Us About Them</span></>}
                        {step === 'results' && <><Sparkles className="w-6 h-6 text-primary"/><span>2. Curated Ideas</span></>}
                        {step === 'finalize' && <><Gift className="w-6 h-6 text-primary"/><span>3. Finishing Touches</span></>}
                    </CardTitle>
                </CardHeader>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {step === 'define' && renderDefineStep()}
                        {step === 'results' && renderResultsStep()}
                        {step === 'finalize' && renderFinalizeStep()}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
      </div>
    </PageTransition>
  );
}
