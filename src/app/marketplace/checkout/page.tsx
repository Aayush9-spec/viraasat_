
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CheckoutForm from "@/components/marketplace/checkout-form";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";


function CheckoutFallback() {
    return <Skeleton className="w-full h-screen" />;
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <header className="py-4 px-6 border-b">
                 <Link href="/marketplace">
                    <Logo />
                 </Link>
            </header>
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<CheckoutFallback />}>
                    <CheckoutForm />
                </Suspense>
            </main>
        </div>
    );
}
