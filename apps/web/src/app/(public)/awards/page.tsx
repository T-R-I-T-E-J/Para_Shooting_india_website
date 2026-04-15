<<<<<<< Updated upstream
import Link from 'next/link'

const khelRatna = [
  { name: 'Avani Lekhara', event: 'Rifle — R2, R3, R8', year: '2021', achievement: 'Paralympic Gold & Bronze, Tokyo 2020', initials: 'AL' },
  { name: 'Manish Narwal', event: 'Pistol — P1, P4', year: '2021', achievement: 'Paralympic Gold & Silver, Tokyo 2020', initials: 'MN' },
]

const arjuna = [
  { name: 'Manish Narwal', event: 'Pistol — P1, P4', year: '2022', initials: 'MN' },
  { name: 'Singhraj Adhana', event: 'Pistol — P1, P4', year: '2022', initials: 'SA' },
  { name: 'Mona Agarwal', event: 'Rifle — R2, R3', year: '2024', initials: 'MA' },
  { name: 'Naresh Kumar Sharma', event: 'Pistol — P4', year: '2022', initials: 'NK' },
  { name: 'Rubina Francis', event: 'Pistol — P2, P3', year: '2024', initials: 'RF' },
]

const dronacharya = [
  { name: 'Jaiprakash Nautiyal', role: 'Chief National Coach', year: '2022', initials: 'JN' },
  { name: 'Subhash Rana', role: 'Technical Director & Coach', year: '2024', initials: 'SR' },
]

const pefi = [
  { name: 'Mr. Jeevan Lal Rai', role: 'Para Shooting Federation of India', year: '2022', initials: 'JR' },
  { name: 'Vivek Saini', role: 'Administrator & Official', year: '2024', initials: 'VS' },
]

