import HeroSection from '@/components/public/HeroSection'
import ContactForm from '@/components/public/ContactForm'
import Link from 'next/link'

const leadershipCards = [
  {
    role: 'Administration',
    name: 'Mr. Pramod Raje',
    credential: 'NS-NIS & ISSF Coach D License · WSPS & ISSF Judge',
    phone: '+91 95827 43138',
    phoneTel: '+919582743138',
    email: 'stcparashootng@gmail.com',
  },
  {
    role: 'Administrative — Range Coordination',
    name: 'Mr. Pavittar',
    credential: 'ISSF Coach C and D',
    phone: '+91 70152 64709',
    phoneTel: '+917015264709',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Administrative — Office Queries',
    name: 'Mr. Hardik Rajput',
    credential: 'Administrative Support',
    phone: '+91 98106 44202',
    phoneTel: '+919810644202',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Technical Rules & Conduct — Rifle/Pistol',
    name: 'Mr. Vivek Saini',
    credential: 'WSPS & ISSF Jury · Director Sports Ops-PCI · 8th PEFI National Awardee',
    phone: '+91 88025 62883',
    phoneTel: '+918802562883',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Equipment Technical Rules & Conduct',
    name: 'Mr. Charanjeet Singh Ghuman',
    credential: 'WSPS & ISSF Jury',
    phone: '+91 93555 97111',
    phoneTel: '+919355597111',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Medical Classification Incharge',
    name: 'Ms. Guranchal Pawar',
    credential: 'Medical Classifier',
    phone: '+91 98151 11552',
    phoneTel: '+919815111552',
    email: 'medicalclassification@gmail.com',
  },
  {
    role: 'Medical Classification Co-ordinator',
    name: 'Mr. Ishwar Singh',
    credential: 'Medical Classification Support',
    phone: '+91 98136 49016',
    phoneTel: '+919813649016',
    email: 'medicalclassification@gmail.com',
  },
  {
    role: 'Education Program Incharge',
    name: 'Wing Comdr. Shantanu',
    credential: 'International Medalist in Para Sports',
    phone: '+91 80079 12900',
    phoneTel: '+918007912900',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Media Incharge',
    name: 'Mr. Shantnu Thakur',
    credential: 'WSPS & ISSF Judge',
    phone: '+91 94666 67417',
    phoneTel: '+919466667417',
    email: 'stcparashootng@gmail.com',
  },
  {
    role: 'Competition Incharge',
    name: 'Mr. Amit Panwar',
    credential: 'WSPS Judge',
    phone: '+91 83077 12992',
    phoneTel: '+918307712992',
    email: 'theparashootingindia@gmail.com',
  },
]

const zoneIncharges = [
  { zone: 'East Zone', name: 'Ms. Sanjana Baruah', phone: '+91 96129 05586', phoneTel: '+919612905586', credential: 'WSPS & ISSF Jury' },
  { zone: 'West Zone', name: 'Mr. Aakash Kumbhar', phone: '+91 76665 20812', phoneTel: '+917666520812', credential: 'Founder & Treasurer Para Target Shooting Association Pune' },
  { zone: 'South Zone', name: 'Mr. Varanasi Sandeep', phone: '+91 90521 26394', phoneTel: '+919052126394', credential: 'WSPS & ISSF Judge' },
  { zone: 'North Zone', name: 'Mr. Shiva Kkaranwal', phone: '+91 91050 35678', phoneTel: '+919105035678', credential: 'WSPS & ISSF Judge' },
]

