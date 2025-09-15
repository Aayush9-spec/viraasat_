import { analyzeProductForBuyerInsights } from "@/ai/flows/analyze-product-for-buyer-insights";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, PackageCheck, Sparkles } from "lucide-react";

async function AiInsights({ product }: { product: Product }) {
  const insights = await analyzeProductForBuyerInsights({
    productName: product.name,
    productCategory: product.category,
    productDescription: product.description,
    productImageUrls: product.imageUrls.map(img => img.url),
  });

  return (
    <div className="border rounded-lg p-6 bg-background/50">
      <h3 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        AI Product Insights
      </h3>

      <div className="space-y-4">
        {insights.summary && <p className="text-sm text-muted-foreground italic">"{insights.summary}"</p>}
        
        {insights.keyFeatures && insights.keyFeatures.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><PackageCheck className="w-4 h-4"/>Key Features</h4>
            <div className="flex flex-wrap gap-2">
              {insights.keyFeatures.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {insights.styleTags && insights.styleTags.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4"/>Style & Aesthetic</h4>
            <div className="flex flex-wrap gap-2">
              {insights.styleTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {insights.potentialUseCases && insights.potentialUseCases.length > 0 && (
           <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Lightbulb className="w-4 h-4"/>Potential Use Cases</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                {insights.potentialUseCases.map((useCase) => (
                    <li key={useCase}>{useCase}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiInsights;
