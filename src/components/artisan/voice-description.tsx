
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRecorder } from '@/hooks/use-recorder';
import { generateProductDescriptionsFromVoice } from '@/ai/flows/generate-product-descriptions-from-voice';
import { Mic, StopCircle, Trash2, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { suggestTextEnhancements } from '@/ai/flows/suggest-text-enhancements';
import { Card, CardContent } from '../ui/card';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

interface VoiceDescriptionProps {
    form: UseFormReturn<any>;
    field: ControllerRenderProps<any, 'description'>;
}

export default function VoiceDescription({ form, field }: VoiceDescriptionProps) {
  const { startRecording, stopRecording, resetRecording, audioBlob, recordingState, isReady } = useRecorder();
  const [originalDescription, setOriginalDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranscribe = async (blob: Blob) => {
    setIsLoading(true);
    setOriginalDescription('');
    form.setValue('description', '', { shouldValidate: true });
    
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await generateProductDescriptionsFromVoice({ audioDataUri: base64Audio });
        setOriginalDescription(result.originalDescription);
        form.setValue('description', result.enhancedDescription, { shouldValidate: true });
        toast({
          title: 'Transcription Complete',
          description: 'Your voice description has been transcribed and enhanced.',
        });
      } catch (error) {
        console.error('Error with voice description:', error);
        toast({
          title: 'Transcription Failed',
          description: 'Could not process the audio. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleTextEnhance = async () => {
      const currentDesc = form.getValues('description');
      if(!currentDesc) {
        toast({ title: "Nothing to enhance", description: "Please type or record a description first.", variant: 'destructive'});
        return;
      };

      setIsLoading(true);
      try {
        const result = await suggestTextEnhancements({productDescription: currentDesc});
        form.setValue('description', result.enhancedDescription, { shouldValidate: true });
        // Keep the original text if it wasn't already set
        if (!originalDescription) {
            setOriginalDescription(currentDesc);
        }
      } catch (error) {
        console.error('Error enhancing text:', error);
        toast({
          title: 'Enhancement Failed',
          description: 'Could not enhance the text. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    if (audioBlob) {
      handleTranscribe(audioBlob);
    }
  }, [audioBlob]);

  const handleReset = () => {
    resetRecording();
    setOriginalDescription('');
    form.setValue('description', '', { shouldValidate: true });
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        {recordingState !== 'recording' ? (
          <Button
            type="button"
            onClick={startRecording}
            disabled={!isReady || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Mic className="mr-2 h-4 w-4" />
            Record
          </Button>
        ) : (
          <Button type="button" onClick={stopRecording} variant="destructive" className="animate-pulse">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop
          </Button>
        )}
        <Button type="button" variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
        <div className="text-sm text-muted-foreground">
          {recordingState === 'recording' && 'Recording...'}
          {isLoading && 'Processing...'}
          {recordingState === 'inactive' && !isLoading && 'Ready to record'}
        </div>
      </div>
      
      {originalDescription && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description-original">Original Transcription</Label>
            <Textarea
              id="description-original"
              value={originalDescription}
              readOnly
              className="min-h-[120px] bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description-enhanced" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Enhanced Description
            </Label>
            <Card className="relative min-h-[120px] bg-secondary/50">
              {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
              )}
              <CardContent className="p-0">
                  <Textarea
                    id="description-enhanced"
                    placeholder="AI-enhanced text will appear here."
                    className="min-h-[120px] bg-transparent border-0"
                    readOnly={isLoading}
                    {...field}
                  />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {!originalDescription && (
         <div className="relative">
            <Textarea
                placeholder="Describe your product or use the recorder..."
                className="min-h-[120px] pr-28"
                {...field}
            />
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleTextEnhance} 
                disabled={isLoading || !field.value}
                className="absolute right-2 bottom-2"
            >
                <Wand2 className="mr-2 h-4 w-4" />
                Enhance
            </Button>
         </div>
      )}
    </div>
  );
}

const Label = ({ htmlFor, className, children }: {htmlFor: string, className?: string, children: React.ReactNode}) => (
    <label htmlFor={htmlFor} className={`font-medium ${className}`}>{children}</label>
)
