
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Crown, FileUp, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import PageTransition from '../shared/page-transition';
import AnimatedHeading from '../shared/animated-heading';
import { useToast } from '@/hooks/use-toast';

interface Material {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

interface PatronsCommissionClientProps {
  materials: Material[];
}

type CommissionData = {
    projectTitle: string;
    projectDescription: string;
    inspirationFiles: File[];
    selectedMaterials: string[];
};

export default function PatronsCommissionClient({ materials }: PatronsCommissionClientProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commissionData, setCommissionData] = useState<CommissionData>({
    projectTitle: '',
    projectDescription: '',
    inspirationFiles: [],
    selectedMaterials: [],
  });
  const { toast } = useToast();


  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommissionData(prev => ({ ...prev, inspirationFiles: [...prev.inspirationFiles, ...Array.from(e.target.files)] }));
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setCommissionData(prev => ({
        ...prev,
        selectedMaterials: prev.selectedMaterials.includes(materialId)
            ? prev.selectedMaterials.filter(id => id !== materialId)
            : [...prev.selectedMaterials, materialId]
    }));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
        title: "Request Submitted",
        description: "Our curation team will review your commission and be in touch shortly.",
    });
    nextStep();
  }

  const steps = [
    // Step 1: Project Vision
    {
      title: "Your Vision",
      subtitle: "Tell us about the piece you dream of creating.",
      content: (
        <div className="space-y-6">
          <Input 
            placeholder="Project Title (e.g., 'Family Crest Silver Locket')" 
            className="text-lg p-6"
            value={commissionData.projectTitle}
            onChange={e => setCommissionData(prev => ({...prev, projectTitle: e.target.value}))}
          />
          <Textarea 
            placeholder="Describe your vision in detail. Think about the style, function, mood, and any specific requirements you have..."
            className="min-h-[200px] text-base p-4"
            value={commissionData.projectDescription}
            onChange={e => setCommissionData(prev => ({...prev, projectDescription: e.target.value}))}
          />
        </div>
      ),
      isValid: commissionData.projectTitle.length > 3 && commissionData.projectDescription.length > 10,
    },
    // Step 2: Mood Board
    {
      title: "Mood & Inspiration",
      subtitle: "Upload images that capture the essence of your idea.",
      content: (
        <div>
          <div className="relative flex items-center justify-center w-full">
            <label htmlFor="inspiration-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-10 h-10 mb-2 text-muted-foreground" />
                <p className="mb-2 text-md text-center text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-muted-foreground">Sketches, photos, textures, color palettes</p>
              </div>
              <Input id="inspiration-upload" type="file" className="hidden" accept="image/*" multiple onChange={handleFileData} />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {commissionData.inspirationFiles.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image src={URL.createObjectURL(file)} alt={`Inspiration ${index + 1}`} fill className="object-cover rounded-md" />
                  </div>
              ))}
          </div>
        </div>
      ),
      isValid: true, // Optional upload
    },
     // Step 3: Materials
    {
      title: "Material Palette",
      subtitle: "Select the foundational materials for your piece.",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {materials.map(material => (
                <Card 
                    key={material.id} 
                    onClick={() => handleMaterialSelect(material.id)}
                    className={`cursor-pointer transition-all ${commissionData.selectedMaterials.includes(material.id) ? 'ring-2 ring-primary' : 'ring-0 hover:ring-2 ring-primary/50'}`}
                >
                    <div className="relative aspect-square">
                        <Image src={material.imageUrl} alt={material.name} fill className="object-cover rounded-t-lg" data-ai-hint={material.imageHint} />
                    </div>
                    <CardContent className="p-3">
                        <h4 className="font-semibold text-sm">{material.name}</h4>
                        <p className="text-xs text-muted-foreground">{material.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      ),
      isValid: commissionData.selectedMaterials.length > 0,
    },
    // Step 4: Confirmation
    {
        title: "Journey Begins",
        subtitle: "Thank you for entrusting us with your vision.",
        content: (
            <div className="text-center py-12 flex flex-col items-center">
                <Check className="w-16 h-16 text-green-500 bg-green-100 rounded-full p-2 mb-4" />
                <h3 className="text-2xl font-bold font-headline mb-2">Commission Request Received</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Our team is carefully reviewing your submission. We will reach out to you via email within the next 2-3 business days to discuss the next steps, including artisan matching and initial cost estimates.
                </p>
                <Button asChild className="mt-8">
                    <a href="/marketplace">Return to Marketplace</a>
                </Button>
            </div>
        ),
        isValid: true,
    }
  ];
  
  const currentStepData = steps[step];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <AnimatedHeading text="The Patron's Commission" className="text-4xl md:text-5xl font-headline font-bold" />
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Collaborate with our master artisans to bring a one-of-a-kind vision to life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardContent className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    { step < totalSteps -1 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-primary">Step {step + 1} of {totalSteps - 1}</span>
                                <span className="text-sm text-muted-foreground">{currentStepData.title}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}
                  
                  <h2 className="text-3xl font-headline font-bold mb-2">{currentStepData.title}</h2>
                  <p className="text-muted-foreground mb-8">{currentStepData.subtitle}</p>

                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex justify-between items-center">
                <Button variant="outline" onClick={prevStep} disabled={step === 0 || step === totalSteps - 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {step === totalSteps - 2 ? (
                    <Button 
                        size="lg" 
                        onClick={handleSubmit} 
                        disabled={!currentStepData.isValid || isSubmitting}
                        className="btn-gradient"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                            </>
                        ) : (
                             <>
                                <Send className="mr-2 h-5 w-5" /> Submit Commission
                            </>
                        )}
                       
                    </Button>
                ) : step < totalSteps - 2 ? (
                    <Button onClick={nextStep} disabled={!currentStepData.isValid}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
