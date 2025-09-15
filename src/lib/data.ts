import { PlaceHolderImages } from './placeholder-images';
import type { Artisan, Product, Vignette, LegacyBox } from './types';

const getImageUrl = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? { id: image.id, url: image.imageUrl, hint: image.imageHint } : { id: 'default', url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
}

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    shopName: 'Earth & Ember',
    craft: 'Pottery',
    bio: 'Crafting timeless pottery from the heart of the earth.',
    profileImageUrl: getImageUrl('artisan-1'),
    story: 'From a young age, I was fascinated by the way clay could be molded into something both beautiful and functional. My journey started in my grandfather\'s small workshop, and today, I continue the tradition, infusing each piece with a story of its own. Earth & Ember is more than just pottery; it\'s a legacy of craftsmanship passed down through generations.',
    location: { name: 'Jaipur, Rajasthan', x: 280, y: 500 }
  },
  {
    id: 'artisan-2',
    shopName: 'Silver Weave',
    craft: 'Jewelry',
    bio: 'Weaving stories into intricate silver and gemstone jewelry.',
    profileImageUrl: getImageUrl('artisan-2'),
    story: 'Silver Weave was born from a love of ancient tales and the shimmering allure of silver. Each piece of jewelry is a narrative, a whisper from the past, designed to be a modern heirloom. I travel to find the perfect stones, each with its own energy, and weave them into designs that are both elegant and meaningful.',
    location: { name: 'Kutch, Gujarat', x: 150, y: 580 }
  },
   {
    id: 'artisan-3',
    shopName: 'Himalayan Weavers',
    craft: 'Textiles',
    bio: 'Handwoven textiles from the Himalayan foothills.',
    profileImageUrl: getImageUrl('artisan-3'),
    story: 'Nestled in the serene mountains, we create textiles that carry the warmth of our traditions. Using locally sourced wool and natural dyes, every piece is a testament to the harmony between nature and craft.',
    location: { name: 'Shimla, Himachal Pradesh', x: 380, y: 300 }
  }
];

export const products: Product[] = [
  {
    id: 'prod-1',
    artisanId: 'artisan-1',
    name: 'Azure Glaze Pot',
    category: 'Pottery',
    description: 'This handcrafted ceramic pot, finished in a serene azure glaze, brings a touch of calm to any space. Perfect for small indoor plants or as a standalone decorative piece.',
    price: 2499,
    stock: 15,
    imageUrls: [getImageUrl('product-1')],
    tags: ['diya', 'decor']
  },
  {
    id: 'prod-2',
    artisanId: 'artisan-2',
    name: 'Turquoise Dream Necklace',
    category: 'Jewelry',
    description: 'An intricate silver necklace featuring a stunning, ethically-sourced turquoise stone. The delicate chain and detailed pendant make it a versatile piece for any occasion.',
    price: 8999,
    stock: 8,
    imageUrls: [getImageUrl('product-2')],
    tags: ['gifts-for-her', 'eidi']
  },
  {
    id: 'prod-3',
    artisanId: 'artisan-3',
    name: 'Earthy Tone Woven Throw',
    category: 'Textiles',
    description: 'A beautiful handwoven textile with geometric patterns in rich, earthy tones. Made from 100% organic cotton, it\'s the perfect cozy addition to your living room or bedroom.',
    price: 4500,
    stock: 12,
    imageUrls: [getImageUrl('product-3')],
    tags: ['decor', 'gifts-for-family']
  },
  {
    id: 'prod-4',
    artisanId: 'artisan-2',
    name: 'Chromatic Burst',
    category: 'Painting',
    description: 'An abstract oil painting on canvas that captures a moment of explosive creativity. The bold, vibrant colors and dynamic strokes make it a captivating focal point for any modern interior.',
    price: 25000,
    stock: 1,
    imageUrls: [getImageUrl('product-4')],
    tags: ['decor']
  },
  {
    id: 'prod-5',
    artisanId: 'artisan-1',
    name: 'Ganesh Clay Idol',
    category: 'Pottery',
    description: 'A beautifully hand-sculpted clay idol of Lord Ganesh, perfect for your home temple or as a festive gift. Finished with non-toxic, eco-friendly paints.',
    price: 1800,
    stock: 20,
    imageUrls: [getImageUrl('product-5')],
    tags: ['idol', 'diya']
  },
  {
    id: 'prod-6',
    artisanId: 'artisan-2',
    name: 'Silver Rakhi',
    category: 'Jewelry',
    description: 'An elegant Rakhi crafted from pure silver, designed to be worn as a bracelet long after the festival. A timeless expression of a sibling\'s bond.',
    price: 3200,
    stock: 10,
    imageUrls: [getImageUrl('product-6')],
    tags: ['rakhi', 'gifts-for-him']
  }
];

