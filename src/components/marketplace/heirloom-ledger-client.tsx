
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Feather, Film, ImagePlus, Link as LinkIcon, Mic, Send, Share2, Upload } from 'lucide-react';

import type { Product, Artisan } from '@/lib/types';
import PageTransition from '../shared/page-transition';
import AnimatedHeading from '../shared/animated-heading';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';


interface LedgerEntry {
  id: string;
  type: 'purchase' | 'user' | 'audio' | 'video';
  date: string;
  title: string;
  text: string;
  imageUrl?: string;
  imageHint?: string;
}

interface HeirloomLedgerClientProps {
  product: Product;
  artisan: Artisan;
  initialEntries: LedgerEntry[];
}

export default function HeirloomLedgerClient({ product, artisan, initialEntries }: HeirloomLedgerClientProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAddEntry = () => {
    if (!newEntryTitle.trim() || !newEntryText.trim()) {
        toast({ title: "Please fill out both title and note.", variant: "destructive" });
        return;
    }
    const newEntry: LedgerEntry = {
        id: `entry-${Date.now()}`,
        type: 'user',
        date: new Date().toISOString(),
        title: newEntryTitle,
        text: newEntryText,
    };
    setEntries(prev => [...prev, newEntry]);
    setNewEntryTitle('');
    setNewEntryText('');
    toast({ title: "Memory Added", description: "Your new entry has been added to the ledger." });
  };
  
  const handleBequeath = () => {
    toast({
        title: "Legacy Shared",
        description: "A unique link to this ledger has been copied to your clipboard.",
    });
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <AnimatedHeading text="The Heirloom Ledger" className="text-4xl md:text-5xl font-headline font-bold" />
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                A living history of your cherished items, from the artisan's hands to the heart of your home.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item Details Column */}
          <aside className="lg:col-span-1 lg:sticky top-24 h-fit">
            <Card>
                <CardContent className="p-6">
                    <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden">
                        <Image src={product.imageUrls[0].url} alt={product.name} fill className="object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">{product.name}</h2>
                    <p className="text-muted-foreground">Category: {product.category}</p>
                    
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                        <Avatar>
                            <AvatarImage src={artisan.profileImageUrl.url} alt={artisan.shopName} />
                            <AvatarFallback>{artisan.shopName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold">Crafted by</p>
                            <p className="text-sm text-muted-foreground">{artisan.shopName}</p>
                        </div>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full mt-6" variant="outline"><Share2 className="mr-2 h-4 w-4" /> Bequeath Ledger</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Pass on the Legacy</DialogTitle>
                                <DialogDescription>
                                    You can transfer this Heirloom Ledger to a new owner, preserving its history for the next generation. Enter their email to send an invitation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input placeholder="New owner's email address" type="email" />
                                <Textarea placeholder="Add a personal message (optional)" />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={handleBequeath}>Send Invitation</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
          </aside>

          {/* Timeline Column */}
          <main className="lg:col-span-2">
            <div className="space-y-8">
                {/* New Entry Form */}
                <Card className="bg-muted/30">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="font-headline text-xl font-semibold">Add a New Memory</h3>
                         <div className="space-y-2">
                            <Label htmlFor="entry-title">Title</Label>
                            <Input id="entry-title" placeholder="e.g., 'A gift for our anniversary'" value={newEntryTitle} onChange={(e) => setNewEntryTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry-text">Note</Label>
                            <Textarea id="entry-text" placeholder="Share a story or a memory associated with this moment..." value={newEntryText} onChange={(e) => setNewEntryText(e.target.value)} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" disabled><ImagePlus className="h-4 w-4"/></Button>
                                <Button variant="outline" size="icon" disabled><Mic className="h-4 w-4"/></Button>
                                <Button variant="outline" size="icon" disabled><Film className="h-4 w-4"/></Button>
                            </div>
                            <Button onClick={handleAddEntry}><Send className="mr-2 h-4 w-4" /> Add to Ledger</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Entries */}
                <AnimatePresence>
                {entries.slice().reverse().map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="relative flex flex-col items-center">
                            <div className="z-10 bg-background h-12 w-12 rounded-full border-2 border-primary flex items-center justify-center">
                                {entry.type === 'purchase' ? <LinkIcon className="h-5 w-5 text-primary" /> : <Feather className="h-5 w-5 text-primary" />}
                            </div>
                            <div className="flex-1 w-px bg-border -mt-1"></div>
                        </div>
                        <div className="flex-1 pb-8">
                            <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(entry.date)}</p>
                            <h4 className="font-headline text-2xl font-bold mt-1">{entry.title}</h4>
                            <p className="mt-2 text-muted-foreground">{entry.text}</p>
                            {entry.imageUrl && (
                                <div className="relative aspect-video w-full mt-4 rounded-lg overflow-hidden">
                                    <Image src={entry.imageUrl} alt={entry.title} fill className="object-cover" data-ai-hint={entry.imageHint}/>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
