// =============================================================
// Cardo — REAL owner testimonials from Google and Yelp (July 2026).
// Full archive kept here for reference. The owners page shows a "quote wall"
// built from entries with `wall: true`; clicking a quote opens the full review.
// Names are First + last initial. `location` is the owner's unit — editable
// per review in the CMS (admin "What owners say" editor).
// =============================================================

export interface OwnerReview {
  /** First name + last initial, e.g. "Andrew H." */
  name: string;
  source: 'google' | 'yelp';
  rating: number;
  /** Owner's unit — plugged in via the CMS. */
  location?: string;
  /** Full review text (paragraphs separated by blank lines). */
  text: string;
  /** Short, high-impact verbatim excerpt shown on the quote wall. */
  pullQuote: string;
  /** Text size on the wall — Large / Medium / Small. */
  size?: 'lg' | 'md' | 'sm';
  /** Show on the quote wall (some archive entries are hidden). */
  wall?: boolean;
  /** Platform date — kept for reference, not displayed. */
  date?: string;
}

export const ownerReviews: OwnerReview[] = [
  {
    name: 'Sean M.', source: 'yelp', rating: 5, location: '', date: 'Jan 7, 2021', wall: true, size: 'lg',
    pullQuote: 'Hands down best property management company in San Diego, let alone the United States!',
    text: "Hands down best property management company in San Diego, let alone the United States! I truly could not have done it without them. I was in constant phone contact with Rich, the owner, who worked tirelessly on countless occasions to help salvage a short term rental of mine in San Diego, all while I was living in Montana. Broken fridge on 4th of July weekend, gas leak, no hot water on multiple occasions… Rich was all over it somehow managing to sort out the issues while simultaneously keeping the guests happy and the great reviews coming in! The guy deserves some sort of a medal. If you are in need of management look no further, 5 stars all round!",
  },
  {
    name: 'Douglas W.', source: 'google', rating: 5, location: '', date: '4 months ago', wall: true, size: 'lg',
    pullQuote: 'A Game-Changer for my San Diego property.',
    text: 'A Game-Changer for my San Diego Property.\n\nI shifted my property management to Cardo Vacation Rentals five months ago after years with a traditional real estate manager, and the difference is night and day. Making the switch was a big decision, but the team at Cardo made the transition seamless.\n\nTheir attention to detail, communication, and local San Diego expertise have already resulted in better booking consistency and much higher guest satisfaction than I was seeing previously. If you are looking for a team that actually treats your investment like their own, look no further. Highly recommended!',
  },
  {
    name: 'Matthew M.', source: 'google', rating: 5, location: '', date: '5 years ago', wall: true, size: 'lg',
    pullQuote: 'Look no further, this is the property management team you need!',
    text: "Look no further, this is the property management team you need! I had searched tirelessly for a property management company to market & manage my La Mesa property as a short-term vacation rental, and could not find what I was looking for until I met Rich. (It seems like a lot of the short-term rental companies only cater to beachfront properties, even though there is a huge short-term rental industry outside of coastal communities.) I am very impressed with their professionalism, attention to detail & style, and their ability to generate REVENUE for my property! There was a lot of inherent risk investing into the short-term rental game. However, Rich & Amanda have proven that I made the right decision! You'll be in good hands with Cardo Vacation Rentals at the helm of your investment.",
  },
  {
    name: 'Kevin M.', source: 'yelp', rating: 5, location: '', date: 'Feb 13, 2020', wall: true, size: 'md',
    pullQuote: 'They took 15 years of headaches off my plate.',
    text: 'Cardo knocked it outta the park vaca managing our duplex in OB for us, additionally they took 15 years of headaches off my plate by taking over my Las Gaviotas vaca rental. I recommend Rich and Amanda for your rentals.',
  },
  {
    name: 'Carolyn K.', source: 'google', rating: 5, location: '', date: 'a month ago', wall: true, size: 'md',
    pullQuote: "We've been booked solid throughout the high season.",
    text: "My husband and I had a great experience renting out our home with Cardo. We had no experience with short-term rentals when we decided to Airbnb our home, and we honestly didn't know where to start. The property needed significant maintenance, repairs, and a design refresh before it was ready for guests. After interviewing several property management companies, we chose Cardo because of their attention to detail and clear focus on maximizing our property's potential.\n\nFrom the beginning, their onboarding process was very smooth. The team provided a clear checklist that walked us through everything we needed to do to get our short-term rental license and prepare the property for guests. Having that guidance made the process feel much more manageable.\n\nThe Cardo team also coordinated all of the maintenance and repairs needed to get the home rental-ready, utilizing their own team and trusted vendors. Having them manage those projects removed a ton of stress from our plates during a time when we were also planning our wedding.\n\nWe also worked with Kathryn, Cardo's in-house interior designer, on the interior design. She did an excellent job transforming the space while staying within our budget.\n\nSince launching the property, the team has kept us informed every step of the way. Their owner portal is easy to use, making it simple to track bookings, revenue, and guest reviews. They also handle the tax side of the business, which has been another huge benefit.\n\nThe listing itself looks fantastic, and while it took some time to build momentum, we've been booked solid throughout the high season and have received overwhelmingly positive guest feedback. The most rewarding part has been knowing that so many families and groups have enjoyed staying in our home. We are incredibly grateful to the Cardo team for helping make this experience such a success!",
  },
  {
    name: 'Richard R.', source: 'google', rating: 5, location: '', date: '2 years ago', wall: true, size: 'md',
    pullQuote: "Super responsive and professional — we couldn't be happier!",
    text: "Great property management company. Super responsive and professional. They've helped rent out our SD place for the past 2 years and we couldn't be happier! Thanks, Cardo!",
  },
  {
    name: 'Andrew H.', source: 'google', rating: 5, location: '', date: '6 months ago', wall: true, size: 'sm',
    pullQuote: 'Rich and his team are extremely talented and dedicated.',
    text: 'I have used cardo as my property management company for the past four years. They have been extremely useful and bought me a piece of mind. Rich and his team are extremely talented and dedicated to renting and maintaining my unit.',
  },
  {
    name: 'Daniel L.', source: 'yelp', rating: 5, location: '', date: 'Jan 5, 2025', wall: true, size: 'sm',
    pullQuote: 'I would absolutely recommend Cardo to anyone.',
    text: "I worked with Cardo for nearly 3 years in renting my property out in Bonita. Their company is fantastic, and the owner, Rich, and operations director, Jacob, were so great to work with and extremely accommodating over the years. I can say with complete confidence that they're built on good values, and do the best that they can for both their hosts and the house guests. They've repeatedly gone out of the way to accommodate guests at all hours.\n\nI would absolutely recommend Cardo to anyone considering their house as a rental property, or for guests who are interested in any of their properties.",
  },
  {
    name: 'Christopher M.', source: 'yelp', rating: 5, location: '', date: 'May 8, 2017', wall: true, size: 'sm',
    pullQuote: "I'd recommend this to any landlord hands down.",
    text: 'I leased my home to Rich so that he can run it as an Air BnB rental. We are about 9 months in and I couldn’t be happier with the decision. The rent is paid like clockwork and I haven’t had one of those dreaded "tenant calls" that any landlord can relate to. I’ve been to the property a few times and it’s always in immaculate condition, much better than any tenant would keep it. The initial leasing and any back and forth with Rich has always been completely painless. I’ve done the alternative and I’ll never go back if I can help it, I’d recommend this to any landlord hands down.',
  },
  {
    name: 'Michael D.', source: 'yelp', rating: 5, location: '', date: 'Mar 16, 2021', wall: true, size: 'sm',
    pullQuote: 'I would recommend this company to anyone.',
    text: 'Rich and his team have managed my Airbnb for nearly two years now, and I have been very satisfied. Rich handled everything, from converting my primary residence into a short term rental, the vacation rental management since then, and found solutions on longer term renters when the pandemic hit and travel was severely restricted. He communicates whenever repairs are necessary, and handles them quickly once I have agreed. I was very nervous when I first moved away from San Diego leaving my house in someone else’s hands, but, at this point, I would recommend this company to anyone who needs a vacation management company.',
  },

  // ---- Archive (not shown on the wall) ----
  {
    name: 'Jake K.', source: 'google', rating: 5, location: '', date: '4 years ago', wall: false, size: 'sm',
    pullQuote: 'Great to have peace of mind that our home was taken care of.',
    text: "Rich and his team were great to work with! They helped us create a short term plan while our family had an extended trip out of state. It was great to have peace of mind that our primary residence was taken care of and we didn't have a large housing expense while we were away! Rich and his team were able to ensure we had very little vacancy. I'd recommend him and will use his services again when we take another extended trip.",
  },
  {
    name: 'Douglas W.', source: 'yelp', rating: 5, location: '', date: 'Feb 27, 2026', wall: false, size: 'sm',
    pullQuote: 'They made our place just pop!',
    text: 'So glad I made the switch to Cardo Vacation Rentals! I spent years with my old real estate manager in San Diego and finally decided to move my rental over to Rich and Krissy at Cardo Vacation Rentals five months ago. It was the best move I could have made. The Cardo team is incredibly proactive, tech-savvy, and they really understand the San Diego market. I’ve felt supported every step of the way, and the performance of my property has never been better. 5/5 stars for service and results! They made our place just pop!',
  },
  {
    name: 'Michael M.', source: 'yelp', rating: 5, location: '', date: 'Feb 3, 2020', wall: false, size: 'sm',
    pullQuote: 'We are very proud of Cardo Vacation Rentals.',
    text: 'We are very proud of Cardo Vacation Rentals, we used Cardo for roughly two years with one of our properties and we are now working to have another property managed by Cardo.',
  },
];
