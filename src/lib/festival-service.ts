
'use server';

import type { FestivalCampaign, Product } from './types';
import { products } from './data';
import { PlaceHolderImages } from './placeholder-images';

// This is our mock database for festival campaigns
const festivalCampaigns: Omit<FestivalCampaign, 'products' | 'bannerImageUrl' | 'bannerImageHint'>[] = [
  {
    id: 'diwali-2024',
    name: 'Diwali',
    status: 'active',
    campaignStartDate: '2024-10-15',
    campaignEndDate: '2024-11-05',
    festivalDate: '2024-11-01',
    title: 'The Diwali Store',
    subtitle: 'Illuminate your celebrations with handcrafted light and joy. Discover unique gifts and decor that tell a story.',
    collectionId: 'diwali-gifting-2024',
    curatedProductIds: ['prod-1', 'prod-4', 'prod-5', 'prod-3'],
    subCategories: [
      { id: 'diyas', name: 'Handcrafted Diyas', productTags: ['diya'] },
      { id: 'idols', name: 'Laxmi-Ganesh Idols', productTags: ['idol'] },
      { id: 'decor', name: 'Festive Home Decor', productTags: ['decor'] },
      { id: 'gifts', name: 'Gifts for Family', productTags: ['gifts-for-family'] },
    ],
    offerCode: 'DIWALI15',
    theme: {
      background: 'linear-gradient(145deg, #4c1d24 0%, #1e1b29 100%)',
      primary: '#ff9900', // Saffron/Marigold
      primaryForeground: '#ffffff',
      accent: '#f43f5e', // Bright Pink/Rani
      accentForeground: '#ffffff'
    },
    notification: "Diwali is just around the corner! Find the perfect handcrafted gift for your loved ones.",
  },
  {
    id: 'rakhi-2024',
    name: 'Rakhi',
    status: 'active',
    campaignStartDate: '2024-08-10',
    campaignEndDate: '2024-08-20',
    festivalDate: '2024-08-19',
    title: 'Raksha Bandhan Specials',
    subtitle: 'Celebrate the timeless bond between siblings with gifts that are as unique as your connection.',
    collectionId: 'rakhi-collection-2024',
    curatedProductIds: ['prod-6', 'prod-2'],
     subCategories: [
      { id: 'rakhis', name: 'Designer Rakhis', productTags: ['rakhi'] },
      { id: 'gifts-for-her', name: 'Gifts for Sisters', productTags: ['gifts-for-her'] },
      { id: 'gifts-for-him', name: 'Gifts for Brothers', productTags: ['gifts-for-him'] },
    ],
    offerCode: 'RAKHI10',
    theme: {
      background: 'linear-gradient(145deg, #581c87 0%, #1e1b4b 100%)',
      primary: '#facc15', // Gold
      primaryForeground: '#1e1b4b',
      accent: '#ec4899', // Pink
      accentForeground: '#ffffff'
    },
    notification: "Celebrate Raksha Bandhan! Find the perfect designer rakhi and thoughtful gifts.",
  },
  {
    id: 'eid-2025',
    name: 'Eid',
    status: 'active',
    campaignStartDate: '2025-03-20',
    campaignEndDate: '2025-03-31',
    festivalDate: '2025-03-30',
    title: 'Eid Elegance',
    subtitle: 'Celebrate with timeless gifts and decor that reflect the spirit of togetherness and gratitude.',
    collectionId: 'eid-collection-2025',
    curatedProductIds: ['prod-2', 'prod-3'],
     subCategories: [
      { id: 'eidi', name: 'Eidi for Loved Ones', productTags: ['eidi'] },
      { id: 'decor', name: 'Festive Home Accents', productTags: ['decor'] },
    ],
    offerCode: 'EIDJOY',
     theme: {
      background: 'linear-gradient(145deg, #02343F 0%, #011418 100%)',
      primary: '#A8D8B9', // Light Jade Green
      primaryForeground: '#011418',
      accent: '#F2E3B3', // Gold/Cream
      accentForeground: '#011418'
    },
    notification: "Eid Mubarak! Find elegant handcrafted gifts to share with family and friends.",
  },
];

/**
 * This is the core "Festival Calendar Engine".
 * It checks the current date against the campaign start and end dates for all active festivals.
 * @returns The currently active festival campaign, or null if none are active.
 */
export async function getCurrentFestivalCampaign(): Promise<FestivalCampaign | null> {
  const today = new Date();
  // Set time to 00:00:00 to compare dates only
  today.setHours(0, 0, 0, 0);

  const activeCampaignData = festivalCampaigns.find(campaign => {
    if (campaign.status !== 'active') {
      return false;
    }
    const startDate = new Date(campaign.campaignStartDate);
    const endDate = new Date(campaign.campaignEndDate);
    // Set time to 00:00:00 to compare dates only
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    
    return today >= startDate && today <= endDate;
  });
  
  if (!activeCampaignData) {
    return null;
  }

  // Hydrate the campaign with full product and image details
  const festivalProducts = products.filter(p => activeCampaignData.curatedProductIds.includes(p.id));
  const bannerImage = PlaceHolderImages.find(p => p.id === `banner-${activeCampaignData.name.toLowerCase()}`);
  
  return {
    ...activeCampaignData,
    products: festivalProducts,
    bannerImageUrl: bannerImage?.imageUrl || 'https://picsum.photos/seed/default-banner/1920/400',
    bannerImageHint: bannerImage?.imageHint || 'festival banner'
  };
}


/**
 * Fetches the details of a single festival campaign by its collection ID.
 * @param collectionId The ID of the festival collection (e.g., 'diwali-gifting-2024')
 * @returns The campaign details or null if not found.
 */
export async function getFestivalCampaignByCollectionId(collectionId: string): Promise<FestivalCampaign | null> {
  const campaignData = festivalCampaigns.find(c => c.collectionId === collectionId);
  
  if (!campaignData) {
    return null;
  }
  
  // Hydrate with products and images
  const festivalProducts = products.filter(p => campaignData.curatedProductIds.includes(p.id));
  const bannerImage = PlaceHolderImages.find(p => p.id === `banner-${campaignData.name.toLowerCase()}`);

  return {
    ...campaignData,
    products: festivalProducts,
    bannerImageUrl: bannerImage?.imageUrl || 'https://picsum.photos/seed/default-banner/1920/400',
    bannerImageHint: bannerImage?.imageHint || 'festival banner'
  };
}