function AwardBadge({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export default function AwardsPage() {
  return (
    <div className="bg-[#000D26] min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.02] leading-none tracking-tighter select-none">
            HONOUR
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Hall of Fame</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            National Sports<br />
            <em className="text-[#C8A415] not-italic">Awards</em>
          </h1>
          <p className="text-white/50 font-body text-lg max-w-2xl leading-relaxed">
            Honouring the extraordinary para shooters and coaches who have earned India's highest sporting recognitions — the pinnacle of athletic achievement.
=======
import type { Metadata } from 'next'
import { Trophy, Medal, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Awards & Recognition | STC Para Shooting',
  description: 'Celebrating excellence in Para Shooting. Discover our distinguished Khel Ratna, Arjuna, and Dronacharya awardees.',
}

export default function AwardsPage() {
  const khelRatnaList = [
    'Avani Lekhara',
    'Manish Narwal'
  ];

  const arjunaList = [
    'Manish Narwal',
    'Singhraj',
    'Mona Agarwal',
    'Naresh Kumar Sharma',
    'Rubina Francis'
  ];

  const dronacharyaList = [
    'Jaiprakash Nautiyal',
    'Subhash Rana'
  ]

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container-main relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium tracking-wide uppercase">Celebrating Excellence</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up delay-100">
            National <span className="text-accent-gradient">Awards</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto animate-fade-in-up delay-200">
             Honoring the pride of India in Para Shooting.
>>>>>>> Stashed changes
          </p>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* Khel Ratna */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex gap-1">
              <AwardBadge color="#C8A415" />
              <AwardBadge color="#C8A415" />
              <AwardBadge color="#C8A415" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">Major Dhyan Chand Khel Ratna</h2>
              <p className="text-[#C8A415]/70 text-[11px] font-bold tracking-widest uppercase mt-0.5">India's Highest Sporting Honour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {khelRatna.map((a) => (
              <div key={a.name} className="group relative bg-gradient-to-br from-[#C8A415]/10 to-[#C8A415]/5 border border-[#C8A415]/30 rounded-none p-8 hover:border-[#C8A415]/60 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C8A415] to-transparent" />
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#C8A415]/15 border border-[#C8A415]/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-[#C8A415] text-lg">{a.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">{a.name}</h3>
                    <p className="text-white/50 text-sm font-semibold mb-3">{a.event}</p>
                    <p className="text-[#C8A415]/80 text-[12px] font-bold tracking-widest uppercase">{a.achievement}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block bg-[#C8A415] text-[#000D26] font-bold text-[11px] tracking-widest uppercase px-3 py-1.5">{a.year}</span>
                  </div>
                </div>
              </div>
=======
      {/* Major Dhyan Chand Khel Ratna Award Section */}
      <section className="py-16 container-main">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-primary mb-4">Major Dhyan Chand Khel Ratna Award</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            The Major Dhyan Chand Khel Ratna Award is India's highest sporting honour, awarded for outstanding performance in the field of sports over a period of four years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto">
          {khelRatnaList.map((name, index) => (
             <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                   <Crown className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-neutral-800">{name}</h3>
                   <span className="text-sm text-neutral-500">Para Shooting</span>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* Arjuna Award Section */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">Arjuna Award</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              The Arjuna Award is given by the Ministry of Youth Affairs and Sports, Government of India, to recognize outstanding achievement in National sports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {arjunaList.map((name, index) => (
               <div key={index} className="bg-neutral-50 p-6 rounded-xl shadow-sm border border-neutral-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                     <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-neutral-800">{name}</h3>
                     <span className="text-sm text-neutral-500">Para Shooting</span>
                  </div>
               </div>
>>>>>>> Stashed changes
            ))}
          </div>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* Arjuna Awards */}
      <section className="py-16 px-6 bg-[#001A4D]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-[#FF671F]/15 border border-[#FF671F]/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF671F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">Arjuna Award</h2>
              <p className="text-[#FF671F]/70 text-[11px] font-bold tracking-widest uppercase mt-0.5">Outstanding Achievement in Sports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {arjuna.map((a) => (
              <div key={a.name + a.year} className="group bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.07] hover:border-[#FF671F]/40 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF671F]/10 border border-[#FF671F]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-[#FF671F] text-sm">{a.initials}</span>
                  </div>
                  <span className="ml-auto bg-[#FF671F]/10 text-[#FF671F] text-[10px] font-bold tracking-widest uppercase px-2 py-1 border border-[#FF671F]/20">{a.year}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">{a.name}</h3>
                <p className="text-white/40 text-sm">{a.event}</p>
              </div>
=======
      {/* Dronacharya Award Section */}
      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">Dronacharya Award</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
               The Dronacharya Award is presented to coaches for producing medal winners at prestigious international sports events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
            {dronacharyaList.map((name, index) => (
               <div key={index} className="bg-white p-8 rounded-xl border border-neutral-200 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                     <Medal className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-neutral-900">{name}</h3>
                  <span className="px-4 py-1 bg-neutral-50 border border-neutral-200 rounded-full text-sm font-medium text-neutral-500">Coach</span>
               </div>
>>>>>>> Stashed changes
            ))}
          </div>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* Dronacharya */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-[#046A38]/30 border border-[#046A38]/50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">Dronacharya Award</h2>
              <p className="text-[#046A38]/80 text-[11px] font-bold tracking-widest uppercase mt-0.5">Excellence in Sports Coaching</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dronacharya.map((c) => (
              <div key={c.name} className="bg-white/[0.04] border border-white/10 p-8 hover:border-[#046A38]/40 transition-all duration-300 flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-[#046A38]/15 border border-[#046A38]/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-[#046A38] text-sm">{c.initials}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-white/40 text-sm mb-3">{c.role}</p>
                  <span className="inline-block bg-[#046A38]/15 text-[#046A38] text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-[#046A38]/30">{c.year}</span>
=======
      {/* 8th PEFI National Award Section */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">8th PEFI National Award</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              The PEFI (Paralympic Education Foundation of India) National Award recognises outstanding contributions to para sports in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto">
            {['Mr. Jeevan Lal Rai', 'Vivek Saini'].map((name, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl shadow-sm border border-neutral-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-800">{name}</h3>
                  <span className="text-sm text-neutral-500">PEFI National Awardee</span>
>>>>>>> Stashed changes
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* PEFI Award */}
      <section className="py-16 px-6 bg-[#001A4D]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">PEFI Award</h2>
              <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase mt-0.5">Para Shooting — Administrative Excellence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pefi.map((p) => (
              <div key={p.name} className="bg-white/[0.04] border border-white/10 p-8 hover:border-white/25 transition-all duration-300 flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-white/60 text-sm">{p.initials}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-white/40 text-sm mb-3">{p.role}</p>
                  <span className="inline-block bg-white/5 text-white/50 text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-white/15">{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Join the Legacy</p>
          <h2 className="font-heading text-4xl font-bold text-white mb-6">Begin Your Journey<br />to National Glory</h2>
          <p className="text-white/40 mb-8 leading-relaxed">Every champion started somewhere. Register today and take the first step towards representing India.</p>
          <Link href="/registration" className="inline-block bg-[#C8A415] text-[#000D26] font-body font-extrabold text-[13px] tracking-widest uppercase px-10 py-4 hover:bg-[#d4b020] transition-colors">
            Register as an Athlete
          </Link>
        </div>
      </section>

=======
>>>>>>> Stashed changes
    </div>
  )
}
