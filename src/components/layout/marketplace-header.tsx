
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronDown,
  ShoppingCart,
  RadioTower,
  Gift,
  Box,
  Crown,
  BookUser,
  HeartHandshake,
  Feather,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "../shared/logo";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import SearchBar from "../marketplace/search-bar";
import { useFeatherlight } from "@/context/featherlight-context";
import { Badge } from "../ui/badge";

export default function MarketplaceHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  const { mode, setMode, isFeatherlightActive } = useFeatherlight();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 80);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
        "sticky top-0 flex items-center gap-4 px-4 md:px-6 z-50 transition-all duration-300",
        isScrolled 
          ? "h-16 border-b bg-background/80 backdrop-blur-sm shadow-sm" 
          : "h-20 bg-transparent border-b-0"
      )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link
            href="/marketplace"
            className="flex items-center gap-2 text-lg font-semibold md:text-base shrink-0"
          >
          <Logo />
           {isFeatherlightActive && (
              <Badge variant="outline" className="ml-2 border-primary text-primary animate-pulse hidden sm:flex">
                <Feather className="w-3 h-3 mr-1"/> Featherlight
              </Badge>
            )}
        </Link>
        <div className="w-full max-w-md hidden md:block">
            <SearchBar />
        </div>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground px-2 hover:bg-transparent hover:text-foreground">
                Explore <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/marketplace/creators">Artisan Map</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/marketplace/sensory-archive">Sensory Archive</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/marketplace/vignettes">Vignettes</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/marketplace/stylist">Heritage Stylist</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/marketplace/heirloom-ledger" className="flex items-center gap-2">
                  <BookUser className="h-4 w-4" /> Heirloom Ledger
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/marketplace/gifting-concierge" className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" /> Gifting Concierge
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/marketplace/patrons-commission" className="flex items-center gap-2 text-primary hover:text-primary">
                  <Crown className="h-4 w-4" /> Patron's Commission
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/marketplace/legacy-box"
            className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
          >
            <Box className="h-4 w-4" />
            <span className="hidden lg:inline">Legacy Box</span>
          </Link>
          <Link
            href="/marketplace/live-showcase"
            className="text-primary transition-colors hover:text-primary/80 flex items-center gap-2 font-semibold"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            Live
          </Link>
        </nav>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Featherlight Mode</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={mode} onValueChange={(value) => setMode(value as 'on' | 'off' | 'auto')}>
                        <DropdownMenuRadioItem value="auto">Auto-detect</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="on">On</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="off">Off</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

           <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
          <Button asChild className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Login</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/marketplace"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Logo />
                  <span className="sr-only">Heritage</span>
                </Link>
                <div className="w-full">
                    <SearchBar />
                </div>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">Home</Link>
                <Link href="/marketplace/creators" className="text-muted-foreground hover:text-foreground">Artisan Map</Link>
                <Link href="/marketplace/sensory-archive" className="text-muted-foreground hover:text-foreground">Sensory Archive</Link>
                <Link href="/marketplace/vignettes" className="text-muted-foreground hover:text-foreground">Vignettes</Link>
                <Link href="/marketplace/stylist" className="text-muted-foreground hover:text-foreground">Heritage Stylist</Link>
                <Link href="/marketplace/heirloom-ledger" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <BookUser className="h-4 w-4" /> Heirloom Ledger
                </Link>
                 <Link href="/marketplace/gifting-concierge" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" /> Gifting Concierge
                </Link>
                <Link href="/marketplace/legacy-box" className="text-muted-foreground hover:text-foreground">The Legacy Box</Link>
                <Link href="/marketplace/live-showcase" className="text-primary font-semibold flex items-center gap-2">
                    <RadioTower className="h-4 w-4" /> Live Showcase
                </Link>
                <Link href="/marketplace/unboxing/mock-order" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <Gift className="h-4 w-4" /> Unbox Gift (Demo)
                </Link>
                <Link href="/marketplace/patrons-commission" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <Crown className="h-4 w-4" /> Patron's Commission
                </Link>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/">Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
