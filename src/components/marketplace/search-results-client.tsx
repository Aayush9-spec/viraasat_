'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'next-usequerystate';
import type { Product, Artisan } from '@/lib/types';
import InteractiveProductCard from './interactive-product-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import AnimatedHeading from '../shared/animated-heading';


interface SearchResultsClientProps {
  allProducts: Product[];
  allArtisans: Artisan[];
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function SearchResultsClient({
  allProducts,
  allArtisans,
}: SearchResultsClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(initialQuery));
  
  const [categories, setCategories] = useQueryStates({
      pottery: parseAsString,
      jewelry: parseAsString,
      textiles: parseAsString,
      painting: parseAsString
  });

  const [price, setPrice] = useQueryState(
    'price',
    parseAsArrayOf(parseAsString).withDefault(['0', '30000'])
  );

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsString.withDefault('featured')
  );

  const selectedCategories = useMemo(() => {
    return Object.entries(categories)
      .filter(([, value]) => value !== null)
      .map(([key]) => key);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by search query
    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategories.length > 0) {
        products = products.filter(p => selectedCategories.includes(p.category.toLowerCase()));
    }

    // Filter by price
    const [minPrice, maxPrice] = price.map(Number);
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort products
    switch (sortBy) {
        case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // Assuming higher ID is newer for mock data
            products.sort((a, b) => b.id.localeCompare(a.id));
            break;
        default: // 'featured'
            // No specific sorting for featured, use default order
            break;
    }


    return products;
  }, [query, selectedCategories, price, sortBy, allProducts]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const setter = setCategories[category as keyof typeof categories];
    if (setter) {
        setter(checked ? category : null);
    }
  }

  const categoryOptions = ['Pottery', 'Jewelry', 'Textiles', 'Painting'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <AnimatedHeading text={query ? `Results for "${query}"` : "Explore Products"} className="text-4xl font-headline font-bold" />
         <div className="flex flex-wrap gap-2 mt-4">
            {query && <Badge variant="secondary" className="text-sm">Query: {query} <button onClick={() => setQuery('')} className="ml-2"><X className="w-3 h-3"/></button></Badge>}
            {selectedCategories.map(cat => <Badge key={cat} variant="secondary" className="capitalize text-sm">{cat} <button onClick={() => handleCategoryChange(cat, false)} className="ml-2"><X className="w-3 h-3"/></button></Badge>)}
         </div>
      </div>
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
        <aside>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                defaultValue={['category', 'price', 'sort']}
                className="w-full"
              >
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base font-medium">
                    Category
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                        {categoryOptions.map(cat => (
                            <div key={cat} className="flex items-center gap-2">
                                <Checkbox 
                                    id={`category-${cat.toLowerCase()}`}
                                    checked={selectedCategories.includes(cat.toLowerCase())}
                                    onCheckedChange={(checked) => handleCategoryChange(cat.toLowerCase(), !!checked)}
                                />
                                <Label htmlFor={`category-${cat.toLowerCase()}`}>{cat}</Label>
                            </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                  <AccordionTrigger className="text-base font-medium">
                    Price Range
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 pt-2">
                      <div className="flex justify-between font-medium text-sm">
                        <span>{formatPrice(Number(price[0]))}</span>
                        <span>{formatPrice(Number(price[1]))}</span>
                      </div>
                      <Slider
                        min={0}
                        max={30000}
                        step={500}
                        value={price.map(Number)}
                        onValueChange={(value) =>
                          setPrice(value.map(String))
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sort">
                  <AccordionTrigger className="text-base font-medium">
                    Sort By
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value)}
                      className="grid gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="featured" id="sort-featured" />
                        <Label htmlFor="sort-featured">Featured</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="price-asc"
                          id="sort-price-asc"
                        />
                        <Label htmlFor="sort-price-asc">Price: Low to High</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="price-desc"
                          id="sort-price-desc"
                        />
                        <Label htmlFor="sort-price-desc">Price: High to Low</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="newest" id="sort-newest" />
                        <Label htmlFor="sort-newest">Newest</Label>
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </aside>

        {/* Product Grid */}
        <main>
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <InteractiveProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
                <p className="text-lg font-semibold">No Products Found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
