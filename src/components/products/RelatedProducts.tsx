import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export default async function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .select('*')
    //.eq('category', category) // Enable if category column exists
    .neq('id', currentProductId)
    .limit(4)

  if (!products || products.length === 0) return null

  return (
    <section className="py-24 border-t border-zinc-100">
      <h2 className="text-3xl font-black text-zinc-900 mb-12 uppercase tracking-tighter">
        Você também pode <span className="text-brand-pink">vibrar</span> com:
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/produtos/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-square rounded-[2rem] glass border border-zinc-50 overflow-hidden flex items-center justify-center p-8 mb-6 group-hover:shadow-2xl transition-all">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[80%] w-auto object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-zinc-900">
                 NOVO
              </div>
            </div>
            <h3 className="font-black text-zinc-900 uppercase tracking-widest text-sm mb-1 group-hover:text-brand-pink transition-colors">
               {product.name}
            </h3>
            <span className="text-zinc-500 font-bold">{formatPrice(product.price)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
