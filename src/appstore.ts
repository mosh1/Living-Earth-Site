export const IOS_URL = 'https://apps.apple.com/us/app/living-earth-clock-weather/id379869627?at=11l4CN&ct=LivingEarth_Website';
export const MAC_URL = 'https://apps.apple.com/us/app/living-earth-desktop-weather-world-clock/id539362919?mt=12&ct=LivingEarth_Website';

interface Listing {
  price?: number;
  currency?: string;
  formattedPrice?: string;
  averageUserRating?: number;
  userRatingCount?: number;
}

// Fetched at build time so the price and rating on the page track the App Store on every deploy.
export async function lookup(id: number): Promise<Listing | undefined> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
    return (await res.json()).results[0];
  } catch {
    return undefined;
  }
}
