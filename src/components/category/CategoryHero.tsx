export function CategoryHero() {
  return (
    <section className="relative w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay for text readability */}
        <img 
          src="/hero-lifestyle.jpg" 
          alt="Mimuus Lifestyle" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image missing
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.style.background = 'linear-gradient(to right, #FDFBF7, #FFE4E6)';
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl px-6 pt-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-md">
          Sua Expressão<br/>
          <span className="text-brand-pink italic">
            Em Cada Gole.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
          Design premiado, temperatura perfeita por 24h e personalização 
          que conta <b>impecavelmente</b> a sua história.
        </p>

        {/* Hero CTA */}
        <div className="mt-10">
          <button className="px-8 py-4 bg-white text-brand-black rounded-full font-bold tracking-wide hover:scale-105 transition-transform shadow-lg hover:shadow-glow">
            CRIAR MINHA GARRAFA AGORA
          </button>
        </div>
      </div>
    </section>
  )
}
