import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumb 
          items={[{ label: "SOBRE" }]} 
          className="mb-8"
        />
        <h1 className="text-4xl md:text-5xl font-black mb-6">
          Sobre a Mimuus
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Transformamos garrafas em expressões únicas de personalidade.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Nossa História</h2>
          <p className="text-gray-600 mb-6">
            A Mimuus nasceu da ideia de que cada pessoa merece ter produtos que reflitam sua individualidade. 
            Começamos com garrafas térmicas personalizáveis e hoje somos referência em produtos customizados.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Nossa Missão</h2>
          <p className="text-gray-600 mb-6">
            Proporcionar produtos de alta qualidade que permitam às pessoas expressarem sua criatividade 
            e personalidade de forma única e sustentável.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Qualidade Garantida</h2>
          <p className="text-gray-600 mb-6">
            Todos os nossos produtos são fabricados com materiais premium, livres de BPA, 
            e passam por rigoroso controle de qualidade.
          </p>

          <div className="bg-brand-pink/10 rounded-2xl p-8 mt-12">
            <h3 className="text-xl font-bold mb-4">Entre em Contato</h3>
            <p className="text-gray-600">
              Email: contato@mimuus.com.br<br />
              WhatsApp: (11) 99999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
