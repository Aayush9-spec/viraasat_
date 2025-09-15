
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTable } from "@/components/artisan/product-table";
import { products } from "@/lib/data";

export default function ProductsPage() {
  const artisanProducts = products.filter(p => p.artisanId === 'artisan-1');

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/artisan-dashboard/products/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Product Listings</CardTitle>
          <CardDescription>
            Manage your products, view their status, and edit their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable products={artisanProducts} />
        </CardContent>
      </Card>
    </>
  );
}
