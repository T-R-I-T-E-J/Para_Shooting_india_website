import HeroSection from '@/components/public/HeroSection'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div>
      <HeroSection 
        eyebrow="Who We Are"
        titlePart1="The Governing Body for"
        titlePart2Em="Para Shooting in India"
        subtitle="STC Para Shooting, under the aegis of the Paralympic Committee of India, operates as the supreme authority and management body for disabled shooting sports."
      />
      
      <section className="py-20 px-6 bg-white shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1 space-y-6 text-neutral-600 leading-relaxed text-lg">
              <p>
                The <strong className="text-navy">Paralympic Committee of India (PCI)</strong> is the designated National Sports Federation representing the Paralympic Movement in India. Dedicated to the empowerment of persons with disabilities, PCI provides a platform for elite athletes to showcase their extraordinary talents on an international stage.
              </p>
              <p>
                <strong>STC Para Shooting</strong> is the independent, specialized wing operating directly under PCI. We are charged with the exclusive responsibility to manage, promote, and develop shooting sports specifically for differently-abled athletes across the country.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-[#001A4D] rounded-2xl flex items-center justify-center border border-neutral-100 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yNSI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-40"></div>
              {/* Symbolic Agitos or Indian Flag color motif */}
              <div className="flex flex-col gap-2 relative z-10 w-24">
                <div className="h-6 rounded-full bg-orange w-full origin-left -rotate-[15deg]"></div>
                <div className="h-6 rounded-full bg-white w-full"></div>
                <div className="h-6 rounded-full bg-green w-full origin-left rotate-[15deg]"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-navy mb-2">Our Mission</h3>
              <p className="text-sm text-neutral-500">To systematically scout, train, and field world-class para shooters capable of securing medals at the Paralympic Games and World Championships.</p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-gold text-white rounded-xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-navy mb-2">Our Vision</h3>
              <p className="text-sm text-neutral-500">To create an inclusive society through the power of sport, ensuring para-athletes have equal access to world-class coaching, equipment, and facilities.</p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-orange text-white rounded-xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-navy mb-2">Our Reach</h3>
              <p className="text-sm text-neutral-500">Supporting over 450+ registered athletes across 26 states, forming India's premier paralympic talent pipeline.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
