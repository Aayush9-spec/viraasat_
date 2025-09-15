'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, Loader2, StopCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/use-recorder';
import { useToast } from '@/hooks/use-toast';
import { processVoiceSearch } from '@/ai/flows/process-voice-search';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { startRecording, stopRecording, audioBlob, recordingState, isReady, resetRecording } = useRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    router.push(`/marketplace/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleVoiceSearch = async (blob: Blob) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await processVoiceSearch({ audioDataUri: base64Audio });
        toast({
          title: 'Voice Query Processed',
          description: `Looking for: "${result.transcribedText}"`,
        });

        // Build search params
        const params = new URLSearchParams();
        if (result.searchQuery) {
            params.set('q', result.searchQuery);
        }
        if (result.filters?.category) {
            params.set('category', result.filters.category);
        }
        if (result.filters?.color) {
            params.set('color', result.filters.color);
        }

        router.push(`/marketplace/search?${params.toString()}`);
        setQuery(result.transcribedText);

      } catch (error) {
        console.error('Error processing voice search:', error);
        toast({
          title: 'Voice Search Failed',
          description: 'Sorry, I couldn\'t understand that. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
        resetRecording();
      }
    };
  };

  useEffect(() => {
    if (audioBlob) {
      handleVoiceSearch(audioBlob);
    }
  }, [audioBlob]);


  const isRecording = recordingState === 'recording';
  const isLoading = isProcessing || (recordingState !== 'inactive' && recordingState !== 'recording');

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for 'blue pottery' or use your voice..."
        className="w-full bg-background/80 pl-10 pr-20"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isReady || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          <span className="sr-only">{isRecording ? 'Stop recording' : 'Start voice search'}</span>
        </Button>
      </div>
    </form>
  );
}
