
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/context/cart-context';
import { artisans, products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { useMemo } from 'react';

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);

  const amountLeftForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const shippingProgress = (cartTotal / FREE_SHIPPING_THRESHOLD) * 100;

  const recommendedProducts = useMemo(() => {
    if (cartItems.length === 0) {
      return allProducts.slice(0, 2);
    }
    const cartCategories = new Set(cartItems.map(item => item.category));
    return allProducts
      .filter(p => !cartItems.some(item => item.id === p.id) && cartCategories.has(p.category))
      .slice(0, 2);
  }, [cartItems]);

  const getArtisanForProduct = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    return product ? artisans.find(a => a.id === product.artisanId) : undefined;
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-2xl font-headline">
            <ShoppingCart className="h-6 w-6" /> Your Cart
          </SheetTitle>
        </SheetHeader>
        <div className="p-6 pt-0">
          {amountLeftForFreeShipping > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                You're {formatPrice(amountLeftForFreeShipping)} away from free shipping!
              </p>
              <Progress value={shippingProgress} className="h-2" />
            </div>
          ) : (
            <p className="text-sm font-medium text-green-600">
              Congratulations! You've unlocked free shipping.
            </p>
          )}
        </div>
        <Separator />
        
        {cartItems.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {cartItems.map((item) => {
                const artisan = getArtisanForProduct(item.id);
                return (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.imageUrls[0].url}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint={item.imageUrls[0].hint}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/marketplace/products/${item.id}`} className="font-semibold hover:underline">
                          {item.name}
                        </Link>
                        {artisan && (
                          <p className="text-xs text-muted-foreground">
                            From the workshop of <button onClick={() => setIsCartOpen(false)}><Link href={`/marketplace/creators`} className="underline hover:text-primary">{artisan.shopName}</Link></button>
                          </p>
                        )}
                        <p className="font-semibold text-primary mt-1">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border rounded-md">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm">Find something special to add.</p>
          </div>
        )}
        
        <Separator />

        <div className="p-6 bg-muted/40">
          <h4 className="font-semibold mb-4">You might also like</h4>
          <div className="grid grid-cols-2 gap-4">
            {recommendedProducts.map(product => (
              <Link href={`/marketplace/products/${product.id}`} key={product.id} className="group" onClick={() => setIsCartOpen(false)}>
                <Image 
                  src={product.imageUrls[0].url}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover aspect-square mb-2 group-hover:opacity-80 transition-opacity"
                  data-ai-hint={product.imageUrls[0].hint}
                />
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-primary">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
        
        <SheetFooter className="p-6 bg-background border-t">
          <div className="w-full space-y-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Button size="lg" className="w-full" disabled={cartItems.length === 0} asChild>
              <Link href="/marketplace/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
