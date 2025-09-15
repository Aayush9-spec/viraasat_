'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { enhanceProductImageQuality } from '@/ai/flows/enhance-product-image-quality';
import { Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface ImageEnhancerProps {
    form: UseFormReturn<any>;
}

export default function ImageEnhancer({ form }: ImageEnhancerProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEnhancedImage(null);
      form.setValue('image', '');
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        handleEnhance(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async (photoDataUri: string) => {
    setIsLoading(true);
    try {
      const result = await enhanceProductImageQuality({ photoDataUri });
      setEnhancedImage(result.enhancedPhotoDataUri);
      form.setValue('image', result.enhancedPhotoDataUri, { shouldValidate: true });
    } catch (error) {
      console.error('Error enhancing image:', error);
      toast({
        title: 'Enhancement Failed',
        description: 'Could not enhance the image. Please try another one.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="relative flex items-center justify-center w-full">
        <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-center text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
          </div>
          <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </Label>
      </div>

      {(originalImage || isLoading) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-center">Original</h4>
            <div className="aspect-square w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
              {originalImage ? (
                <Image src={originalImage} alt="Original" width={300} height={300} className="object-cover h-full w-full" />
              ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="space-y-2">
             <h4 className="text-sm font-semibold text-center flex items-center justify-center gap-1"><Sparkles className='w-4 h-4 text-primary'/>Enhanced</h4>
            <div className="aspect-square w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
              {isLoading && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
              {!isLoading && enhancedImage && <Image src={enhancedImage} alt="Enhanced" width={300} height={300} className="object-cover h-full w-full" />}
              {!isLoading && !enhancedImage && <Sparkles className="w-12 h-12 text-muted-foreground" />}
            </div>
          </div>
        </div>
      )}
      {form.formState.errors.image && <p className="text-sm font-medium text-destructive">{form.formState.errors.image.message as string}</p>}
    </div>
  );
}

// We need a Label component for the file input.
// Re-exporting from shadcn/ui to avoid conflicts.
const Label = ({ htmlFor, className, children }: {htmlFor: string, className: string, children: React.ReactNode}) => (
    <label htmlFor={htmlFor} className={className}>{children}</label>
)
