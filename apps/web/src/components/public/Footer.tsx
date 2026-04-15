import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#001A4D] text-white/55 pt-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-11 border-b border-white/10">
          
          {/* Col 1 */}
          <div>
            <div className="font-heading text-[17px] font-bold text-white mb-1">STC Para Shooting</div>
            <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-gold mb-3">Paralympic Committee of India</div>
            <p className="text-xs leading-relaxed max-w-[280px]">
              Founded to promote and popularize shooting sports among para-athletes in India. Committed to developing world-class shooters and championing inclusion through sport.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white mb-3">Quick Links</div>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-xs text-white/45 hover:text-white transition-colors">About Us</Link>
              <Link href="/results" className="text-xs text-white/45 hover:text-white transition-colors">Championships</Link>
              <Link href="/policies" className="text-xs text-white/45 hover:text-white transition-colors">Policies</Link>
              <Link href="/classification" className="text-xs text-white/45 hover:text-white transition-colors">Classification</Link>
              <Link href="/contact" className="text-xs text-white/45 hover:text-white transition-colors">Contact</Link>
              <Link href="/accessibility" className="text-xs text-white/45 hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white mb-3">Useful Links</div>
            <div className="flex flex-col gap-2">
              <a href="https://www.issf-sports.org" target="_blank" rel="noopener noreferrer" className="text-xs text-white/45 hover:text-white transition-colors flex items-center justify-between w-content max-w-[200px]">ISSF <span className="text-[10px]">↗</span></a>
              <a href="https://www.paralympic.org/shooting" target="_blank" rel="noopener noreferrer" className="text-xs text-white/45 hover:text-white transition-colors flex items-center justify-between w-content max-w-[200px]">World Para Shooting <span className="text-[10px]">↗</span></a>
              <a href="https://www.paralympicindia.org" target="_blank" rel="noopener noreferrer" className="text-xs text-white/45 hover:text-white transition-colors flex items-center justify-between w-content max-w-[200px]">Paralympic Committee of India <span className="text-[10px]">↗</span></a>
              <a href="https://www.sportsauthorityofindia.nic.in" target="_blank" rel="noopener noreferrer" className="text-xs text-white/45 hover:text-white transition-colors flex items-center justify-between w-content max-w-[200px]">Sports Authority of India <span className="text-[10px]">↗</span></a>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white mb-3">Contact Us</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-[11px] mb-2">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Jaisalmer House, 26 Mansingh Road, New Delhi – 110011</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] mb-2">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/>
                </svg>
                <span>+91-11-23075126</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] mb-2">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                   <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>info@parashooting.org</span>
              </div>
              <div className="flex gap-3 mt-3">
                <a href="https://x.com/paralympicindia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors" aria-label="X (formerly Twitter)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.54H5.078z"/></svg>
                </a>
                <a href="https://instagram.com/paralympicindia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://youtube.com/paralympicindia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors" aria-label="YouTube">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 flex flex-col md:flex-row items-center justify-between flex-wrap gap-2 text-[11px]">
          <span>© 2026 STC Para Shooting (Paralympic Committee of India). All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/35 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/35 hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/accessibility" className="text-white/35 hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
        
        {/* Supported by */}
        <div className="py-3 text-center text-[11px] text-white/25 border-t border-white/5 mx-auto w-full">
          Supported by &nbsp;★&nbsp; Ministry of Youth Affairs &amp; Sports, Government of India &nbsp;·&nbsp; Recognised by IPC Germany, IWAS UK, APC UAE
        </div>
      </div>
    </footer>
  )
}
