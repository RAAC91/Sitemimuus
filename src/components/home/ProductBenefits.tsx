'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Music2, Grip } from 'lucide-react'

export default function ProductBenefits() {
  return (
    <section className="py-32 bg-[#FFF0F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-pink font-black tracking-widest text-[10px] uppercase mb-4 block">DIFERENCIAL MIMUUS</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 mb-10 leading-[0.95]">
              Todo mimo vem <br/>
              <span className="text-zinc-900">completo<span className="text-brand-cyan">.</span></span>
            </h2>
            
            <p className="text-zinc-600 text-lg mb-12 font-medium max-w-lg">
              Não cobramos extras pelo essencial. <strong>A base de silicone vem de brinde.</strong> Porque quando você dá algo com carinho, o detalhe importa.
            </p>

            <div className="space-y-8">
              <BenefitItem 
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Proteção Anti-Impacto"
                desc="Protege a base contra amassados e riscos."
              />
              <BenefitItem 
                icon={<Music2 className="w-6 h-6" />}
                title="Silêncio Absoluto"
                desc="Sem barulho metálico ao apoiar na mesa."
              />
              <BenefitItem 
                icon={<Grip className="w-6 h-6" />}
                title="Grip Antiderrapante"
                desc="Fixa em qualquer superfície, não escorrega."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-[4rem] bg-white shadow-3xl overflow-hidden flex items-center justify-center border border-white/50">
               <img 
                 src="https://ik.imagekit.io/x2or5thkzy/assets/Design%20sem%20nome%20(1).png" 
                 className="h-[140%] md:h-[120%] w-auto object-contain translate-y-12 md:translate-y-20 scale-100 md:scale-120 drop-shadow-2xl"
                 alt="Mimuus product detail"
               />
               
               {/* Label indicator */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="px-6 py-3 bg-zinc-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 flex items-center gap-2 shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                    Borracha de Silicone Inclusa
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

function BenefitItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-pink shadow-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-zinc-900 uppercase tracking-widest text-sm mb-1">{title}</h4>
        <p className="text-zinc-500 text-sm font-medium">{desc}</p>
      </div>
    </div>
  )
}
