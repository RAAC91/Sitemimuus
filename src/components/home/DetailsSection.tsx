'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, VolumeX, Grip, Sparkles, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

const COMPARISON_DATA = {
  blue: {
    id: 'blue',
    before: 'https://ik.imagekit.io/x2or5thkzy/antes%20e%20depois/antes%20azul.png',
    after: 'https://ik.imagekit.io/x2or5thkzy/antes%20e%20depois/depois%20azul.png',
    hex: '#00D9FF'
  },
  black: {
    id: 'black',
    before: 'https://ik.imagekit.io/x2or5thkzy/antes%20e%20depois/ants%20preta.png',
    after: 'https://ik.imagekit.io/x2or5thkzy/antes%20e%20depois/depois%20preta.png',
    hex: '#000000'
  }
}

export default function DetailsSection() {
  const [sliderPos, setSliderPos] = useState(50)
  const [activeColor, setActiveColor] = useState<'blue' | 'black'>('blue')
  const currentModel = COMPARISON_DATA[activeColor]

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }

  return (
    <section className="py-32 bg-[#FFF0F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* ANTES E DEPOIS COMPARISON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 rounded-[4rem] p-8 md:p-20 shadow-3xl relative overflow-hidden mb-32"
        >
          {/* Stars Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="relative z-10 flex flex-col items-center text-center mb-16">
            <span className="text-brand-cyan font-black tracking-widest text-[10px] uppercase mb-4">TRANSFORMAÇÃO</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 leading-[0.95]">
              O poder da <span className="text-white italic">personalização<span className="text-brand-cyan">.</span></span>
            </h2>
            
            {/* Color Switcher */}
            <div className="flex gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
              <button 
                onClick={() => setActiveColor('blue')}
                className={`w-8 h-8 rounded-full border-2 transition-all ${activeColor === 'blue' ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                style={{ backgroundColor: COMPARISON_DATA.blue.hex }}
                aria-label="Ver garrafa azul"
              />
              <button 
                onClick={() => setActiveColor('black')}
                className={`w-8 h-8 rounded-full border-2 transition-all ${activeColor === 'black' ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                style={{ backgroundColor: COMPARISON_DATA.black.hex }}
                aria-label="Ver garrafa preta"
              />
            </div>
          </div>

          {/* THE SLIDER */}
          <div 
            className="relative w-full max-w-[500px] mx-auto aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-ew-resize select-none border-4 border-white/10 shadow-2xl bg-white"
            onMouseMove={handleDrag}
            onTouchMove={handleTouch}
            onClick={handleDrag}
          >
            {/* BEFORE IMAGE */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <img 
                src={currentModel.before} 
                alt="Garrafa original" 
                className="h-[85%] w-full object-contain pointer-events-none"
              />
              <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Original</span>
              </div>
            </div>

            {/* AFTER IMAGE - MOTION GRAPHICS */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden bg-white border-r-2 border-brand-pink shadow-[-10px_0_20px_rgba(0,0,0,0.2)]"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-[500px] h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-cyan-50">
                  {/* Subtle shimmer overlay */}
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-tr ${activeColor === 'blue' ? 'from-brand-cyan/20 via-transparent to-brand-pink/20' : 'from-zinc-800/20 via-transparent to-brand-pink/20'}`} />
                  
                  {/* BRAND NAME - Behind bottle, large */}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter opacity-5">
                      <span className="text-zinc-900">mi</span>
                      <span className="text-brand-pink">mu</span>
                      <span className="text-zinc-900">us</span>
                    </span>
                  </div>

                  {/* PARTICLE BURST ANIMATION - Only when at 50% */}
                  {Math.abs(sliderPos - 50) < 5 && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      {/* Wave 1 - Fades first (0-0.4s) */}
                      <div className="absolute w-12 h-12 rounded-full bg-brand-cyan animate-[burst1_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' }} />
                      <div className="absolute w-10 h-10 rounded-full bg-white animate-[burst1_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 1)' }} />
                      
                      {/* Wave 2 - Fades second (0.2-0.6s) */}
                      <div className="absolute w-10 h-10 rounded-full bg-brand-cyan animate-[burst2_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 35px rgba(0, 217, 255, 0.9)' }} />
                      <div className="absolute w-8 h-8 rounded-full bg-white animate-[burst2_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 25px rgba(255, 255, 255, 0.9)' }} />
                      
                      {/* Wave 3 - Fades third (0.4-0.8s) */}
                      <div className="absolute w-8 h-8 rounded-full bg-brand-cyan animate-[burst3_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)' }} />
                      <div className="absolute w-6 h-6 rounded-full bg-white animate-[burst3_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' }} />
                      
                      {/* Wave 4 - Fades fourth (0.6-1.0s) */}
                      <div className="absolute w-6 h-6 rounded-full bg-brand-cyan animate-[burst4_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 25px rgba(0, 217, 255, 0.7)' }} />
                      <div className="absolute w-5 h-5 rounded-full bg-white animate-[burst4_1.5s_ease-out_forwards]" style={{ boxShadow: '0 0 18px rgba(255, 255, 255, 0.7)' }} />
                      
                      {/* Final dot - Stays (appears at 1.2s) */}
                      <div className="absolute bottom-[15%] right-[20%] w-4 h-4 rounded-full bg-brand-cyan animate-[finalDot_1.5s_ease-out_forwards] opacity-0" style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 1)' }} />
                    </div>
                  )}
                  
                  {/* Soft radial glow */}
                  <div className={`absolute inset-0 ${activeColor === 'blue' ? 'bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.08),transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(255,105,180,0.08),transparent_70%)]'}`} />
                  
                  {/* Bottle - In front of everything */}
                  <div className={`absolute inset-0 flex items-center justify-center z-20 ${activeColor === 'blue' ? 'drop-shadow-[0_0_30px_rgba(0,217,255,0.2)]' : 'drop-shadow-[0_0_30px_rgba(255,105,180,0.2)]'}`}>
                    <img 
                      src={currentModel.after} 
                      alt="Garrafa personalizada Mimuus" 
                      className="h-[85%] w-full object-contain pointer-events-none scale-105 drop-shadow-2xl"
                    />
                  </div>
                  
                  {/* Success message - appears after animation */}
                  {Math.abs(sliderPos - 50) < 5 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                      <div className="text-sm font-black uppercase tracking-widest text-brand-cyan animate-[fadeIn_0.5s_ease-in-out_1.5s_forwards] opacity-0">
                        ✨ Perfeito!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SLIDER HANDLE - ENHANCED WITH BEAM & PARTICLES */}
            <div 
              className="absolute inset-y-0 w-10 -ml-5 flex items-center justify-center z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical Light Beam */}
              <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-brand-cyan to-transparent opacity-60 blur-sm" />
              <div className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent opacity-80" />
              
              {/* Floating Particles around the line */}
              <div className="absolute top-1/4 -left-2 w-1 h-1 rounded-full bg-brand-cyan animate-[float1_2s_ease-in-out_infinite]" style={{ boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)' }} />
              <div className="absolute top-1/3 left-2 w-1.5 h-1.5 rounded-full bg-white animate-[float2_2.5s_ease-in-out_infinite]" style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 1)' }} />
              <div className="absolute top-1/2 -left-3 w-1 h-1 rounded-full bg-brand-cyan animate-[float3_2.2s_ease-in-out_infinite]" style={{ boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)' }} />
              <div className="absolute top-2/3 left-3 w-1 h-1 rounded-full bg-white animate-[float1_2.8s_ease-in-out_infinite]" style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 1)' }} />
              <div className="absolute bottom-1/4 -left-2 w-1.5 h-1.5 rounded-full bg-brand-cyan animate-[float2_2.3s_ease-in-out_infinite]" style={{ boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)' }} />
              
              {/* Handle Circle with glow */}
              <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-brand-pink relative group-hover:scale-110 transition-transform">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-brand-cyan opacity-20 blur-md animate-pulse" />
                <ArrowLeftRight size={16} className="relative z-10" />
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/editor" className="px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-cyan text-white rounded-full font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-2xl inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Personalizar Agora
            </Link>
          </div>
        </motion.div>

        {/* SILICONE BASE BENEFITS */}
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
                icon={<VolumeX className="w-6 h-6" />}
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
                src="https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjhqltxk1qf7a5.webp" 
                className="h-[140%] md:h-[120%] w-auto object-contain translate-y-12 md:translate-y-20 scale-100 md:scale-120 drop-shadow-2xl"
                alt="Base de silicone Mimuus"
              />
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="px-6 py-3 bg-zinc-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 flex items-center gap-2 shadow-2xl">
                  <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                  Base de Silicone Inclusa
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
