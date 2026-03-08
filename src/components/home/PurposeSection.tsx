import { Heart, Leaf, Users } from 'lucide-react'

export function PurposeSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Main Message */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
            Por Que Mimuus Existe?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Acreditamos que objetos do dia a dia podem ser{' '}
            <span className="font-bold text-orange-600">únicos, sustentáveis e significativos</span>.
            Cada garrafa conta uma história.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Personalização */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Expressão Pessoal
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Sua garrafa não é só uma garrafa. É uma extensão da sua personalidade, 
              um presente significativo, uma memória materializada.
            </p>
          </div>

          {/* Sustentabilidade */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Impacto Positivo
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Cada garrafa reutilizável substitui centenas de plásticos descartáveis. 
              Juntos, já evitamos mais de 50 mil garrafas plásticas.
            </p>
          </div>

          {/* Comunidade */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Comunidade Criativa
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Mais de 15 mil pessoas já criaram designs únicos. 
              Compartilhe o seu e inspire outras pessoas!
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Pronta para criar a sua garrafa única?
          </p>
          <a
            href="/editor"
            className="inline-block bg-gradient-to-r from-pink-600 via-orange-600 to-amber-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Começar a Personalizar
          </a>
        </div>

      </div>
    </section>
  )
}
