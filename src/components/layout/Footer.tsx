import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <span className="text-3xl font-black tracking-tight mb-6 block">
              mi<span className="text-brand-pink">mu</span>us<span className="text-brand-cyan">.</span>
            </span>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sua expressão, sua garrafa. Design vibrante e durabilidade para acompanhar cada momento do seu dia.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/mimuus" target="_blank" className="hover:text-brand-pink transition-colors"><Instagram /></Link>
              <Link href="https://twitter.com/mimuus" target="_blank" className="hover:text-brand-pink transition-colors"><Twitter /></Link>
              <Link href="https://facebook.com/mimuus" target="_blank" className="hover:text-brand-pink transition-colors"><Facebook /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">SHOP</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/produtos" className="hover:text-white transition-colors">Todos os Produtos</Link></li>
              <li><Link href="/categorias/kids" className="hover:text-white transition-colors">Kids</Link></li>
              <li><Link href="/categorias/sports" className="hover:text-white transition-colors">Performance</Link></li>
              <li><Link href="/categorias/corporate" className="hover:text-white transition-colors">Corporativo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">SUPORTE</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/politicas" className="hover:text-white transition-colors">Envios & Devoluções</Link></li>
              <li><Link href="/politicas" className="hover:text-white transition-colors">Garantia</Link></li>
              <li><Link href="/sobre" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">Ganhe 10% OFF na sua primeira compra.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-zinc-900 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-brand-pink outline-none"
              />
              <button className="bg-brand-pink px-4 py-2 rounded-r-lg font-bold hover:bg-rose-600 transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 MIMUUS. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/politicas">Termos de Uso</Link>
            <Link href="/politicas">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
