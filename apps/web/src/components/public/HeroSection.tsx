export default function HeroSection({
  eyebrow,
  titlePart1,
  titlePart2Em,
  subtitle
}: {
  eyebrow: string
  titlePart1: string
  titlePart2Em?: string
  subtitle: string
}) {
  return (
    <div className="bg-[#001A4D] relative overflow-hidden pt-[120px] px-6 pb-[72px]">
      {/* Background gradients and grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 0% 50%, rgba(0,61,165,0.6), transparent 55%), radial-gradient(ellipse 50% 60% at 100% 20%, rgba(200,164,21,0.06), transparent 50%)'
        }}
      />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '56px 56px'
        }}
      />
      {/* Bottom colored border line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green via-navy via-gold to-orange z-10"
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-[7px] bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase py-1.5 px-3.5 rounded-full mb-[18px]">
          <span className="w-[5px] h-[5px] rounded-full bg-gold"></span>
          {eyebrow}
        </div>
        
        <h1 className="font-heading text-4xl md:text-[56px] font-black text-white leading-[1.06] tracking-[-0.025em] mb-3">
          {titlePart1} {titlePart2Em && <em className="italic text-gold">{titlePart2Em}</em>}
        </h1>
        
        <p className="text-base text-white/50 max-w-[520px] leading-[1.75]">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
