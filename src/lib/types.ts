

export type Product = {
  id: string;
  artisanId: string;
  name: string;
  category: 'Pottery' | 'Jewelry' | 'Textiles' | 'Painting';
  description: string;
  price: number;
  stock: number;
  imageUrls: { id: string; url: string; hint: string }[];
  tags?: string[];
};

export type Artisan = {
  id: string;
  shopName: string;
  bio: string;
  profileImageUrl: { id: string; url: string; hint: string };
  story: string;
  craft: string;
  location: {
    name: string;
    x: number;
    y: number;
  };
};

export type Order = {
  id: string;
  buyerId: string;
  artisanId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: string;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
};

export type Vignette = {
  id: string;
  imageId: string;
  productId: string;
  customerName: string;
  customerLocation: string;
  quote: string;
  span: number;
};

export type LegacyBox = {
  id: string;
  status: 'current' | 'past';
  quarter: string;
  theme: string;
  description: string;
  heroItemId: string;
  featuredArtisanIds: string[];
  imageIds: {
    ambience: string;
    map: string;
    items: string[];
  }
};

export type FestivalCampaign = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  campaignStartDate: string;
  campaignEndDate: string;
  festivalDate: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  bannerImageHint: string;
  collectionId: string;
  curatedProductIds: string[];
  products: Product[];
  subCategories?: { id: string; name: string; productTags: string[] }[];
  offerCode?: string;
  theme: {
    background: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
  };
  notification: string;
};
