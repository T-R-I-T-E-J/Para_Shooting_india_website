export default function ClassificationCard({
  grade,
  name,
  description,
  colorScheme
}: {
  grade: string
  name: string
  description: string
  colorScheme: 'orange' | 'green' | 'gold' | 'navy'
}) {
  const bgStyles = {
    orange: 'bg-orange/10 text-orange border-orange/20',
    green: 'bg-green/10 text-green border-green/20',
    gold: 'bg-gold/10 text-gold border-gold/20',
    navy: 'bg-navy/10 text-navy border-navy/20'
  }

  const borderStyles = {
    orange: 'hover:border-orange',
    green: 'hover:border-green',
    gold: 'hover:border-gold',
    navy: 'hover:border-navy'
  }

  return (
    <div className={`p-6 bg-white border border-neutral-200 rounded-2xl hover:-translate-y-1 transition-all duration-300 ${borderStyles[colorScheme]}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center border font-heading text-2xl font-black ${bgStyles[colorScheme]}`}>
          {grade}
        </div>
        <h3 className="font-heading text-xl font-bold text-navy flex-1">{name}</h3>
      </div>
      <p className="text-sm text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
