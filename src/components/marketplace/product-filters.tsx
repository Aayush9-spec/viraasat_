"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function ProductFilters() {
    const [priceRange, setPriceRange] = useState([0, 10000])

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("en-IN", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(value)

  return (
    <Card className="sticky top-20">
        <CardHeader>
            <CardTitle className="font-headline">Filters</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
            <AccordionItem value="category">
                <AccordionTrigger className="text-base font-medium">Category</AccordionTrigger>
                <AccordionContent>
                <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Checkbox id="category-pottery" />
                        <Label htmlFor="category-pottery">Pottery</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="category-jewelry" />
                        <Label htmlFor="category-jewelry">Jewelry</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="category-textiles" />
                        <Label htmlFor="category-textiles">Textiles</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="category-painting" />
                        <Label htmlFor="category-painting">Painting</Label>
                    </div>
                </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
                <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
                <AccordionContent>
                    <div className="grid gap-4">
                        <div className="flex justify-between font-medium">
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                        </div>
                        <Slider
                            min={0}
                            max={30000}
                            step={500}
                            value={priceRange}
                            onValueChange={(value) => Array.isArray(value) && setPriceRange(value)}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sort">
                <AccordionTrigger className="text-base font-medium">Sort By</AccordionTrigger>
                <AccordionContent>
                <RadioGroup defaultValue="featured" className="grid gap-2">
                    <div className="flex items-center gap-2">
                    <RadioGroupItem value="featured" id="sort-featured" />
                    <Label htmlFor="sort-featured">Featured</Label>
                    </div>
                    <div className="flex items-center gap-2">
                    <RadioGroupItem value="price-asc" id="sort-price-asc" />
                    <Label htmlFor="sort-price-asc">Price: Low to High</Label>
                    </div>
                    <div className="flex items-center gap-2">
                    <RadioGroupItem value="price-desc" id="sort-price-desc" />
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
  )
}
