export interface NewsArticle {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: 'NEWS' | 'ANNOUNCEMENT' | 'RESULT' | 'EVENT' | 'ACHIEVEMENT' | 'PRESS_RELEASE'
  published_at: string
  featured_image_url?: string
  gradientFrom: string
  gradientTo: string
  author?: string
  documents?: { name: string; url: string }[]
}

export const DUMMY_NEWS: NewsArticle[] = [
  {
    id: 1,
    slug: 'india-wins-3-gold-asian-para-games-2025',
    title: 'India Clinches 3 Gold Medals at Asian Para Games 2025',
    excerpt:
      'Indian para shooters delivered an outstanding performance at the Asian Para Games in Bangkok, securing three gold medals across pistol and rifle events.',
    content: `<p>The Indian para shooting contingent created history at the 2025 Asian Para Games held in Bangkok, Thailand, bringing home three gold medals, two silver, and one bronze — the best-ever haul for the sport at the Games.</p>

<h2>Gold Medal Performances</h2>
<p>Avani Lekhara led the charge, defending her R2 — 10m Air Rifle Women SH1 title with a world-record breaking score of 251.6 points. Her performance drew a standing ovation from the packed gallery at the Huamark Indoor Stadium.</p>

<p>Manish Narwal followed with an emphatic victory in the P4 — 50m Pistol SH1 event, shooting a Games record 218.3. The 21-year-old from Haryana has now won gold at every major international event this quadrennial.</p>

<p>The third gold came from debutant Rudransh Khandelwal in the R1 — 10m Air Rifle Standing SH1, who topped the final with a cool, composed performance under pressure.</p>

<h2>Team India's Statement</h2>
<p>"This is a historic moment for para shooting in India," said National Coach Suma Shirur. "The depth of talent we have now is extraordinary. The next generation is ready."</p>

<p>The Chief National Coach attributed the success to the structured training programmes at the Dr. Karni Singh Shooting Range and the support of the Sports Authority of India's TOPS scheme.</p>

<h2>Road to Paris 2024 Paralympics</h2>
<p>With these results, the entire squad has strengthened their qualification position for the upcoming Paralympic cycle. The federation is targeting a 5-medal haul at the 2028 Los Angeles Paralympics.</p>`,
    category: 'ACHIEVEMENT',
    published_at: '2025-11-18T08:00:00Z',
    gradientFrom: '#046A38',
    gradientTo: '#024D28',
    author: 'STC Para Shooting India',
  },
  {
    id: 2,
    slug: '5th-national-championship-2025-results',
    title: '5th National Para Shooting Championship 2025 — Final Results',
    excerpt:
      'The 5th National Para Shooting Championship concluded in New Delhi with 187 athletes competing across SH1, SH2, and SH3 categories. Full results and rankings now available.',
    content: `<p>The 5th National Para Shooting Championship wrapped up its six-day run at the Dr. Karni Singh Shooting Range, New Delhi, marking the biggest domestic competition in the sport's history with 187 athletes from 22 states.</p>

<h2>Overall Medal Tally</h2>
<p>Maharashtra topped the overall medal standings with 12 gold, 8 silver, and 6 bronze medals, followed by Haryana (9-7-5) and Rajasthan (7-6-9).</p>

<h2>SH1 Highlights</h2>
<p>In the marquee event P1 — 10m Air Pistol Men SH1, defending champion Singhraj Adana retained his title with a championship record score of 244.1 in the final. He edged out last year's silver medallist Rahul Jakhar in a tense shoot-off.</p>

<h2>SH2 Highlights</h2>
<p>The R5 — 10m Air Rifle Standing SH2 final produced a thrilling contest, with Swaroop Mahavir Unhalkar winning by just 0.3 points. His final score of 249.2 is a new national record for the event.</p>

<h2>Upcoming Selection Trials</h2>
<p>Based on these results, the national selectors will announce the training squad for the 2026 World Championships next month. Athletes who placed in the top 8 in their respective events are eligible for consideration.</p>`,
    category: 'RESULT',
    published_at: '2025-12-05T10:30:00Z',
    gradientFrom: '#003DA5',
    gradientTo: '#001A4D',
    author: 'STC Para Shooting India',
    documents: [
      { name: 'Final Results Bulletin — All Events', url: '#' },
      { name: 'National Records Set at Championship', url: '#' },
    ],
  },
  {
    id: 3,
    slug: 'selection-trials-2026-world-championship-announced',
    title: 'Selection Trials for 2026 World Championship Announced',
    excerpt:
      "The federation has announced dates and venues for the selection trials that will determine India's squad for the 2026 WSPS World Shooting Para Sport Championship.",
    content: `<p>STC Para Shooting India has officially announced the selection trials for the 2026 WSPS World Shooting Para Sport Championship. The trials will be held over two rounds in February and March 2026.</p>

<h2>Trial Schedule</h2>
<p><strong>Round 1 — Qualification:</strong> February 14–16, 2026 at Dr. Karni Singh Shooting Range, New Delhi.</p>
<p><strong>Round 2 — Final Selection:</strong> March 7–9, 2026 at Pune Balewadi Sports Complex, Pune.</p>

<h2>Eligibility Criteria</h2>
<p>Athletes must hold a valid classification certificate (SH1, SH2, or SH3) issued no earlier than January 2023. A minimum national ranking of top-20 in the athlete's event as of December 2025 is required to participate in Round 1.</p>

<h2>Selection Policy</h2>
<p>The top two athletes in each event from Round 2 will be nominated for the World Championship squad, subject to meeting the minimum qualification standard (MQS). The full selection policy document is available in the downloads section below.</p>`,
    category: 'ANNOUNCEMENT',
    published_at: '2025-12-20T09:00:00Z',
    gradientFrom: '#C8A415',
    gradientTo: '#A5840D',
    author: 'Selection Committee',
    documents: [
      { name: 'Selection Policy 2026', url: '#' },
      { name: 'Eligibility Criteria Document', url: '#' },
      { name: 'Trial Entry Form', url: '#' },
    ],
  },
  {
    id: 4,
    slug: 'national-classification-camp-may-2026',
    title: 'National Medical Classification Camp — May 2026 Registrations Open',
    excerpt:
      'Registrations are now open for the National Medical Classification Camp scheduled for May 15–17, 2026 at Dr. Karni Singh Shooting Range, New Delhi.',
    content: `<p>STC Para Shooting India, in association with the World Shooting Para Sport (WSPS), is organizing a National Medical Classification Camp from May 15–17, 2026 at the Dr. Karni Singh Shooting Range, New Delhi.</p>

<h2>About the Camp</h2>
<p>The camp will be conducted by two WSPS-certified international classifiers and will cater to athletes seeking their first classification as well as those due for reclassification. A maximum of 24 athletes will be accommodated.</p>

<h2>Who Should Apply</h2>
<ul>
  <li>Athletes with a physical impairment who wish to compete in para shooting for the first time</li>
  <li>Athletes with a "Review" status whose classification is due for reassessment</li>
  <li>Athletes who have experienced a significant change in impairment since their last classification</li>
</ul>

<h2>How to Register</h2>
<p>Submit the completed Medical Classification Application Form along with supporting medical documentation to the federation office by April 30, 2026. Priority will be given to first-time applicants. Travel and accommodation assistance is available for athletes from economically weaker sections.</p>`,
    category: 'EVENT',
    published_at: '2026-01-10T11:00:00Z',
    gradientFrom: '#FF671F',
    gradientTo: '#CC4A0F',
    author: 'STC Para Shooting India',
  },
  {
    id: 5,
    slug: 'avani-lekhara-world-record-2025',
    title: 'Avani Lekhara Sets New World Record in R2 Final',
    excerpt:
      'Paralympic champion Avani Lekhara shattered the world record in the R2 — 10m Air Rifle Women SH1 event with a score of 256.8 at the WSPS World Cup in Chateauroux, France.',
    content: `<p>Avani Lekhara wrote her name once more in the record books, breaking the R2 — 10m Air Rifle Women SH1 world record with a stunning score of 256.8 at the WSPS Para Shooting World Cup in Chateauroux, France.</p>

<p>The previous world record of 253.4, which she herself had set at the Tokyo Paralympics, had stood for four years. Lekhara's new mark surpasses it by a remarkable 3.4 points.</p>

<h2>The Performance</h2>
<p>Avani opened the final with a flawless first series, dropping only 0.2 in ten shots. She maintained her composure through a brief wobble in the fourth series before finishing with a 10.9 on her final shot to confirm the record.</p>

<p>"I've been working on my mental game this season," Avani said post-match. "Today I felt completely in control. The record is nice but I'm focused on consistency heading into the qualification cycle."</p>

<h2>India's Bright Para Shooting Future</h2>
<p>This result follows a string of strong international performances by Indian para shooters this season, reinforcing India's status as a leading nation in the sport globally. The national federation has announced an increased training grant for the top 15 ranked athletes heading into the 2026 championship cycle.</p>`,
    category: 'ACHIEVEMENT',
    published_at: '2025-10-22T14:00:00Z',
    gradientFrom: '#7C3AED',
    gradientTo: '#5B21B6',
    author: 'STC Para Shooting India',
  },
  {
    id: 6,
    slug: 'anti-doping-workshop-march-2026',
    title: 'Anti-Doping Awareness Workshop for Athletes — March 2026',
    excerpt:
      'STC Para Shooting India, in partnership with NADA, will conduct a mandatory anti-doping awareness workshop for all registered athletes on March 12, 2026.',
    content: `<p>STC Para Shooting India, in partnership with the National Anti-Doping Agency (NADA India), will conduct a mandatory anti-doping awareness workshop for all registered national-level para shooting athletes on March 12, 2026 in New Delhi.</p>

<h2>Workshop Coverage</h2>
<ul>
  <li>Understanding the Prohibited List and Therapeutic Use Exemptions (TUE)</li>
  <li>Whereabouts requirements and Out-of-Competition testing</li>
  <li>Supplement risks and how to check product safety</li>
  <li>Rights and responsibilities of athletes under the NADA Code</li>
  <li>Q&A session with a NADA representative</li>
</ul>

<h2>Attendance is Mandatory</h2>
<p>All athletes on the national training squad are required to attend. Athletes who cannot attend in person must complete the NADA e-learning module and submit their certificate to the federation office by April 1, 2026. Non-compliance may result in suspension from national selection.</p>`,
    category: 'ANNOUNCEMENT',
    published_at: '2026-02-01T09:00:00Z',
    gradientFrom: '#DC2626',
    gradientTo: '#991B1B',
    author: 'STC Para Shooting India',
  },
  {
    id: 7,
    slug: 'india-para-shooting-2026-calendar',
    title: 'Domestic Competition Calendar 2026 Released',
    excerpt:
      'STC Para Shooting India has published the full domestic competition calendar for 2026, featuring 8 state-level and 3 national-level events across the year.',
    content: `<p>STC Para Shooting India has released the official domestic competition calendar for 2026, outlining all major national and state-level events. The calendar features a total of 11 sanctioned competitions, the highest number in any single calendar year.</p>

<h2>Highlights of the 2026 Calendar</h2>
<p>The season opens with the Inter-State Para Shooting Championship in Jaipur (February 20–23), followed by the National Selection Trial Round 1 in New Delhi (March 14–16).</p>

<p>The flagship event — the 6th National Para Shooting Championship — will be held in Bhopal from September 18–23, 2026, ahead of the year-end International Trials in November.</p>

<h2>State-Level Circuit</h2>
<p>For the first time, the federation is introducing a structured State-Level Circuit with events in 8 zones. Athletes competing in at least 4 circuit events will earn priority seeding at the National Championship.</p>`,
    category: 'NEWS',
    published_at: '2026-01-05T10:00:00Z',
    gradientFrom: '#0891B2',
    gradientTo: '#0E7490',
    author: 'STC Para Shooting India',
    documents: [
      { name: 'Full Competition Calendar 2026 (PDF)', url: '#' },
    ],
  },
  {
    id: 8,
    slug: 'singhraj-adana-retirement-announcement',
    title: 'Singhraj Adana Announces Retirement from International Competition',
    excerpt:
      'Paralympic medallist and national champion Singhraj Adana has announced his retirement from international para shooting after a decorated career spanning 12 years.',
    content: `<p>Paralympic medallist Singhraj Adana has announced his retirement from international para shooting competition, bringing the curtain down on a glittering career that included a bronze medal at the Tokyo 2020 Paralympic Games and six national championship titles.</p>

<p>"It has been an incredible journey," said Singhraj in a statement released through the federation. "I am proud of what I have achieved and grateful to every coach, teammate, and supporter who has been part of this ride."</p>

<h2>Career Highlights</h2>
<ul>
  <li>Tokyo 2020 Paralympic Games — Bronze, P4 50m Pistol SH1</li>
  <li>6× National Para Shooting Champion</li>
  <li>2022 WSPS World Cup — Gold, 10m Air Pistol SH1</li>
  <li>2019 Asian Para Games — Silver, P4 50m Pistol SH1</li>
</ul>

<h2>Coaching Role</h2>
<p>Singhraj has indicated he will transition into coaching and mentoring young para shooters, having already signed an MoU with the Haryana State Para Sports Federation to set up a training academy in Bahadurgarh.</p>

<p>"The next generation is incredibly talented," he said. "My work is just beginning."</p>`,
    category: 'NEWS',
    published_at: '2025-09-30T08:00:00Z',
    gradientFrom: '#475569',
    gradientTo: '#1E293B',
    author: 'STC Para Shooting India',
  },
]

export const CATEGORY_COLORS: Record<string, string> = {
  NEWS: '#003DA5',
  ANNOUNCEMENT: '#FF671F',
  RESULT: '#046A38',
  EVENT: '#C8A415',
  ACHIEVEMENT: '#7C3AED',
  PRESS_RELEASE: '#DC2626',
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return DUMMY_NEWS.find((a) => a.slug === slug)
}

export function getRelatedArticles(currentId: number, limit = 3): NewsArticle[] {
  return DUMMY_NEWS.filter((a) => a.id !== currentId).slice(0, limit)
}
