
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  Palette,
  LayoutGrid
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "../shared/logo";
import { cn } from "@/lib/utils";

export default function ArtisanSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/artisan-dashboard", icon: LayoutGrid, label: "Dashboard" },
    { href: "/artisan-dashboard/orders", icon: ShoppingCart, label: "Orders", badge: "6" },
    { href: "/artisan-dashboard/products", icon: Package, label: "Products" },
    { href: "/artisan-dashboard/customers", icon: Users, label: "Customers" },
    { href: "/artisan-dashboard/my-story", icon: Palette, label: "My Story" },
  ];

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/marketplace" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span className="sr-only">Heritage</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  (pathname === item.href || (item.href === "/artisan-dashboard/products" && pathname.startsWith("/artisan-dashboard/products"))) && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle className="font-headline">Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