const directoryRows = [
  { role: 'Chairperson — STC Para Shooting', name: 'Mr. Jaiprakash Nautiyal', phone: '+91 95600 50909', phoneTel: '+919560050909', email: 'chairmanparashooting@paralympicindia.com', badge: 'Chairman', badgeStyle: 'bg-gold/10 text-[#7A6008] border border-gold/30' },
  { role: 'Administration', name: 'Mr. Pramod Raje', phone: '+91 95827 43138', phoneTel: '+919582743138', email: 'stcparashootng@gmail.com', badge: 'Administration', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Administrative — Range Coordination', name: 'Mr. Pavittar', phone: '+91 70152 64709', phoneTel: '+917015264709', email: 'theparashootingindia@gmail.com', badge: 'Administration', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Administrative — Office Queries', name: 'Mr. Hardik Rajput', phone: '+91 98106 44202', phoneTel: '+919810644202', email: 'theparashootingindia@gmail.com', badge: 'Administration', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Technical Rules & Conduct — Rifle/Pistol', name: 'Mr. Vivek Saini', phone: '+91 88025 62883', phoneTel: '+918802562883', email: 'theparashootingindia@gmail.com', badge: 'Technical', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'Equipment Technical Rules & Conduct', name: 'Mr. Charanjeet Singh Ghuman', phone: '+91 93555 97111', phoneTel: '+919355597111', email: 'theparashootingindia@gmail.com', badge: 'Technical', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'East Zone Incharge', name: 'Ms. Sanjana Baruah', phone: '+91 96129 05586', phoneTel: '+919612905586', email: 'theparashootingindia@gmail.com', badge: 'East Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'West Zone Incharge', name: 'Mr. Aakash Kumbhar', phone: '+91 76665 20812', phoneTel: '+917666520812', email: 'theparashootingindia@gmail.com', badge: 'West Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'South Zone Incharge', name: 'Mr. Varanasi Sandeep', phone: '+91 90521 26394', phoneTel: '+919052126394', email: 'stcparashootng@gmail.com', badge: 'South Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'North Zone Incharge', name: 'Mr. Shiva Kkaranwal', phone: '+91 91050 35678', phoneTel: '+919105035678', email: 'stcparashootng@gmail.com', badge: 'North Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'Medical Classification Incharge', name: 'Ms. Guranchal Pawar', phone: '+91 98151 11552', phoneTel: '+919815111552', email: 'medicalclassification@gmail.com', badge: 'Medical', badgeStyle: 'bg-red-50 text-red-700 border border-red-200' },
  { role: 'Medical Classification Co-ordinator', name: 'Mr. Ishwar Singh', phone: '+91 98136 49016', phoneTel: '+919813649016', email: 'medicalclassification@gmail.com', badge: 'Medical', badgeStyle: 'bg-red-50 text-red-700 border border-red-200' },
  { role: 'Education Program Incharge', name: 'Wing Comdr. Shantanu', phone: '+91 80079 12900', phoneTel: '+918007912900', email: 'theparashootingindia@gmail.com', badge: 'Education', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'Media Incharge', name: 'Mr. Shantnu Thakur', phone: '+91 94666 67417', phoneTel: '+919466667417', email: 'stcparashootng@gmail.com', badge: 'Media', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Competition Incharge', name: 'Mr. Amit Panwar', phone: '+91 83077 12992', phoneTel: '+918307712992', email: 'theparashootingindia@gmail.com', badge: 'Competition', badgeStyle: 'bg-green/8 text-green border border-green/20' },
]

export default function ContactPage() {
  return (
    <div>
      <HeroSection
        eyebrow="Paralympic Committee of India"
        titlePart1="Contact"
        titlePart2Em="STC Para Shooting"
        subtitle="Reach out to our national leadership team, zone coordinators, and support staff."
      />

      {/* ── Quick Contact Bar ── */}
      <div className="bg-white border-b-[3px] border-navy shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center divide-x divide-neutral-100">
            <a href="tel:+919560050909" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Chairman&apos;s Office</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">+91 95600 50909</span>
              </div>
            </a>
            <a href="mailto:chairmanparashooting@paralympicindia.com" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Official Email</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">chairmanparashooting@paralympicindia.com</span>
              </div>
            </a>
            <a href="mailto:stcparashooting@gmail.com" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">STC Communication</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">stcparashooting@gmail.com</span>
              </div>
            </a>
            <div className="flex items-center gap-3 px-8 py-5">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Head Office</span>
                <span className="block text-sm font-semibold text-navy">Jaisalmer House, New Delhi – 110011</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Leadership Section ── */}
      <section className="py-18 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">STC Leadership</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-10">Committee Members</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Chairman — full-width featured card */}
            <div className="md:col-span-2 xl:col-span-3 bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-2xl p-8 border border-transparent grid grid-cols-1 md:grid-cols-2 gap-6 items-center group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <span className="inline-block text-[11px] font-bold tracking-[0.1em] bg-gold/15 border border-gold/30 text-gold px-3 py-1 rounded-full mb-3">
                  Dronacharya Awardee
                </span>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-2">Chairperson — STC Para Shooting</p>
                <h3 className="font-heading text-3xl font-bold text-white mb-1">Mr. Jaiprakash Nautiyal</h3>
                <p className="text-sm text-white/55">Dronacharya Awardee · Paralympic Committee of India · WSPS & ISSF Judge</p>
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 md:border-t-0 md:pt-0">
                <a href="tel:+919560050909" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  +91 95600 50909
                </a>
                <a href="mailto:chairmanparashooting@paralympicindia.com" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors break-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  chairmanparashooting@paralympicindia.com
                </a>
                <a href="mailto:stcparashooting@gmail.com" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  stcparashooting@gmail.com
                </a>
              </div>
            </div>

            {/* Regular leader cards */}
            {leadershipCards.map((leader) => (
              <div key={leader.name} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-navy to-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-2">{leader.role}</p>
                <h3 className="font-heading text-lg font-bold text-navy mb-1">{leader.name}</h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">{leader.credential}</p>
                <div className="flex flex-col gap-1.5 pt-3 border-t border-neutral-100">
                  <a href={`tel:${leader.phoneTel}`} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-navy transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 flex-shrink-0" />
                    {leader.phone}
                  </a>
                  <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-navy transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 flex-shrink-0" />
                    {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zone Incharges ── */}
      <section className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Regional Coverage</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-8">Zone Incharges</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {zoneIncharges.map((z) => (
              <div key={z.zone} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm text-center hover:-translate-y-1 hover:border-navy hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-navy mx-auto mb-3 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-1">{z.zone}</p>
                <h3 className="font-heading text-[15px] font-bold text-navy mb-2">{z.name}</h3>
                <a href={`tel:${z.phoneTel}`} className="text-xs text-neutral-600 font-mono hover:text-navy transition-colors">{z.phone}</a>
              </div>
            ))}
          </div>

          {/* Zone email & additional info */}
          <div className="mt-5 bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-3">Zone Contact Email</p>
            <p className="text-sm text-neutral-600">All zone incharges can be reached at <a href="mailto:theparashootingindia@gmail.com" className="text-navy font-semibold hover:underline">theparashootingindia@gmail.com</a> or <a href="mailto:stcparashootng@gmail.com" className="text-navy font-semibold hover:underline">stcparashootng@gmail.com</a></p>
          </div>
        </div>
      </section>

      {/* ── Full Directory Table ── */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Complete Directory</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-8">Full Contact List — STC Para Shooting</h2>

          <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
            <div className="bg-navy px-7 py-5 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">STC Para Shooting — Contact Directory</h3>
              <span className="text-[11px] text-white/50 tracking-[0.1em] uppercase">Paralympic Committee of India</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#F0F4FF]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Role</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Name</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Phone</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Email</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {directoryRows.map((row) => (
                    <tr key={`${row.name}-${row.role}`} className="hover:bg-[#F8F9FF] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800">{row.role}</td>
                      <td className="px-5 py-3.5 font-heading text-sm font-bold text-navy">{row.name}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-neutral-600">
                        {row.phoneTel ? (
                          <a href={`tel:${row.phoneTel}`} className="hover:text-navy transition-colors">{row.phone}</a>
                        ) : row.phone}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-600">
                        <a href={`mailto:${row.email}`} className="hover:text-navy transition-colors">{row.email}</a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block text-[10px] font-bold tracking-[0.05em] px-2.5 py-1 rounded-full ${row.badgeStyle}`}>{row.badge}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form + Office ── */}
      <section className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Get In Touch</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-10">Send Us a Message</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
            {/* Office Info Card */}
            <div className="bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-2xl p-9 text-white h-fit">
              <h3 className="font-heading text-2xl font-bold text-white mb-1">Our Office</h3>
              <p className="text-sm text-white/50 mb-8">Paralympic Committee of India — Para Shooting Division</p>

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Address</p>
                  <p className="text-sm text-white/85 leading-relaxed">Jaisalmer House<br />26 Mansingh Road<br />New Delhi — 110011</p>
                </div>
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Phone</p>
                  <a href="tel:+911123075126" className="text-sm text-white/85 hover:text-white transition-colors">+91-11-23075126</a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Official Communication</p>
                  <a href="mailto:stcparashooting@gmail.com" className="block text-sm text-white/85 hover:text-white transition-colors">stcparashooting@gmail.com</a>
                  <a href="mailto:theparashootingindia@gmail.com" className="block text-sm text-white/85 hover:text-white transition-colors">theparashootingindia@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Chairman&apos;s Direct</p>
                  <a href="mailto:chairmanparashooting@paralympicindia.com" className="text-sm text-white/85 hover:text-white transition-colors break-all">chairmanparashooting@paralympicindia.com</a>
                </div>
              </div>

              <div className="h-px bg-white/10 my-6" />
              <p className="text-xs text-white/40 italic leading-relaxed">
                &ldquo;Empowering Para-Athletes to Achieve Excellence&rdquo;<br />
                — Mr. Jaiprakash Nautiyal, Chairperson STC
              </p>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#001A4D] to-[#003DA5] text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">Ready to Join Para Shooting?</h2>
        <p className="text-base text-white/55 mb-8 max-w-lg mx-auto">Register as a shooter, check classifications, or explore upcoming championships across India.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/registration" className="px-7 py-3.5 bg-orange text-white font-bold text-sm rounded-xl hover:bg-orange/90 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(255,103,31,0.4)]">
            Register as Shooter
          </Link>
          <Link href="/classification" className="px-7 py-3.5 bg-transparent text-white border border-white/30 font-semibold text-sm rounded-xl hover:border-white hover:bg-white/8 transition-all">
            View Classification
          </Link>
          <Link href="/events" className="px-7 py-3.5 bg-transparent text-white border border-white/30 font-semibold text-sm rounded-xl hover:border-white hover:bg-white/8 transition-all">
            Championships
          </Link>
        </div>
      </section>
    </div>
  )
}
