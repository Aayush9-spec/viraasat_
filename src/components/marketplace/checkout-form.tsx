
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GooglePayLogo, PaytmLogo, PhonePeLogo, QRIcon, CodIcon } from '../shared/icons';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Loader2, AlertCircle, Gift } from 'lucide-react';
import Link from 'next/link';
import CheckoutSmsWhatsapp from './checkout-sms-whatsapp';
import type { FestivalCampaign } from '@/lib/types';
import { getCurrentFestivalCampaign } from '@/lib/festival-service';
import { Checkbox } from '../ui/checkbox';

const HIGH_VALUE_THRESHOLD = 5000;
const PARTIAL_PAYMENT_PERCENTAGE = 0.15; // 15%

export default function CheckoutForm() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('upi');
    const [activeCampaign, setActiveCampaign] = useState<FestivalCampaign | null>(null);
    const [giftWrap, setGiftWrap] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            const campaign = await getCurrentFestivalCampaign();
            setActiveCampaign(campaign);
        };
        fetchCampaign();
    }, []);

    const shippingCost = 0; // Free for now
    const isHighValueOrder = cartTotal > HIGH_VALUE_THRESHOLD;
    
    const partialPaymentAmount = isHighValueOrder ? cartTotal * PARTIAL_PAYMENT_PERCENTAGE : 0;
    const codAmountDue = isHighValueOrder ? cartTotal - partialPaymentAmount : cartTotal;
    const totalAmount = cartTotal + shippingCost;
    const paymentAmount = activeTab === 'cod' ? partialPaymentAmount : totalAmount;
    
    const formatPrice = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(value);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2500));
        clearCart();
        router.push('/marketplace/order-confirmation');
    };

    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-semibold">Your cart is empty.</p>
                <p className="text-muted-foreground mb-4">Add items to your cart to proceed to checkout.</p>
                <Button asChild>
                    <Link href="/marketplace">Continue Shopping</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Payment and Options */}
            <div>
                <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to marketplace
                </Link>

                {activeCampaign && (
                    <Card className="mb-8" style={{
                        borderColor: `hsl(${getComputedStyle(document.documentElement).getPropertyValue(activeCampaign.theme.primary.startsWith('#') ? '--primary' : activeCampaign.theme.primary)})`
                    }}>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Gift className="w-6 h-6"/>Gift Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="gift-wrap" checked={giftWrap} onCheckedChange={(checked) => setGiftWrap(!!checked)}/>
                                <label
                                    htmlFor="gift-wrap"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Add {activeCampaign.name} Gift Wrapping (Free)
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Choose your payment method</CardTitle>
                        <CardDescription>Select a secure way to complete your purchase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="upi">Pay with UPI</TabsTrigger>
                                <TabsTrigger value="card">Card</TabsTrigger>
                                <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                            </TabsList>
                            
                            {/* UPI Tab */}
                            <TabsContent value="upi" className="pt-6 space-y-6">
                                <CheckoutSmsWhatsapp amount={totalAmount} method="UPI" />
                                <div className="grid grid-cols-3 gap-4">
                                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handlePayment}>
                                        <GooglePayLogo className="h-8 w-8" />
                                        <span>Google Pay</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handlePayment}>
                                        <PhonePeLogo className="h-8 w-8" />
                                        <span>PhonePe</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handlePayment}>
                                        <PaytmLogo className="h-8 w-8" />
                                        <span>Paytm</span>
                                    </Button>
                                </div>
                                <div className="flex items-center my-4">
                                    <div className="flex-grow border-t border-muted"></div>
                                    <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground">Or</span>
                                    <div className="flex-grow border-t border-muted"></div>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-white rounded-lg border shadow-sm">
                                        <QRCode value={`upi://pay?pa=heritage@payment&pn=Heritage&am=${totalAmount}&cu=INR`} size={160} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Scan with any UPI app</p>
                                </div>
                            </TabsContent>

                            {/* Card Tab */}
                            <TabsContent value="card" className="pt-6">
                                <CheckoutSmsWhatsapp amount={totalAmount} method="Card" />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <div className="relative">
                                            <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry</Label>
                                            <Input id="expiry" placeholder="MM / YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="card-holder">Card Holder Name</Label>
                                        <Input id="card-holder" placeholder="Ananya Sharma" />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* COD Tab */}
                            <TabsContent value="cod" className="pt-6 space-y-6">
                                 <CheckoutSmsWhatsapp amount={codAmountDue} method="Cash on Delivery" />
                                 <div className="text-center">
                                    <CodIcon className="w-16 h-16 mx-auto text-primary" />
                                     <h3 className="text-xl font-bold font-headline mt-4">Pay on Delivery</h3>
                                     <p className="text-muted-foreground mt-1">Pay {formatPrice(codAmountDue)} in cash upon arrival.</p>
                                 </div>

                                {isHighValueOrder && (
                                    <div className="border-l-4 border-primary bg-primary/10 p-4 rounded-r-lg">
                                        <div className="flex">
                                            <div className="py-1">
                                                <AlertCircle className="h-5 w-5 text-primary mr-3" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Partial Pre-payment Required</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    For high-value orders, a non-refundable deposit of <strong>{formatPrice(partialPaymentAmount)}</strong> is required to confirm. This helps us protect our artisans from fraudulent orders.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Order Summary */}
            <div className="h-full">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <Image src={item.imageUrls[0].url} alt={item.name} width={48} height={48} className="rounded-md" />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-medium">{formatPrice(cartTotal)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Shipping</p>
                                <p className="font-medium">{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</p>
                            </div>
                            {giftWrap && activeCampaign && (
                                <div className="flex justify-between text-green-600">
                                    <p>{activeCampaign.name} Gift Wrap</p>
                                    <p className="font-medium">Free</p>
                                </div>
                            )}
                             {isHighValueOrder && activeTab === 'cod' && (
                                <>
                                 <div className="flex justify-between text-primary">
                                    <p>Partial Payment</p>
                                    <p className="font-medium">-{formatPrice(partialPaymentAmount)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">COD Amount Due</p>
                                    <p className="font-medium">{formatPrice(codAmountDue)}</p>
                                </div>
                                </>
                             )}
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <p>To Pay Now</p>
                            <p>{formatPrice(paymentAmount)}</p>
                        </div>
                        <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            {isProcessing ? 'Processing Payment...' : (activeTab === 'cod' ? `Confirm Order & Pay ${formatPrice(paymentAmount)}` : `Pay ${formatPrice(paymentAmount)}`)}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
