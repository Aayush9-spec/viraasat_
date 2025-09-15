import Link from "next/link";
import { Twitter, Facebook, Instagram, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { products } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FadeInOnScroll from "../shared/fade-in-on-scroll";

export default function MarketplaceFooter() {
  const footerProduct1 = products.find(p => p.id === 'prod-2');
  const footerProduct2 = products.find(p => p.id === 'prod-4');

  return (
    <footer className="bg-gradient-to-t from-teal-100 via-teal-50 to-transparent pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {footerProduct1 && (
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={footerProduct1.imageUrls[0].url}
                    alt={footerProduct1.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={footerProduct1.imageUrls[0].hint}
                />
            </div>
          )}

          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold font-headline mb-2">Hand-picked for Indian Artisans</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">Quality goods from passionate creators.</p>

            <FadeInOnScroll staggerChildren className="w-full max-w-md">
                <h4 className="font-semibold mb-2" style={{ transitionDelay: '0ms' }}>Subscription</h4>
                <p className="text-sm text-muted-foreground mb-4" style={{ transitionDelay: '150ms' }}>Stay updated with our latest collections.</p>
                <form className="flex gap-2" style={{ transitionDelay: '300ms' }}>
                    <Input type="email" placeholder="Your email..." className="flex-grow"/>
                    <Button type="submit" className="bg-accent hover:bg-accent/80 text-accent-foreground">Subscribe</Button>
                </form>
            </FadeInOnScroll>
          </div>
          
          {footerProduct2 && (
             <div className="group relative overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={footerProduct2.imageUrls[0].url}
                    alt={footerProduct2.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={footerProduct2.imageUrls[0].hint}
                />
            </div>
          )}
        </div>

        <div className="mt-8 py-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5"/></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5"/></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5"/></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><ShoppingCart className="h-5 w-5"/></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
