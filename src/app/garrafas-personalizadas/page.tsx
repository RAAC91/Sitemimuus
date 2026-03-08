import { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  title: 'Garrafas Térmicas Personalizadas | Crie a Sua Online | Mimuus',
  description: 'Garrafas térmicas personalizadas de aço inox. Crie online com foto, nome ou logo com nosso editor 3D. Mantém gelado 24h. Frete grátis + Presente perfeito!',
  keywords: [
    'garrafas personalizadas', 'garrafa personalizada', 'squeeze personalizado',
    'garrafa térmica personalizada', 'garrafa com nome', 'garrafa com foto',
    'custom water bottles', 'personalized bottles', 'garrafa tipo stanley',
    'brinde corporativo', 'presente criativo'
  ],
  openGraph: {
    title: 'Garrafas Térmicas Personalizadas | Mimuus',
    description: 'Crie sua garrafa única com nosso editor 3D. Qualidade premium, entrega em todo o Brasil.',
    images: [{ url: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/5.png' }]
  }
};

const faqData = {
  questions: [
    {
      question: "Quanto custa uma garrafa personalizada?",
      answer: "Nossas garrafas personalizadas começam em R$ 89,90. O preço varia conforme o tamanho e quantidade. Oferecemos frete grátis para compras acima de R$ 150."
    },
    {
      question: "Quanto tempo demora para receber?",
      answer: "Produção em 3-5 dias úteis + prazo de entrega dos Correios. O prazo total costuma variar entre 11 e 20 dias úteis dependendo da sua região."
    },
    {
      question: "A personalização sai com o tempo?",
      answer: "Não! Usamos impressão UV de alta qualidade, resistente a lavagens e uso diário. Oferecemos garantia de 9 meses contra descascamento da personalização."
    },
    {
      question: "Posso usar qualquer imagem?",
      answer: "Sim! Você pode fazer upload de fotos, logos ou qualquer imagem no nosso editor 3D. Recomendamos imagens de alta resolução para melhor resultado."
    }
  ]
};

export default function GarrafasPersonalizadasPage() {
  return (
    <>
      <SchemaOrg 
        type="Organization" 
        data={{}} 
      />
      <SchemaOrg 
        type="FAQ" 
        data={faqData} 
      />
      <SchemaOrg
        type="Product"
        data={{
          name: "Garrafa Térmica Personalizada Mimuus",
          description: "Garrafa de aço inox de parede dupla totalmente personalizável.",
          images: ["https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/5.png"],
          price: "89.90",
          inStock: true,
          url: "https://mimuus.com/garrafas-personalizadas"
        }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-brand-pink via-purple-500 to-brand-cyan text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Garrafas Térmicas Personalizadas
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Crie sua garrafa única com nosso editor 3D. Adicione fotos, textos ou logos. 
              Mantém bebidas geladas por 24h e quentes por 12h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/editor"
                className="bg-white text-brand-pink px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition"
              >
                Criar Minha Garrafa
              </Link>
              <Link 
                href="/produtos"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-pink transition"
              >
                Ver Modelos Prontos
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-black mb-6">Por Que Escolher Garrafas Personalizadas Mimuus?</h2>
            
            <div className="grid md:grid-cols-2 gap-8 not-prose mb-12">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">100% Personalizável</h3>
                <p className="text-gray-600">
                  Editor 3D online para criar seu design único. Adicione fotos, textos, logos ou escolha entre centenas de stickers.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">❄️</div>
                <h3 className="text-xl font-bold mb-2">Térmica de Verdade</h3>
                <p className="text-gray-600">
                  Aço inox de parede dupla. Mantém bebidas geladas por 24h e quentes por 12h. Perfeita para academia, trabalho ou viagens.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
                <p className="text-gray-600">
                  Produção em 3-5 dias úteis. Frete grátis acima de R$ 150. Rastreamento em tempo real.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2">Garantia de 9 Meses</h3>
                <p className="text-gray-600">
                  Qualidade premium com garantia estendida. 7 dias para devolução sem burocracia.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-black mb-6">Garrafas Personalizadas para Todas as Ocasiões</h2>
            
            <h3 className="text-2xl font-bold mb-4">🎁 Presentes Personalizados</h3>
            <p>
              Surpreenda com um <strong>presente personalizado único</strong>. Perfeito para Dia das Mães, Dia dos Pais, 
              aniversários, formaturas, casamentos ou qualquer ocasião especial. Uma <strong>garrafa com foto</strong> ou 
              <strong>garrafa com nome</strong> é um presente que emociona e é útil no dia a dia.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-8">💼 Brindes Corporativos</h3>
            <p>
              <strong>Brindes corporativos personalizados</strong> que impressionam. Adicione o logo da sua empresa e 
              crie <strong>brindes empresariais</strong> de alta qualidade. Perfeito para eventos, convenções, kits de 
              boas-vindas ou presentes para clientes e funcionários. Condições especiais para pedidos acima de 50 unidades.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-8">🏃 Academia e Esportes</h3>
            <p>
              <strong>Garrafa para academia</strong> que mantém sua água gelada durante todo o treino. Ideal para 
              crossfit, corrida, ciclismo, yoga ou musculação. <strong>Squeeze personalizado para academia</strong> com 
              seu nome ou frase motivacional.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-8">🌟 Alternativa às Marcas Importadas</h3>
            <p>
              Procurando uma <strong>garrafa tipo Stanley</strong> ou <strong>alternativa Stanley</strong> com personalização? 
              Nossas garrafas têm a mesma qualidade térmica das marcas importadas, mas com o diferencial da personalização 
              total e preço mais acessível. Compare com Hydroflask, Contigo ou Thermos - você vai se surpreender!
            </p>

            <h2 className="text-3xl font-black mb-6 mt-12">Como Funciona?</h2>
            <ol className="space-y-4">
              <li>
                <strong>1. Escolha o modelo:</strong> Selecione tamanho (500ml, 750ml ou 1L) e cor da garrafa
              </li>
              <li>
                <strong>2. Personalize online:</strong> Use nosso editor 3D para adicionar fotos, textos, logos ou stickers
              </li>
              <li>
                <strong>3. Finalize o pedido:</strong> Pagamento seguro via cartão, Pix ou boleto
              </li>
              <li>
                <strong>4. Receba em casa:</strong> Produção rápida e frete grátis acima de R$ 150
              </li>
            </ol>

            <div className="mt-12 p-8 bg-linear-to-r from-brand-pink to-brand-cyan rounded-2xl text-white text-center not-prose">
              <h2 className="text-3xl font-black mb-4">Pronto para Criar Sua Garrafa?</h2>
              <p className="text-xl mb-6">Comece agora e tenha sua garrafa personalizada em poucos dias!</p>
              <Link 
                href="/editor"
                className="inline-block bg-white text-brand-pink px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition"
              >
                Criar Agora - É Grátis!
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-center">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Quanto custa uma garrafa personalizada?</h3>
                <p className="text-gray-600">
                  Nossas garrafas personalizadas começam em R$ 89,90. O preço varia conforme o tamanho e quantidade. 
                  Oferecemos frete grátis para compras acima de R$ 150.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Quanto tempo demora para receber?</h3>
                <p className="text-gray-600">
                  Produção em 3-5 dias úteis + prazo de entrega dos Correios (PAC: 8-15 dias, SEDEX: 3-7 dias). 
                  Total aproximado: 11-20 dias úteis.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">A personalização sai com o tempo?</h3>
                <p className="text-gray-600">
                  Não! Usamos impressão UV de alta qualidade, resistente a lavagens e uso diário. 
                  Garantia de 9 meses contra descascamento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Posso usar qualquer imagem?</h3>
                <p className="text-gray-600">
                  Sim! Você pode fazer upload de fotos, logos ou qualquer imagem. Apenas certifique-se de ter os 
                  direitos da imagem que está usando.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
