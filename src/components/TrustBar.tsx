import { ShieldCheck, Truck, ThumbsUp, Medal, type LucideIcon } from "lucide-react";

// ... (keep TrustBar component as is, I will target the interface below)

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export function TrustBar() {
  return (
    <section className="w-full py-8 md:py-12 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Main Trust Items */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          <TrustItem 
            icon={Truck} 
            title="Frete Grátis" 
            desc="Para todo Brasil acima de R$ 299" 
          />
          <TrustItem 
            icon={ShieldCheck} 
            title="Garantia Vitalícia" 
            desc="Aço Inox 304 de alta qualidade" 
          />
          <TrustItem 
            icon={ThumbsUp} 
            title="5.000+ Clientes" 
            desc="Aprovado por creators e atletas" 
          />
          <TrustItem 
            icon={Medal} 
            title="Personalização Pro" 
            desc="Impressão UV que não descasca" 
          />
        </div>

        {/* Security & Payment Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="font-medium">100% Seguro (SSL)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">Aceitamos:</span>
            <span>Visa • Mastercard • Pix • Boleto</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ThumbsUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Satisfação Garantida ou Devolvemos o Dinheiro</span>
          </div>
        </div>

      </div>
    </section>
  )
}

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

function TrustItem({ icon: Icon, title, desc }: TrustItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
      <div className="w-12 h-12 bg-brand-gray rounded-full flex items-center justify-center mb-4 text-brand-black">
        <Icon strokeWidth={1.5} size={24} />
      </div>
      <h4 className="font-bold text-brand-black text-sm mb-1">{title}</h4>
      <p className="text-xs text-brand-muted max-w-[150px]">{desc}</p>
    </div>
  )
}
