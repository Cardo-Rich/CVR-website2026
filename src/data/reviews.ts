// =============================================================
// Cardo — guest review data.
// REAL reviews pulled from Cardo's public Google Business Profile
// (4.8★, 127 reviews) and Airbnb host profile (4.71★, 3,718 reviews),
// July 2026. Lightly trimmed for length; wording preserved.
// Powers the For-Guests menu carousel and the /reviews waterfall page.
// No avatar photos — reviewer initials are rendered instead (these are
// real people; stock face photos would misrepresent them).
// =============================================================

export interface Review {
  name: string;
  platform: 'google' | 'airbnb';
  stars: number;
  /** Small subtitle under the name — reviewer's home city for Airbnb; empty for Google. */
  meta: string;
  text: string;
}

// Deterministic avatar tint from the name, so each initial circle gets a
// stable brand-adjacent color. Shared by every review surface.
const AVATAR_COLORS = ['#0E111B', '#2F5D50', '#8A5A44', '#3B4A6B', '#7C5A2E', '#4A4E69', '#5C6B52'];
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
export function initial(name: string): string {
  return (name.trim()[0] || '?').toUpperCase();
}

export const reviews: Review[] = [
  // ---------- Google (real — Cardo Vacation Rentals, 4.8★) ----------
  { name: 'Audrey G.', platform: 'google', stars: 5, meta: '', text: 'My family had a wonderful stay at one of the properties in San Diego. The house was very clean, spacious, private, and felt incredibly homey.' },
  { name: 'Jason Q.', platform: 'google', stars: 5, meta: '', text: 'We had a great time in Ocean Beach. Our house was perfect for our family of four — very clean and comfortable.' },
  { name: 'Gina J.', platform: 'google', stars: 5, meta: '', text: 'Fantastic home in a great location. It was clean, well appointed, and not overly decorated like many rentals.' },
  { name: 'Caryn C.', platform: 'google', stars: 5, meta: '', text: 'We rented a townhouse in Ocean Beach and it was beautiful. Very clean, and it had everything we needed to make ourselves a few meals.' },
  { name: 'Kristine B.', platform: 'google', stars: 5, meta: '', text: 'My family stayed at their property in South Park. It was clean, well-kept, and had a beautiful view.' },
  { name: 'John T.', platform: 'google', stars: 5, meta: '', text: 'A very comfy, cozy, and pleasant stay. Everything we needed was there, including decent coffee.' },
  { name: 'Renata', platform: 'google', stars: 5, meta: '', text: 'We had a wonderful stay at the Cardo vacation rental home in Sunset Cliffs, San Diego.' },
  { name: 'Angela F.', platform: 'google', stars: 5, meta: '', text: 'Excellent location — close to SeaWorld, the beach, and the San Diego Zoo. Walking distance to the beach was about 15 minutes.' },
  { name: 'Sue W.', platform: 'google', stars: 5, meta: '', text: 'Absolutely perfect location. Walking distance from Balboa Park, local restaurants, and all of the wonderful things in the Hillcrest neighborhood.' },
  { name: 'Rosi B.', platform: 'google', stars: 5, meta: '', text: 'We are so grateful for how accommodating this company was during our stay in San Diego.' },
  { name: 'Andrea V.', platform: 'google', stars: 5, meta: '', text: 'This is my 2nd time reserving with Cardo, and I have to say they are definitely one of the top vacation rental companies I have worked with.' },

  // ---------- Airbnb (real — Cardo host profile, 4.71★) ----------
  { name: 'Lynette', platform: 'airbnb', stars: 5, meta: 'San Diego, CA', text: 'We are San Diego locals who stayed for a wedding at the Mission Beach Women’s Club right next door. Beautiful location to stay and relax afterwards. Fit 7 people comfortably.' },
  { name: 'Pam', platform: 'airbnb', stars: 5, meta: 'Riverside, CA', text: 'We really enjoyed our stay. Beautiful condo, perfect for a family vacation. Great location, close to the zoo and SeaWorld.' },
  { name: 'Denise', platform: 'airbnb', stars: 5, meta: 'Las Vegas, NV', text: 'What a wonderful little house in Ocean Beach! Walkable to many coffee places and cute restaurants — a perfect little spot for our family of 5.' },
  { name: 'David', platform: 'airbnb', stars: 5, meta: 'Palm Desert, CA', text: 'The home is very clean and the property manager was responsive. Great views of Sunset Cliffs and good hiking trails close by.' },
  { name: 'Jessica', platform: 'airbnb', stars: 5, meta: 'Mission Viejo, CA', text: 'Located in a great spot right next to Balboa Park! I appreciated the clear and easy-to-follow instructions for check-in and out.' },
  { name: 'Laurinda', platform: 'airbnb', stars: 5, meta: 'Easton, PA', text: 'The condo was beautiful inside and out. Balboa Park was right across the street.' },
  { name: 'Suzie', platform: 'airbnb', stars: 5, meta: 'Fort Myers, FL', text: 'Clean and very comfortable. Excellent location, close to everything in Point Loma and super walkable. Loved it!' },
  { name: 'Diane', platform: 'airbnb', stars: 5, meta: 'Chandler, AZ', text: 'We loved our stay here — the beach and bay were super close, a 2-minute walk to both.' },
  { name: 'Olivia', platform: 'airbnb', stars: 5, meta: 'Boulder City, NV', text: 'Absolutely loved our stay here! A 5–10 minute walk to the beach, restaurants, and bars.' },
  { name: 'Christeen', platform: 'airbnb', stars: 5, meta: 'Yuma, AZ', text: 'We enjoyed our stay at Cardo’s Airbnb. The place was clean and spacious enough for my family of five to comfortably spread out.' },
  { name: 'Melissa', platform: 'airbnb', stars: 5, meta: 'Orange, CA', text: 'My family and I had a great stay here. The place was clean, fun, and a great location. The host was responsive and helpful.' },
  { name: 'Kate', platform: 'airbnb', stars: 5, meta: 'Seattle, WA', text: 'Fantastic location and a perfect place to stay for a few nights. Modern bathroom, kitchen, and TV, with very easy check-in.' },
  { name: 'Anne', platform: 'airbnb', stars: 5, meta: 'Darien, CT', text: 'Perfect house for our family celebration! Great location for surfing, walking, and hiking, with an amazing view.' },
  { name: 'Shannon', platform: 'airbnb', stars: 5, meta: 'San Diego, CA', text: 'This place was perfectly located in San Diego. It was clean, and the jacuzzi was amazing.' },
  { name: 'Johnny', platform: 'airbnb', stars: 5, meta: 'San Antonio, TX', text: 'The studio we stayed in is very comfortable, perfect for a couple, and close to lots of restaurants and coffee shops.' },
  { name: 'Mario', platform: 'airbnb', stars: 5, meta: 'Guadalajara, Mexico', text: 'Great location, near everything. I’ll definitely stay there again. Good communication with the host.' },
  { name: 'Kimlan', platform: 'airbnb', stars: 5, meta: '', text: 'This rental was exactly as described and very clean. We stayed three nights with 3 teen boys and it was the perfect space.' },
  { name: 'Tim', platform: 'airbnb', stars: 5, meta: '', text: 'The house was perfect for our group — highly recommend for anybody looking to stay in San Diego!' },
];
