import { artisans, products } from '@/lib/data';
import LiveShowcaseClient from '@/components/marketplace/live-showcase-client';
import { notFound } from 'next/navigation';

// --- Event Configuration ---
// In a real app, this would come from a CMS or database.
const FEATURED_ARTISAN_ID = 'artisan-1'; // Earth & Ember
const EVENT_EXCLUSIVE_PRODUCT_IDS = ['prod-1', 'prod-5'];

// Set the event time to be in the future to show the countdown.
// For demonstration, let's set it 1 hour from now.
const getEventTime = () => {
  const eventDate = new Date();
  eventDate.setHours(eventDate.getHours() + 1);
  return eventDate.toISOString();
};
// To test the "live" state immediately, use a past date:
// const getEventTime = () => new Date(Date.now() - 10000).toISOString();
// --- End Configuration ---


export default function LiveShowcasePage() {
  const featuredArtisan = artisans.find(a => a.id === FEATURED_ARTISAN_ID);
  if (!featuredArtisan) {
    notFound();
  }

  const exclusiveProducts = products.filter(p => EVENT_EXCLUSIVE_PRODUCT_IDS.includes(p.id));
  
  const eventTime = getEventTime();

  return (
    <LiveShowcaseClient 
      artisan={featuredArtisan}
      exclusiveProducts={exclusiveProducts}
      eventTimeISO={eventTime}
    />
  );
}
