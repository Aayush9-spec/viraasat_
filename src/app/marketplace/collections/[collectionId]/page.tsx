import { getFestivalCampaignByCollectionId } from "@/lib/festival-service";
import { notFound } from "next/navigation";
import FestivalCollectionClient from "@/components/marketplace/festival-collection-client";

export default async function FestivalCollectionPage({ params }: { params: { collectionId: string } }) {
  const campaign = await getFestivalCampaignByCollectionId(params.collectionId);

  if (!campaign) {
    notFound();
  }

  return <FestivalCollectionClient campaign={campaign} />;
}
