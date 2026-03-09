'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'Gravação a laser de alta precisão',
  'Pedido mínimo reduzido',
  'Embalagens exclusivas para presentes',
  'Atendimento personalizado via WhatsApp'
]

export default function CorporateSection() {
  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden">
      {/* Decorative Cyan Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-cyan/5 -rotate-12 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-cyan font-black tracking-widest uppercase text-xs mb-6 block">
              B2B & BRINDES DE LUXO
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Sua marca em <span className="text-zinc-900">movimento<span className="text-brand-cyan">.</span></span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Muito mais que um brinde, é um presente que fica. Personalize garrafas com o logo da sua empresa para eventos, colaboradores ou clientes VIP.
            </p>
            
            <ul className="space-y-4 mb-12">
              {benefits.map((benefit, i) => (
                <motion.li 
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle2 className="text-brand-cyan w-5 h-5 flex-shrink-0" />
                  <span className="text-zinc-300 font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12 md:mt-16"
            >
              <Link href="/sobre" className="inline-block bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:bg-brand-cyan transition-colors shadow-2xl">
                CONHEÇA NOSSOS PROJETOS
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 5 }}
            whileInView={{ x: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-pink/20 blur-3xl rounded-full" />
            <img 
              src="https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png" 
              alt="Presentes Corporativos" 
              className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
