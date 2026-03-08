'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface HeroSlide {
  id: number;
  name: string;
  adjective: string;
  image: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES = [
  {
    index: 0,
    id: 1,
    name: 'Pink Punk',
    adjective: 'FASHION',
    image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/1.png',
  },
  {
    index: 1,
    id: 2,
    name: 'Cyan Pop',
    adjective: 'VIBRANTE',
    image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png',
  },
  {
    index: 2,
    id: 6,
    name: 'Fresh Edition',
    adjective: 'ELEGANTE',
    image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/6.png',
  },
  {
    index: 3,
    id: 5,
    name: 'Blackout',
    adjective: 'IRADA',
    image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/5.png',
  },
  {
    index: 4,
    id: 7,
    name: 'Peach Dreams',
    adjective: 'CANDY',
    image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/7.png',
  }
]

export default function HeroSection({ slides = DEFAULT_SLIDES }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const getSlideIndex = (offset: number) => {
    return (current + offset + slides.length) % slides.length
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#F5F5F7] flex items-center justify-center pt-20">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-linear-to-br from-brand-pink/5 to-transparent blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-linear-to-tr from-brand-cyan/5 to-transparent blur-[100px] opacity-30" />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Synchronized Headline Section */}
          <div className="lg:col-span-5 text-center lg:text-left z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black tracking-[0.5em] uppercase mb-4 block text-zinc-400">
                PRODUTO EXCLUSIVO
              </span>
              
              <h1 className="text-4xl md:text-7xl font-black leading-[0.95] mb-8 tracking-tighter text-foreground">
                Chegou a garrafa <br/>
                mais 
                <span className="block h-[1.1em] overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={slides[current].adjective}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block text-brand-pink"
                    >
                      {slides[current].adjective}
                    </motion.span>
                  </AnimatePresence>
                </span>
                do Brasil<span className="text-brand-cyan">.</span>
              </h1>
              
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link 
                  href="/garrafas-personalizadas" 
                  className="bg-accent text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all duration-500 shadow-xl shadow-black/5"
                >
                  GARANTIR A MINHA →
                </Link>
                <Link href="/editor" className="font-bold text-xs tracking-widest border-b-2 border-brand-pink pb-1 hover:text-brand-pink transition-colors text-foreground">
                  PERSONALIZAR AGORA
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Synchronized Selector V2 Section */}
          <div className="lg:col-span-7 relative h-[450px] md:h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              
              <AnimatePresence mode="popLayout" initial={false}>
                {/* Previous (Left) */}
                <motion.div
                  key={`prev-${getSlideIndex(-1)}`}
                  initial={{ opacity: 0, x: -100, scale: 0.3, rotate: -15 }}
                  animate={{ opacity: 0.2, x: -180, scale: 0.45, rotate: -10 }}
                  exit={{ opacity: 0, x: -150, scale: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute z-10 pointer-events-none hidden lg:block"
                >
                  <div className="relative h-[45vh] w-[30vw]">
                    <Image 
                      src={slides[getSlideIndex(-1)].image} 
                      alt=""
                      fill
                      className="object-contain grayscale"
                      sizes="30vw"
                    />
                  </div>
                </motion.div>

                {/* Current (Center) */}
                <motion.div
                  key={`curr-${current}`}
                  initial={{ opacity: 0, scale: 0.4, x: 50, rotate: 15 }}
                  animate={{ opacity: 1, scale: 0.9, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4, x: -50, rotate: -15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="absolute z-30"
                >
                  <Link href="/garrafas-personalizadas" className="relative h-[60vh] md:h-[70vh] w-[80vw] md:w-[40vw] block cursor-pointer">
                    <Image 
                      src={slides[current].image} 
                      alt={slides[current].name}
                      fill
                      priority
                      className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
                      sizes="(max-width: 768px) 80vw, 40vw"
                    />
                  </Link>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className="text-zinc-900 font-black text-4xl md:text-6xl uppercase opacity-5 select-none tracking-[0.2em]">
                      {slides[current].name.split(' ')[0]}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Next (Right) */}
                <motion.div
                  key={`next-${getSlideIndex(1)}`}
                  initial={{ opacity: 0, x: 100, scale: 0.3, rotate: 15 }}
                  animate={{ opacity: 0.2, x: 180, scale: 0.45, rotate: 10 }}
                  exit={{ opacity: 0, x: 150, scale: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute z-10 pointer-events-none hidden lg:block"
                >
                  <div className="relative h-[45vh] w-[30vw]">
                    <Image 
                      src={slides[getSlideIndex(1)].image} 
                      alt=""
                      fill
                      className="object-contain grayscale"
                      sizes="30vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Selector Dots */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center space-x-3 z-40">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                      current === i ? 'w-12 bg-brand-pink' : 'w-4 bg-zinc-100 hover:bg-zinc-200'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
