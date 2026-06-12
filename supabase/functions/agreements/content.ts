// Single source of truth for the Rental Management Agreement content.
// Imported by the Astro signing page (renders HTML) and the Supabase edge
// function (renders the PDF). Keep this file dependency-free so it runs in
// both Vite and Deno. `**bold**` marks emphasized runs.

export interface TermMeta {
  key: string;
  label: string;
  sub: string;
  prefix?: string;
  suffix?: string;
  default: string;
}

export const TERMS_META: TermMeta[] = [
  { key: 'commissionPct', label: 'Management Commission', sub: '% of rental proceeds · Section 11', suffix: '%', default: '20' },
  { key: 'amenityFee', label: 'Amenity Marketing Program', sub: 'Guest-paid, per reservation', prefix: '$', default: '20' },
  { key: 'homeSafeFee', label: 'Cardo HomeSafe — Premium', sub: 'Guest-paid, per reservation · Section 13', prefix: '$', default: '12' },
  { key: 'homeSafeCoverage', label: 'Cardo HomeSafe — Coverage Amount', sub: 'Covered damage, per claim · Section 13', prefix: '$', default: '5,000' },
  { key: 'homeSafeDeductible', label: 'Cardo HomeSafe — Deductible', sub: 'Per claim · Section 13', prefix: '$', default: '500' },
  { key: 'startupFee', label: 'Engagement Fee — Startup', sub: 'Rolled into first payout · non-refundable', prefix: '$', default: '500' },
  { key: 'lockSyncFee', label: 'Engagement Fee — Lock Sync', sub: 'Rolled into first payout · non-refundable', prefix: '$', default: '190' },
];

export interface AckMeta {
  key: string;
  required: boolean;
  text: string;
}

export const ACKS: AckMeta[] = [
  {
    key: 'ackConsult',
    required: false,
    text: 'I would like Cardo’s design consulting and property assessment, free of charge, before onboarding begins. **(A value of $1,500)**',
  },
  {
    key: 'ackInsurance',
    required: true,
    text: 'I will provide proof of short-term-rental liability insurance naming “Scherf Property Management, LLC” as additionally insured.',
  },
  {
    key: 'ackHourly',
    required: true,
    text: 'General labor requested of Cardo during onboarding is billed at $70 / hour.',
  },
  {
    key: 'ackUtilities',
    required: true,
    text: 'I will set up the utilities and services in Section 7, or allow Cardo to do so with its preferred vendors.',
  },
];

export interface SectionBlock {
  p?: string;
  ul?: string[];
}

export interface Section {
  n: number;
  title: string;
  blocks: SectionBlock[];
}

export const PREAMBLE =
  'This Rental Management Agreement (the “Agreement”) is made between Scherf Property Management, LLC, a California limited liability company doing business as Cardo Vacation Rentals (“Cardo,” “we,” or “us”), and the undersigned property owner (“Owner” or “you”). If there is more than one Owner, the obligations under this Agreement apply to each of you jointly and individually. The numbered terms below govern the relationship; please review them in full before signing.';

export const BACKOUT_CALLOUT = {
  kicker: 'Risk-Free Commitment',
  title: 'A 14-Day Back-Out, No Strings Attached',
  body: 'Change your mind for any reason within 14 days of signing and walk away with no penalty and no termination fee. We hold ourselves to the same bar: if the Home doesn’t meet our guest-readiness standards, Cardo may end the agreement at any time — so you’re only ever committed once it’s truly right.',
};

export const FOOTER_LINE =
  'Scherf Property Management, LLC d/b/a Cardo Vacation Rentals · 3633 Camino del Rio South #101, San Diego, CA 92108 · cardorentals.com';

