// =============================================================
// Cardo — REAL owner testimonials, collected from Google and Yelp
// (July 2026). Full archive kept here for reference; `featured: true`
// picks the three shown on the owners page, and the rest appear in the
// "all owner reviews" modal. Wording is verbatim; `short` is a trimmed
// card excerpt (also verbatim).
// =============================================================

export interface OwnerReview {
  name: string;
  source: 'google' | 'yelp';
  rating: number;
  /** Relative or absolute date as shown on the platform. */
  date: string;
  location?: string;
  text: string;
  /** Short verbatim excerpt for the 3 featured cards. */
  short?: string;
  featured?: boolean;
  /** Cardo's public reply, where the owner review has one. */
  reply?: string;
}

export const ownerReviews: OwnerReview[] = [
  {
    name: 'Douglas Westphal', source: 'google', rating: 5, date: '4 months ago', featured: true,
    short: 'A game-changer for my San Diego property. I shifted to Cardo after years with a traditional real estate manager, and the difference is night and day.',
    text: 'A Game-Changer for my San Diego Property.\n\nI shifted my property management to Cardo Vacation Rentals five months ago after years with a traditional real estate manager, and the difference is night and day. Making the switch was a big decision, but the team at Cardo made the transition seamless.\n\nTheir attention to detail, communication, and local San Diego expertise have already resulted in better booking consistency and much higher guest satisfaction than I was seeing previously. If you are looking for a team that actually treats your investment like their own, look no further. Highly recommended!',
    reply: "Thank you Doug, it is a true pleasure working with you and we're looking forward to the years ahead!",
  },
  {
    name: 'Sean M.', source: 'yelp', rating: 5, date: 'Jan 7, 2021', featured: true,
    short: 'Hands down best property management company in San Diego, let alone the United States! If you are in need of management look no further, 5 stars all round!',
    text: "Hands down best property management company in San Diego, let alone the United States! I truly could not have done it without them. I was in constant phone contact with Rich, the owner, who worked tirelessly on countless occasions to help salvage a short term rental of mine in San Diego, all while I was living in Montana. Broken fridge on 4th of July weekend, gas leak, no hot water on multiple occasions… Rich was all over it somehow managing to sort out the issues while simultaneously keeping the guests happy and the great reviews coming in! The guy deserves some sort of a medal. If you are in need of management look no further, 5 stars all round!",
  },
  {
    name: 'Carolyn King', source: 'google', rating: 5, date: 'a month ago', featured: true,
    short: 'We chose Cardo for their attention to detail and focus on maximizing our property’s potential. We’ve been booked solid through high season — incredibly grateful to the team.',
    text: "My husband and I had a great experience renting out our home with Cardo. We had no experience with short-term rentals when we decided to Airbnb our home, and we honestly didn't know where to start. The property needed significant maintenance, repairs, and a design refresh before it was ready for guests. After interviewing several property management companies, we chose Cardo because of their attention to detail and clear focus on maximizing our property's potential.\n\nFrom the beginning, their onboarding process was very smooth. The team provided a clear checklist that walked us through everything we needed to do to get our short-term rental license and prepare the property for guests. Having that guidance made the process feel much more manageable.\n\nThe Cardo team also coordinated all of the maintenance and repairs needed to get the home rental-ready, utilizing their own team and trusted vendors. Having them manage those projects removed a ton of stress from our plates during a time when we were also planning our wedding.\n\nWe also worked with Kathryn, Cardo's in-house interior designer, on the interior design. She did an excellent job transforming the space while staying within our budget.\n\nSince launching the property, the team has kept us informed every step of the way. Their owner portal is easy to use, making it simple to track bookings, revenue, and guest reviews. They also handle the tax side of the business, which has been another huge benefit.\n\nThe listing itself looks fantastic, and while it took some time to build momentum, we've been booked solid throughout the high season and have received overwhelmingly positive guest feedback. The most rewarding part has been knowing that so many families and groups have enjoyed staying in our home. We are incredibly grateful to the Cardo team for helping make this experience such a success!",
  },
  {
    name: 'Matthew McKinney', source: 'google', rating: 5, date: '5 years ago',
    text: "Look no further, this is the property management team you need! I had searched tirelessly for a property management company to market & manage my La Mesa property as a short-term vacation rental, and could not find what I was looking for until I met Rich. (It seems like a lot of the short-term rental companies only cater to beachfront properties, even though there is a huge short-term rental industry outside of coastal communities.) I am very impressed with their professionalism, attention to detail & style, and their ability to generate REVENUE for my property! There was a lot of inherent risk investing into the short-term rental game. However, Rich & Amanda have proven that I made the right decision! You'll be in good hands with Cardo Vacation Rentals at the helm of your investment.",
  },
  {
    name: 'Andrew Ho', source: 'google', rating: 5, date: '6 months ago',
    text: 'I have used cardo as my property management company for the past four years. They have been extremely useful and bought me a piece of mind. Rich and his team are extremely talented and dedicated to renting and maintaining my unit.',
    reply: 'Hi, Andrew. We appreciate the kind words and are glad we could provide you with a positive experience!',
  },
  {
    name: 'daniel l.', source: 'yelp', rating: 5, date: 'Jan 5, 2025', location: 'Morgan Hill, CA',
    text: "I worked with Cardo for nearly 3 years in renting my property out in Bonita. Their company is fantastic, and the owner, Rich, and operations director, Jacob, were so great to work with and extremely accommodating over the years. I can say with complete confidence that they're built on good values, and do the best that they can for both their hosts and the house guests. They've repeatedly gone out of the way to accommodate guests at all hours.\n\nI would absolutely recommend Cardo to anyone considering their house as a rental property, or for guests who are interested in any of their properties.",
  },
  {
    name: 'Michael D.', source: 'yelp', rating: 5, date: 'Mar 16, 2021',
    text: 'Rich and his team have managed my Airbnb for nearly two years now, and I have been very satisfied. Rich handled everything, from converting my primary residence into a short term rental, the vacation rental management since then, and found solutions on longer term renters when the pandemic hit and travel was severely restricted. He communicates whenever repairs are necessary, and handles them quickly once I have agreed. I was very nervous when I first moved away from San Diego leaving my house in someone else’s hands, but, at this point, I would recommend this company to anyone who needs a vacation management company.',
  },
  {
    name: 'Jake Kozonis', source: 'google', rating: 5, date: '4 years ago',
    text: "Rich and his team were great to work with! They helped us create a short term plan while our family had an extended trip out of state. It was great to have peace of mind that our primary residence was taken care of and we didn't have a large housing expense while we were away! Rich and his team were able to ensure we had very little vacancy. I'd recommend him and will use his services again when we take another extended trip.",
  },
  {
    name: 'Christopher M.', source: 'yelp', rating: 5, date: 'May 8, 2017', location: 'San Diego, CA',
    text: 'I leased my home to Rich so that he can run it as an Air BnB rental. We are about 9 months in and I couldn’t be happier with the decision. The rent is paid like clockwork and I haven’t had one of those dreaded "tenant calls" that any landlord can relate to. I’ve been to the property a few times and it’s always in immaculate condition, much better than any tenant would keep it. The initial leasing and any back and forth with Rich has always been completely painless. I’ve done the alternative and I’ll never go back if I can help it, I’d recommend this to any landlord hands down.',
  },
  {
    name: 'Douglas W.', source: 'yelp', rating: 5, date: 'Feb 27, 2026',
    text: 'So glad I made the switch to Cardo Vacation Rentals! I spent years with my old real estate manager in San Diego and finally decided to move my rental over to Rich and Krissy at Cardo Vacation Rentals five months ago. It was the best move I could have made. The Cardo team is incredibly proactive, tech-savvy, and they really understand the San Diego market. I’ve felt supported every step of the way, and the performance of my property has never been better. 5/5 stars for service and results! They made our place just pop!',
  },
  {
    name: 'Richard Rodman', source: 'google', rating: 5, date: '2 years ago',
    text: "Great property management company. Super responsive and professional. They've helped rent out our SD place for the past 2 years and we couldn't be happier! Thanks, Cardo!",
  },
  {
    name: 'Kevin M.', source: 'yelp', rating: 5, date: 'Feb 13, 2020', location: 'Encinitas, CA',
    text: 'Cardo knocked it outta the park vaca managing our duplex in OB for us, additionally they took 15 years of headaches off my plate by taking over my Las Gaviotas vaca rental. I recommend Rich and Amanda for your rentals.',
  },
  {
    name: 'Michael M.', source: 'yelp', rating: 5, date: 'Feb 3, 2020',
    text: 'We are very proud of Cardo Vacation Rentals, we used Cardo for roughly two years with one of our properties and we are now working to have another property managed by Cardo.',
  },
];
