import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Frete | Mimuus',
  description: 'Informações sobre frete, prazos e entrega da Mimuus',
};

export default function FretePage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-black mb-8">Política de Frete</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Última atualização:</strong> 05 de Fevereiro de 2026
        </p>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-12">
          <p className="text-lg font-bold mb-2">🚚 Frete Grátis</p>
          <p>Para compras acima de <strong>R$ 150,00</strong> em todo o Brasil!</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Opções de Entrega</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-brand-pink pl-6">
              <h3 className="text-xl font-bold mb-2">📦 PAC (Correios)</h3>
              <p><strong>Prazo:</strong> 8 a 15 dias úteis</p>
              <p><strong>Valor:</strong> A partir de R$ 15,00</p>
              <p><strong>Rastreamento:</strong> Sim</p>
            </div>

            <div className="border-l-4 border-brand-cyan pl-6">
              <h3 className="text-xl font-bold mb-2">⚡ SEDEX (Correios)</h3>
              <p><strong>Prazo:</strong> 3 a 7 dias úteis</p>
              <p><strong>Valor:</strong> A partir de R$ 25,00</p>
              <p><strong>Rastreamento:</strong> Sim</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold mb-2">🏃 Entrega Expressa (Capitais)</h3>
              <p><strong>Prazo:</strong> 1 a 2 dias úteis</p>
              <p><strong>Valor:</strong> A partir de R$ 40,00</p>
              <p><strong>Disponível:</strong> SP, RJ, BH, Curitiba, Porto Alegre</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Cálculo do Frete</h2>
          <p>O valor do frete é calculado automaticamente com base em:</p>
          <ul>
            <li><strong>CEP de destino</strong></li>
            <li><strong>Peso e dimensões</strong> do produto</li>
            <li><strong>Modalidade</strong> escolhida</li>
          </ul>
          <p className="mt-4">
            Você pode calcular o frete na página do produto ou no carrinho antes de finalizar a compra.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Prazos de Entrega</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Prazo Total = Produção + Envio</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="font-bold mb-2">⏱️ Tempo de Produção:</p>
            <ul>
              <li><strong>Produtos em estoque:</strong> 1 dia útil</li>
              <li><strong>Produtos personalizados:</strong> 3 a 5 dias úteis</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            * Os prazos começam a contar após a confirmação do pagamento
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Rastreamento</h2>
          <p>Assim que seu pedido for enviado, você receberá:</p>
          <ul>
            <li>E-mail com código de rastreamento</li>
            <li>Link para acompanhar a entrega</li>
            <li>Atualizações automáticas por e-mail</li>
          </ul>
          <p className="mt-4">
            Você também pode rastrear pelo site dos Correios: 
            <a href="https://www.correios.com.br" target="_blank" rel="noopener" className="text-brand-pink ml-2">
              www.correios.com.br
            </a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Áreas de Entrega</h2>
          <p><strong>Entregamos para todo o Brasil!</strong></p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Observações:</h3>
          <ul>
            <li>Áreas remotas podem ter prazo adicional de 5-10 dias</li>
            <li>Não entregamos em caixas postais</li>
            <li>Entregas em condomínios: portaria autorizada a receber</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Problemas na Entrega</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Produto não chegou?</h3>
          <p>Se o prazo passou e você não recebeu:</p>
          <ol>
            <li>Verifique o rastreamento</li>
            <li>Confirme se alguém recebeu (portaria, vizinho)</li>
            <li>Entre em contato: <a href="mailto:entregas@mimuus.com" className="text-brand-pink">entregas@mimuus.com</a></li>
          </ol>

          <h3 className="text-xl font-bold mt-6 mb-3">Produto chegou danificado?</h3>
          <ul>
            <li>Não aceite a entrega se a embalagem estiver visivelmente danificada</li>
            <li>Se aceitou, tire fotos e entre em contato em até 48h</li>
            <li>Faremos a troca sem custo</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Reenvio</h2>
          <p>Se o produto retornar por:</p>
          <ul>
            <li><strong>Endereço incorreto (erro do cliente):</strong> Cliente paga novo frete</li>
            <li><strong>Ausente para receber (3 tentativas):</strong> Cliente paga novo frete</li>
            <li><strong>Erro dos Correios:</strong> Reenviamos sem custo</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Contato</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Dúvidas sobre entrega:</strong></p>
            <p><strong>E-mail:</strong> <a href="mailto:entregas@mimuus.com" className="text-brand-pink">entregas@mimuus.com</a></p>
            <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
          </div>
        </section>
      </div>
    </div>
  );
}
