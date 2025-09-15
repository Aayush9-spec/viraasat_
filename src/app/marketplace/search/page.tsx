import { products, artisans } from "@/lib/data";
import SearchResultsClient from "@/components/marketplace/search-results-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SearchFallback() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-[280px_1fr] gap-8">
                <div>
                     <Skeleton className="h-[400px] w-full" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)}
                </div>
            </div>
        </div>
    )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback/>}>
      <SearchResultsClient allProducts={products} allArtisans={artisans} />
    </Suspense>
  );
}
