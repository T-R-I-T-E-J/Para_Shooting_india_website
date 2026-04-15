export default function AthleteCard({
  name,
  event,
  imageGradientFrom,
  imageGradientTo,
  medals
}: {
  name: string
  event: string
  imageGradientFrom: string
  imageGradientTo: string
  medals: { gold?: number, silver?: number, bronze?: number }
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Placeholder Image using gradients per reference HTML */}
      <div 
        className="aspect-[4/3] w-full relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${imageGradientFrom}, ${imageGradientTo})` }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>
      
      <div className="p-5">
        <div className="text-xs font-bold text-orange tracking-widest uppercase mb-1">{event}</div>
        <h3 className="font-heading text-lg font-bold text-navy mb-4 leading-tight">{name}</h3>
        
        <div className="flex gap-2">
          {medals.gold && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF9C3] text-[#7A6008] rounded-md border border-[#FEF08A] flex-1 justify-center">
              <span className="text-[10px] font-black uppercase">Gold</span>
              <span className="font-mono text-xs font-bold">{medals.gold}</span>
            </div>
          )}
          {medals.silver && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] text-[#475569] rounded-md border border-[#E2E8F0] flex-1 justify-center">
              <span className="text-[10px] font-black uppercase">Silver</span>
              <span className="font-mono text-xs font-bold">{medals.silver}</span>
            </div>
          )}
          {medals.bronze && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] rounded-md border border-[#FDE68A] flex-1 justify-center">
              <span className="text-[10px] font-black uppercase">Bronze</span>
              <span className="font-mono text-xs font-bold">{medals.bronze}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
