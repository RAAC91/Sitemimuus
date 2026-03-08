import type { Metadata } from 'next'
import { generateFAQSchema } from '@/lib/schema'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | FAQ Mimuus',
  description:
    'Tire suas dúvidas sobre garrafas térmicas personalizadas. Entenda como funciona a personalização, prazos de entrega, garantias, trocas e mais.',
  keywords: [
    'FAQ garrafas personalizadas',
    'dúvidas garrafa térmica',
    'como personalizar garrafa',
    'prazo entrega garrafa',
  ],
}

const faqs = [
  {
    question: 'Como funciona a personalização?',
    answer:
      'Você escolhe o modelo da garrafa, adiciona seu design (texto, imagens, logos) usando nosso editor visual, confere a prévia 3D e finaliza o pedido. A impressão é feita com tecnologia UV de alta durabilidade.',
  },
  {
    question: 'Qual o prazo de entrega?',
    answer:
      'Produzimos em 2-3 dias úteis e o frete varia de 5 a 15 dias úteis conforme sua região. Você recebe o código de rastreamento por e-mail.',
  },
  {
    question: 'Posso trocar ou devolver?',
    answer:
      'Sim! Você tem 30 dias para solicitar troca ou devolução de produtos com defeito de fabricação. Produtos personalizados sem defeito não podem ser trocados.',
  },
  {
    question: 'As garrafas são realmente térmicas?',
    answer:
      'Sim! Nossas garrafas usam parede dupla de aço inox 304 com vácuo. Mantém bebidas geladas por até 24 horas e quentes por até 12 horas.',
  },
  {
    question: 'A impressão descasca ou sai com o tempo?',
    answer:
      'Não! Usamos impressão UV profissional que penetra no material. A estampa é resistente a arranhões, água e não descasca mesmo após anos de uso.',
  },
  {
    question: 'Qual o valor do frete?',
    answer:
      'O frete é calculado automaticamente no checkout baseado no seu CEP. Oferecemos frete grátis para compras acima de R$ 299.',
  },
  {
    question: 'Posso pedir garrafas personalizadas em quantidade (atacado)?',
    answer:
      'Sim! Para pedidos acima de 50 unidades, entre em contato pelo WhatsApp para orçamento personalizado com desconto.',
  },
  {
    question: 'A garrafa vem com garantia?',
    answer:
      'Sim! Oferecemos garantia vitalícia contra defeitos de fabricação no aço inox. A impressão tem garantia de 1 ano.',
  },
  {
    question: 'Quais formas de pagamento vocês aceitam?',
    answer:
      'Aceitamos cartões de crédito (em até 12x), PIX (com 5% de desconto), boleto bancário e cartões de débito.',
  },
  {
    question: 'Posso cancelar meu pedido?',
    answer:
      'Pedidos podem ser cancelados em até 2 horas após a confirmação. Após esse prazo, a personalização já foi iniciada e não é possível cancelar.',
  },
  {
    question: 'A garrafa é livre de BPA?',
    answer:
      'Sim! Nossas garrafas são 100% livres de BPA e outros compostos tóxicos. Feitas em aço inox 304 de grau alimentício.',
  },
  {
    question: 'Quanto tempo dura a garrafa térmica?',
    answer:
      'Com uso adequado, a garrafa dura anos. O aço inox é extremamente resistente e não enferruja. A impressão UV mantém a qualidade por muitos anos.',
  },
  {
    question: 'Posso colocar a garrafa na geladeira/freezer?',
    answer:
      'Sim, pode colocar na geladeira. NÃO coloque no freezer, pois líquidos congelados podem expandir e danificar o vácuo interno.',
  },
  {
    question: 'A garrafa pode ir na máquina de lavar louça?',
    answer:
      'Recomendamos lavagem manual com água morna e sabão neutro para preservar a impressão. A alta temperatura da lava-louças pode danificar a estampa ao longo do tempo.',
  },
  {
    question: 'Como limpar a garrafa térmica corretamente?',
    answer:
      'Lave com água morna, sabão neutro e uma escova de garrafa. Seque bem antes de fechar. Para limpeza profunda, use bicarbonato de sódio.',
  },
  {
    question: 'Posso colocar bebidas carbonatadas (refrigerante)?',
    answer:
      'Sim, mas abra a tampa com cuidado para liberar a pressão gradualmente. Não deixe bebidas carbonatadas fechadas por mais de 12 horas.',
  },
  {
    question: 'A garrafa tem tampa à prova de vazamento?',
    answer:
      'Sim! Todos os modelos possuem vedação de silicone de alta qualidade que impede vazamentos quando a tampa está bem fechada.',
  },
  {
    question: 'Vocês entregam para todo o Brasil?',
    answer:
      'Sim! Fazemos entregas para todos os estados brasileiros via Correios e transportadoras parceiras.',
  },
  {
    question: 'Posso rastrear meu pedido?',
    answer:
      'Sim! Assim que o pedido for postado, você recebe o código de rastreamento por e-mail e pode acompanhar em tempo real.',
  },
  {
    question: 'Como sei que meu pedido foi confirmado?',
    answer:
      'Você recebe um e-mail de confirmação imediatamente após a aprovação do pagamento com todos os detalhes do pedido.',
  },
  {
    question: 'É seguro comprar no site?',
    answer:
      'Sim! Nosso site possui certificado SSL, criptografia de dados e processamento de pagamento via plataformas seguras (Stripe/MercadoPago).',
  },
  {
    question: 'Posso editar meu design depois de finalizar o pedido?',
    answer:
      'Infelizmente não. Após a confirmação, a produção é iniciada imediatamente. Revise bem o design antes de finalizar.',
  },
]

export default function FAQPage() {
  const schema = generateFAQSchema(
    faqs.map((f) => ({ question: f.question, answer: f.answer }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <Breadcrumb 
            items={[{ label: "FAQ" }]} 
            className="mb-8"
          />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-600">
              Tire todas as suas dúvidas sobre garrafas personalizadas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-gray-200"
              >
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-pink-50 to-orange-50 rounded-3xl p-12 border border-pink-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Ainda tem dúvidas?
            </h2>
            <p className="text-gray-700 mb-6">
              Entre em contato via WhatsApp ou e-mail. Respondemos em até 2
              horas!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="mailto:contato@mimuus.com"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                E-mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
