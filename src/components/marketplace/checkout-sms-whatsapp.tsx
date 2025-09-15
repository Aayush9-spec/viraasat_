
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, MessageSquare } from 'lucide-react';

interface CheckoutSmsWhatsappProps {
  amount: number;
  method: string;
}

export default function CheckoutSmsWhatsapp({ amount, method }: CheckoutSmsWhatsappProps) {
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);

  const handleSend = () => {
    if (phone.length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Notification Sent!',
      description: `A confirmation for ${formatPrice(amount)} via ${method} has been sent to ${phone}.`,
    });
  };

  return (
    <div className="mb-6 rounded-lg border bg-secondary/30 p-4">
      <Label htmlFor="phone-notify" className="font-semibold">
        Get order updates on your phone
      </Label>
      <p className="text-sm text-muted-foreground mb-2">We'll send the amount to be paid and order status via SMS & WhatsApp.</p>
      <div className="flex gap-2">
        <Input
          id="phone-notify"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button variant="outline" onClick={handleSend} className="bg-background">
          Send
        </Button>
      </div>
    </div>
  );
}
