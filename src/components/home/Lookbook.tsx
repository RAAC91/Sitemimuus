'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Lookbook() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-10 lg:px-0 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden group shadow-2xl h-[600px]"
          >
            <Link href="/garrafas-personalizadas" className="block w-full h-full">
              <Image 
                src="https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/5.png" 
                alt="Urban Edition Collection"
                fill
                className="object-contain object-center transform group-hover:scale-95 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12">
                <span className="text-brand-cyan font-black tracking-widest text-xs mb-4 uppercase">URBAN EDITION</span>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6">A garrafa que combina com seu <span className="text-white">lifestyle<span className="text-brand-cyan">.</span></span></h3>
                <span className="bg-white text-black w-fit px-8 py-4 rounded-full font-black text-xs tracking-widest hover:bg-brand-pink hover:text-white transition-colors">
                  VER LOOKBOOK →
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side Grids */}
          <div className="grid grid-rows-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden group shadow-xl h-[300px]"
            >
              <Link href="/garrafas-personalizadas" className="block w-full h-full">
                <Image 
                  src="https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/4.png" 
                  alt="Product detail"
                  fill
                  className="object-contain object-center transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-brand-pink/10 group-hover:bg-transparent transition-colors" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-[3rem] overflow-hidden group shadow-xl h-[300px]"
            >
              <Link href="/garrafas-personalizadas" className="block w-full h-full">
                <Image 
                  src="https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png" 
                  alt="Product detail"
                  fill
                  className="object-contain object-center transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
