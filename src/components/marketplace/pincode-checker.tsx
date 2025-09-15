
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { checkCodAvailability, getDeliveryEstimate } from '@/lib/cod-service';
import { Loader2, Truck, XCircle, CheckCircle } from 'lucide-react';
import { useUserPreferences } from '@/context/user-preferences-context';

export default function PincodeChecker() {
  const { pincode: globalPincode, setPincode: setGlobalPincode } = useUserPreferences();
  const [pincodeInput, setPincodeInput] = useState(globalPincode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [codResult, setCodResult] = useState<{ available: boolean; message: string } | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  const handleCheck = async (pincodeToCheck: string) => {
    if (pincodeToCheck.length !== 6) {
      setCodResult({ available: false, message: 'Please enter a valid 6-digit pincode.' });
      setDeliveryResult(null);
      return;
    }
    setIsLoading(true);
    setCodResult(null);
    setDeliveryResult(null);
    
    // Fetch results in parallel
    const [codAvailability, deliveryEstimate] = await Promise.all([
        checkCodAvailability(pincodeToCheck),
        getDeliveryEstimate(pincodeToCheck)
    ]);

    setCodResult(codAvailability);
    setDeliveryResult(deliveryEstimate.message);
    setGlobalPincode(pincodeToCheck); // Save the checked pincode globally
    setIsLoading(false);
  };

  // Automatically check if a global pincode exists on mount
  useEffect(() => {
    if (globalPincode) {
        setPincodeInput(globalPincode);
        handleCheck(globalPincode);
    }
  }, []);

  return (
    <div className="space-y-3">
      <label htmlFor="pincode-check" className="font-medium">
        Delivery Options
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="pincode-check"
          type="text"
          placeholder="Enter Pincode"
          value={pincodeInput}
          onChange={(e) => setPincodeInput(e.target.value)}
          maxLength={6}
          className="max-w-[150px]"
        />
        <Button variant="outline" onClick={() => handleCheck(pincodeInput)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
        </Button>
      </div>
      {isLoading && (
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking delivery options...</span>
        </div>
      )}
      {!isLoading && (deliveryResult || codResult) && (
        <div className="space-y-2 text-sm">
            {deliveryResult && (
                <div className="flex items-center gap-2 font-medium text-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>{deliveryResult}</span>
                </div>
            )}
            {codResult && (
                <div
                className={`flex items-center gap-2 font-medium ${
                    codResult.available ? 'text-green-600' : 'text-destructive'
                }`}
                >
                {codResult.available ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{codResult.message}</span>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