export const SECTIONS: Section[] = [
  {
    n: 1,
    title: 'The Property & Our Role',
    blocks: [
      { p: 'You appoint Cardo as an independent contractor with the exclusive right to market, operate, and manage your property (the “Home”) as a vacation rental for the term of this Agreement. Cardo is not a tenant and does not take an ownership interest in the Home.' },
    ],
  },
  {
    n: 2,
    title: 'What Cardo Provides',
    blocks: [
      { p: 'In exchange for the Management Fee, Cardo will:' },
      {
        ul: [
          'Market the Home and set nightly rates and minimum-stay requirements based on demand. You may request specific rates or minimums for particular dates or holidays at any time.',
          'Handle all reservations, guest payments, and guest communication before, during, and after each stay, including check-in, check-out, and reviews.',
          'Manage housekeeping using a vetted, licensed California cleaning company. The guest-paid cleaning and materials fee covers standard turnovers; the Home is deep-cleaned at regular intervals at no charge to you.',
          'Collect and remit lodging and sales taxes (such as TOT) to the proper authorities.',
          'Arrange maintenance and repairs as needed — yard care, pool/spa service, plumbing, electrical, and general upkeep — with those costs billed to you (see Section 6).',
        ],
      },
    ],
  },
  {
    n: 3,
    title: 'Guest-Charged Fees',
    blocks: [
      { p: 'Cardo may charge guests industry-standard fees in addition to nightly rent — for example cleaning, damage waiver, pet, concierge, long-stay, and early/late checkout fees. These guest-charged fees are retained by Cardo and are not part of your payout, as they fund the services those fees represent.' },
    ],
  },
  {
    n: 4,
    title: 'Required Home Technology',
    blocks: [
      { p: 'To keep the Home secure between guests and operate it remotely, you agree to install and maintain:' },
      {
        ul: [
          'A digital door lock compatible with Cardo’s lock-management system (e.g., Schlage Encode); and',
          'A high-powered internet router that reaches all usable areas of the property.',
        ],
      },
      { p: 'Where smart devices control Home features, you authorize Cardo to access the related accounts as reasonably needed to operate the Home.' },
    ],
  },
  {
    n: 5,
    title: 'Owner Access & Stays',
    blocks: [
      { p: 'You may reserve the Home for your own use by booking the dates in advance through the Owner Portal, or with prior written approval from Cardo. Please do not enter the Home or its premises without one of these in place — Cardo may schedule last-minute bookings, early check-ins, cleanings, or maintenance without notice, and unannounced entry can disrupt a guest’s stay.' },
      { p: 'An Owner stay incurs the standard cleaning fee, even if only part of the Home is used. You may not clean the Home yourself in place of that fee. You may not rent the Home to others without Cardo’s written permission.' },
    ],
  },
  {
    n: 6,
    title: 'Expenses & Property Upkeep',
    blocks: [
      { p: 'You authorize Cardo to arrange ordinary repairs, replacements, and upkeep to keep the Home rent-ready — for example replacing worn linens or furnishings, touch-up paint, and similar items. These costs are billed to you and deducted from your monthly payout.' },
      { p: 'Cardo may also incur reasonable expenses without prior notice if we believe, in good faith, it’s necessary to protect the Home or its contents from damage. Items damaged by a guest are charged to the guest (normal wear and tear excepted). Cardo may place the Home in “out-of-order” status if we reasonably believe a condition could affect guest safety or the quality of a stay.' },
    ],
  },
  {
    n: 7,
    title: 'Your Responsibilities as Owner',
    blocks: [
      { p: 'Except as expressly handled by Cardo in this Agreement, you remain responsible for the physical, legal, and financial matters of owning the Home. Specifically, you agree to:' },
      {
        ul: [
          'Furnish the Home with the equipment, appliances, and furnishings needed for rental use. Cardo will provide a list of “Must-Have” items; if they’re missing, we may pause the listing until they’re in place.',
          'Pay for utilities and services — gas, electric, water, sewer, internet, cable, trash (including bin-to-curb), and pest control. Disable any pay-per-use services to avoid guest charges; Cardo isn’t responsible for those.',
          'Maintain required insurance (see Section 13) and carry a TOT certificate or permit if your city requires one.',
          'Comply with all laws, permits, licenses, HOA rules, and deed restrictions for operating a vacation rental. Any fines for non-compliance are your responsibility. Cardo may, but isn’t required to, help with permit renewals — but compliance remains yours.',
        ],
      },
    ],
  },
  {
    n: 8,
    title: 'Owner Representations',
    blocks: [
      { p: 'By signing, you confirm that: you lawfully own the Home and have authority to enter this Agreement; doing so doesn’t conflict with any other obligation; the Home is in satisfactory, reasonably safe condition for rental use; and you reasonably believe vacation-rental use isn’t prohibited by any law, deed restriction, or HOA rule. These remain true throughout the term — tell us in writing right away if any of them changes.' },
    ],
  },
  {
    n: 9,
    title: 'Guest Privacy',
    blocks: [
      { p: 'Guest-identifying information (names, contact details, payment information) belongs to Cardo, and you are not entitled to it. Guests have the right to enjoy the Home undisturbed during their stay. If anyone occupies the Home without a valid booking, Cardo will work to resolve it lawfully — through OTA support, law enforcement, or negotiation — and neither party will use force.' },
    ],
  },
  {
    n: 10,
    title: 'Existing Reservations & Sale of the Home',
    blocks: [
      { p: 'You agree to honor all confirmed reservations (“Existing Reservations”), including those that begin after this Agreement ends, if they were booked beforehand. You won’t be responsible for failures caused by events beyond your reasonable control (natural disaster, government order, and similar).' },
      { p: 'If you sell the Home, you agree to sell it subject to this Agreement and its Existing Reservations. Notify Cardo in writing within 24 hours if the Home is listed for sale or you receive a lender’s notice of default. If a sale causes confirmed reservations to be canceled, you may be responsible for the resulting management fees and damages.' },
    ],
  },
  {
    n: 11,
    title: 'Fees & Your Payout',
    blocks: [
      { p: 'Your “Owner Payout” = Rental Proceeds − Transactional Fees − Management Fee − Property Expenses.' },
      {
        ul: [
          'Rental Proceeds = the nightly rent for all nights booked in the period.',
          'Transactional Fees = cleaning fee, damage deposit, channel/merchant fees, taxes, and insurance premium.',
          'Management Fee = the percentage stated on the first page.',
          'Property Expenses = upkeep, vendor, and maintenance costs tied to the Home.',
        ],
      },
      { p: 'All earnings are held in a Cardo trust account and paid to you by the 15th of each month for the prior month’s rentals. Please review each statement promptly; if you spot an error or have a question, email us by the 28th of the month the statement is sent. After that, the payout is considered final.' },
    ],
  },
  {
    n: 12,
    title: 'Outstanding Balances',
    blocks: [
      { p: 'If Home expenses ever exceed your payout in a given month, Cardo carries the balance to your next statement. A service fee of 3% of the outstanding balance applies for each statement the balance is carried, to cover our carrying cost — waived if you pay the balance within 15 days of the statement. If you terminate early or prevent the Home from renting while owing more than $2,000, Cardo may record a lien on the Home for the unpaid amount after giving five days’ written notice.' },
    ],
  },
  {
    n: 13,
    title: 'Insurance',
    blocks: [
      { p: '**Liability insurance (required).** You must carry a short-term-rental liability policy of at least $1,000,000 per occurrence that covers transient rental use and names “Scherf Property Management, LLC” as an additional insured. Provide Cardo a Certificate of Insurance, keep the coverage active, and tell us immediately of any lapse or change. Your policy is primary for incidents at the Home.' },
      { p: '**Cardo HomeSafe — guest damage protection.** Most booking platforms provide little or no damage coverage, leaving owners exposed. Cardo HomeSafe charges guests a per-reservation premium (stated on the first page, along with the coverage amount and deductible) so we can reimburse covered damage to the Home promptly — without waiting on a platform claim. Because Airbnb is the only platform offering its own partial coverage, HomeSafe is required for bookings made anywhere other than Airbnb. Owner stays aren’t charged the premium and aren’t covered.' },
    ],
  },
  {
    n: 14,
    title: 'Photos, Listings & Intellectual Property',
    blocks: [
      { p: 'Photography, video, and listing copy (titles and descriptions) created or paid for by Cardo are Cardo’s property, and Cardo may use them for marketing and training. Imagery you pay for yourself remains yours. You won’t use Cardo-owned materials without our written permission.' },
    ],
  },
  {
    n: 15,
    title: 'Term & Termination',
    blocks: [
      { p: '**Minimum term.** This Agreement starts on the date signed and runs for a minimum of 365 Rentable Days (days the Home is rented or available to rent; Owner-blocked days or blocked maintenance days don’t count). Ending it before the minimum term triggers a $2,000 Early Termination Fee.' },
      { p: '**14-day back-out.** You may cancel for any reason within 14 days of signing with no termination fee — just email owners@cardorentals.com and get a confirming reply. Startup fees already paid are non-refundable.' },
      { p: 'After the minimum term, either party may terminate with written notice setting a Termination Date at least 30 Rentable Days out. Preventing this 30-day rule triggers commission as if the next 30 days following your notice were rented at the average nightly rate. From that date, unreserved dates are blocked; Cardo may continue booking available dates before it. After termination, Cardo releases its reservations to you or the new manager and coordinates handoff; earnings on those stays are paid as under this Agreement.' },
      { p: '**Legal prohibition.** If a government or association rule prohibits rental use through no fault of yours, Cardo may terminate immediately and neither party need honor Existing Reservations. If the loss results from your non-compliance, the minimum term still applies.' },
    ],
  },
  {
    n: 16,
    title: 'No Income Guarantee',
    blocks: [
      { p: 'Cardo doesn’t guarantee any particular amount of rental income and isn’t financially liable for income you anticipated based on any projection, whether from Cardo or another source. We will, of course, work hard to maximize your performance.' },
    ],
  },
  {
    n: 17,
    title: 'Indemnification',
    blocks: [
      { p: 'You agree to defend and hold harmless Cardo, Scherf Property Management, LLC, and its members, officers, employees, and affiliates from third-party claims for property damage or personal injury arising in or about the Home, or from actions taken at your direction — except to the extent a claim is caused solely by Cardo’s own gross negligence or intentional misconduct.' },
    ],
  },
  {
    n: 18,
    title: 'Limitation of Liability',
    blocks: [
      { p: 'To the maximum extent permitted by law, Cardo and its affiliates are not liable for indirect, incidental, consequential, special, or exemplary damages arising from this Agreement. Cardo’s total liability for breach of contract or negligence will not exceed the total Management Fee Cardo received during the 12 months before the event giving rise to the claim.' },
    ],
  },
  {
    n: 19,
    title: 'Governing Law & Disputes',
    blocks: [
      { p: 'This Agreement is governed by the law of the state where the Home is located. Disputes are resolved by binding arbitration before a single arbitrator in the county where the Home is located, except that either party may bring a qualifying claim in small claims court.' },
    ],
  },
  {
    n: 20,
    title: 'General Terms',
    blocks: [
      {
        ul: [
          '**Amendments.** Changes must be in writing. Cardo may propose a written amendment, which takes effect unless you object in writing within 30 days.',
          '**Severability.** If any part is found invalid, the rest stays in effect.',
          '**Waiver.** Not enforcing a term once doesn’t waive it later.',
          '**Survival.** Terms that should logically continue after termination do so.',
          '**Entire Agreement.** This document (with any signed addenda) is the complete agreement and replaces prior understandings.',
          '**Counterparts.** Electronic and faxed signatures are as valid as originals; the Agreement may be signed in counterparts.',
          '**Headings.** Section titles are for convenience and don’t alter the terms.',
        ],
      },
    ],
  },
];

// Renders `**bold**` markers to HTML <strong> runs, escaping everything else.
export function richToHtml(text: string, strongStyle = 'color: #0E1528; font-weight: 600;'): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split(/\*\*/)
    .map((part, i) => (i % 2 === 1 ? `<strong style="${strongStyle}">${esc(part)}</strong>` : esc(part)))
    .join('');
}

export function richToPlain(text: string): string {
  return text.replace(/\*\*/g, '');
}
