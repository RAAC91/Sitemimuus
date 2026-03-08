import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trocas e Devoluções | Mimuus',
  description: 'Política de Trocas, Devoluções e Garantia da Mimuus',
};

export default function TrocasPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-black mb-8">Trocas e Devoluções</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Última atualização:</strong> 05 de Fevereiro de 2026
        </p>

        <div className="bg-brand-pink/10 border-l-4 border-brand-pink p-6 mb-12">
          <p className="text-lg font-bold mb-2">Prazo de Arrependimento</p>
          <p>Você tem <strong>7 dias corridos</strong> a partir do recebimento para devolver o produto, conforme o Código de Defesa do Consumidor.</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Direito de Arrependimento (7 dias)</h2>
          <p><strong>Você pode devolver qualquer produto em até 7 dias após o recebimento, sem necessidade de justificativa.</strong></p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Condições:</h3>
          <ul>
            <li>Produto sem uso, na embalagem original</li>
            <li>Todos os acessórios e etiquetas preservados</li>
            <li>Nota fiscal incluída</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Como solicitar:</h3>
          <ol>
            <li>Entre em contato: <a href="mailto:trocas@mimuus.com" className="text-brand-pink">trocas@mimuus.com</a></li>
            <li>Informe número do pedido e motivo</li>
            <li>Aguarde código de postagem gratuito</li>
            <li>Envie o produto pelos Correios</li>
            <li>Reembolso em até 10 dias úteis após recebimento</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Trocas por Defeito (90 dias)</h2>
          <p>Produtos com defeito de fabricação podem ser trocados em até 90 dias.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Defeitos cobertos:</h3>
          <ul>
            <li>Vazamentos</li>
            <li>Tampa com defeito</li>
            <li>Descascamento da personalização</li>
            <li>Rachaduras não causadas por impacto</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Não cobertos:</h3>
          <ul>
            <li>Danos por mau uso ou queda</li>
            <li>Desgaste natural</li>
            <li>Arranhões superficiais</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Produtos Personalizados</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="font-bold mb-2">⚠️ Atenção:</p>
            <p>
              Produtos personalizados (com seu design) <strong>só podem ser trocados em caso de defeito de fabricação</strong>, 
              não por arrependimento, conforme Art. 49 do CDC.
            </p>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">Exceções (trocamos mesmo sendo personalizado):</h3>
          <ul>
            <li>Erro na impressão do design</li>
            <li>Cor diferente da solicitada</li>
            <li>Defeito de fabricação</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Frete de Devolução</h2>
          <ul>
            <li><strong>Arrependimento:</strong> Frete gratuito (enviamos código de postagem)</li>
            <li><strong>Defeito:</strong> Frete gratuito</li>
            <li><strong>Troca de tamanho/cor:</strong> Cliente paga o frete de ida, nós pagamos a volta</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Reembolso</h2>
          <p><strong>Prazo:</strong> Até 10 dias úteis após recebermos o produto</p>
          <p><strong>Forma:</strong> Mesmo método de pagamento usado na compra</p>
          <ul>
            <li>Cartão de crédito: Estorno na fatura</li>
            <li>Pix: Depósito na conta informada</li>
            <li>Boleto: Depósito na conta informada</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Garantia</h2>
          <p><strong>Garantia Legal:</strong> 90 dias (CDC)</p>
          <p><strong>Garantia Estendida Mimuus:</strong> +6 meses contra defeitos de fabricação</p>
          <p className="mt-4">Total: <strong>9 meses de garantia</strong></p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Contato</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>E-mail:</strong> <a href="mailto:trocas@mimuus.com" className="text-brand-pink">trocas@mimuus.com</a></p>
            <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
          </div>
        </section>

        <div className="mt-16 text-center">
          <Link href="/faq" className="inline-block bg-brand-pink text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition">
            Ver Perguntas Frequentes
          </Link>
        </div>
      </div>
    </div>
  );
}