export const vignettes: Vignette[] = [
  {
    id: 'vignette-1',
    imageId: 'vignette-1',
    productId: 'prod-3',
    customerName: 'Ananya R.',
    customerLocation: 'Mumbai',
    quote: "It's the perfect centerpiece for our living room.",
    span: 2,
  },
  {
    id: 'vignette-2',
    imageId: 'vignette-2',
    productId: 'prod-1',
    customerName: 'Vikram S.',
    customerLocation: 'Bengaluru',
    quote: "Brings a touch of calm to my home office.",
    span: 1,
  },
  {
    id: 'vignette-3',
    imageId: 'vignette-3',
    productId: 'prod-4',
    customerName: 'Priya K.',
    customerLocation: 'Delhi',
    quote: "The colors are even more vibrant in person. A true statement piece.",
    span: 1,
  },
  {
    id: 'vignette-4',
    imageId: 'vignette-4',
    productId: 'prod-2',
    customerName: 'Meera J.',
    customerLocation: 'Jaipur',
    quote: "My new favorite necklace. I wear it everywhere!",
    span: 1,
  },
  {
    id: 'vignette-5',
    imageId: 'vignette-5',
    productId: 'prod-5',
    customerName: 'Rohan P.',
    customerLocation: 'Goa',
    quote: "Too beautiful to use, they're on display in my kitchen.",
    span: 2,
  },
  {
    id: 'vignette-6',
    imageId: 'vignette-6',
    productId: 'prod-6',
    customerName: 'Aisha B.',
    customerLocation: 'Hyderabad',
    quote: "So elegant and light. The perfect gift to myself.",
    span: 1,
  }
];

export const legacyBoxes: LegacyBox[] = [
  {
    id: 'box-q2-2024',
    status: 'current',
    quarter: 'Q2 2024',
    theme: 'The Blue Pottery of Jaipur',
    description: 'Immerse yourself in the royal heritage of Jaipur with this quarter\'s Legacy Box. Discover the iconic blue pottery, a craft passed down from Turco-persian artisans, now reimagined for the modern home by the skilled hands of our Jaipur partners.',
    heroItemId: 'prod-1',
    featuredArtisanIds: ['artisan-1'],
    imageIds: {
      ambience: 'legacy-jaipur-ambience',
      map: 'legacy-jaipur-map',
      items: ['product-1', 'product-5'],
    }
  },
  {
    id: 'box-q1-2024',
    status: 'past',
    quarter: 'Q1 2024',
    theme: 'The Weavers of Kutch',
    description: 'Our inaugural box celebrated the vibrant textile traditions of Kutch, Gujarat. Subscribers received pieces showcasing intricate embroidery and mirror-work, a testament to the region\'s rich cultural tapestry and the resilience of its artisan communities.',
    heroItemId: 'prod-3',
    featuredArtisanIds: ['artisan-2'],
    imageIds: {
      ambience: 'legacy-kutch-ambience',
      map: 'legacy-kutch-map',
      items: ['product-3', 'product-2'],
    }
  }
];
