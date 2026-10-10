export const IOS_URL = 'https://apps.apple.com/us/app/living-earth-clock-weather/id379869627?at=11l4CN&ct=LivingEarth_Website';

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

// Every App Store storefront the lookup answers for (checked 2026-10-10; other ISO regions return 400).
const STOREFRONTS = (
  'ad ae af ag ai al am ao ar at au az ba bb bd be bf bg bh bj bm bn bo br bs bt bw by bz ca cd cf ' +
  'cg ch ci cl cm cn co cr cv cy cz de dk dm do dz ec ee eg es et fi fj fm fr ga gb gd ge gh gm gn ' +
  'gr gt gw gy hk hn hr hu id ie il in iq is it jm jo jp ke kg kh kn kr kw ky kz la lb lc li lk lr ' +
  'lt lu lv ly ma mc md me mg mk ml mm mn mo mr ms mt mu mv mw mx my mz na ne ng ni nl no np nr nz ' +
  'om pa pe pg ph pk pl ps pt pw py qa ro rs ru rw sa sb sc se sg si sk sl sn sr st sv sz tc td th ' +
  'tj tm tn to tr tt tw tz ua ug us uy uz vc ve vg vn vu ws ye za zm zw'
).split(' ');

// The App Store counts ratings per storefront and shows each country only its own. This sums
// every storefront's count and weights their averages by it, 20 requests at a time (a few
// seconds). Any failure returns undefined, so the page never shows a partial total.
export async function worldRating(id: number): Promise<{ average: number; count: number } | undefined> {
  try {
    const queue = [...STOREFRONTS];
    let count = 0, weighted = 0;
    const worker = async () => {
      for (let cc; (cc = queue.pop()); ) {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=${cc}`);
        if (!res.ok) throw new Error(`${cc}: HTTP ${res.status}`);
        const listing: Listing | undefined = (await res.json()).results[0];
        count += listing?.userRatingCount ?? 0;
        weighted += (listing?.userRatingCount ?? 0) * (listing?.averageUserRating ?? 0);
      }
    };
    await Promise.all(Array.from({ length: 20 }, worker));
    return count ? { average: weighted / count, count } : undefined;
  } catch (e) {
    console.warn(`Worldwide App Store rating unavailable (${e}); the page shows the US figures.`);
    return undefined;
  }
}
