import MarketplaceHeader from "@/components/layout/marketplace-header";
import MarketplaceFooter from "@/components/layout/marketplace-footer";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed inset-0 bg-repeat bg-center parallax-bg -z-10" />
      <MarketplaceHeader />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
    </div>
  );
}
