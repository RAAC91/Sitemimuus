import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Mimuus',
  description: 'Termos e Condições de Uso da Mimuus',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-black mb-8">Termos de Uso</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Última atualização:</strong> 05 de Fevereiro de 2026
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o site da Mimuus, você concorda com estes Termos de Uso. 
            Se não concordar, não utilize nossos serviços.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Uso do Site</h2>
          <p>Você concorda em:</p>
          <ul>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Não usar o site para atividades ilegais</li>
            <li>Não tentar acessar áreas restritas do sistema</li>
            <li>Respeitar direitos autorais e propriedade intelectual</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Produtos e Preços</h2>
          <ul>
            <li>Todos os preços estão em Reais (BRL) e incluem impostos</li>
            <li>Reservamo-nos o direito de alterar preços sem aviso prévio</li>
            <li>Imagens são ilustrativas e podem variar do produto real</li>
            <li>Disponibilidade sujeita a estoque</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Pedidos e Pagamento</h2>
          <ul>
            <li>Pedidos estão sujeitos à aprovação e disponibilidade</li>
            <li>Reservamo-nos o direito de cancelar pedidos suspeitos</li>
            <li>Pagamentos processados via Stripe (seguro e criptografado)</li>
            <li>Confirmação de pedido enviada por e-mail</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Propriedade Intelectual</h2>
          <p>
            Todo conteúdo do site (textos, imagens, logos, designs) é propriedade da Mimuus 
            e protegido por leis de direitos autorais. Uso não autorizado é proibido.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Designs Personalizados</h2>
          <ul>
            <li>Você mantém direitos sobre designs que criar</li>
            <li>Concede à Mimuus licença para produzir o produto</li>
            <li>Não use imagens protegidas por direitos autorais sem permissão</li>
            <li>Mimuus pode recusar designs inapropriados</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Limitação de Responsabilidade</h2>
          <p>A Mimuus não se responsabiliza por:</p>
          <ul>
            <li>Danos indiretos ou consequenciais</li>
            <li>Atrasos de entrega causados por transportadora</li>
            <li>Problemas técnicos fora do nosso controle</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Alterações nos Termos</h2>
          <p>
            Podemos modificar estes termos a qualquer momento. 
            Mudanças significativas serão notificadas por e-mail.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras. 
            Foro da comarca de São Paulo, SP.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">10. Contato</h2>
          <p>Dúvidas sobre os termos:</p>
          <ul>
            <li><strong>E-mail:</strong> contato@mimuus.com</li>
            <li><strong>Telefone:</strong> (11) 9999-9999</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
