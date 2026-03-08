import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Mimuus',
  description: 'Política de Privacidade e Proteção de Dados da Mimuus - LGPD',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-black mb-8">Política de Privacidade</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Última atualização:</strong> 05 de Fevereiro de 2026
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Informações que Coletamos</h2>
          <p>A Mimuus coleta as seguintes informações:</p>
          <ul>
            <li><strong>Dados de Cadastro:</strong> Nome, e-mail, telefone, endereço de entrega</li>
            <li><strong>Dados de Pagamento:</strong> Informações de cartão (tokenizadas via Stripe)</li>
            <li><strong>Dados de Navegação:</strong> Cookies, IP, páginas visitadas, produtos visualizados</li>
            <li><strong>Dados de Personalização:</strong> Designs criados no editor</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Como Usamos Seus Dados</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar comunicações sobre seu pedido</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Personalizar sua experiência de compra</li>
            <li>Prevenir fraudes e garantir segurança</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul>
            <li><strong>Processadores de Pagamento:</strong> Stripe (tokenização segura)</li>
            <li><strong>Transportadoras:</strong> Para entrega de produtos</li>
            <li><strong>Ferramentas de Analytics:</strong> Google Analytics (dados anonimizados)</li>
          </ul>
          <p className="mt-4"><strong>Nunca vendemos seus dados para terceiros.</strong></p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Segurança dos Dados</h2>
          <p>Implementamos medidas de segurança rigorosas:</p>
          <ul>
            <li>Criptografia SSL/TLS em todas as páginas</li>
            <li>Tokenização de dados de pagamento via Stripe</li>
            <li>Autenticação de dois fatores para administradores</li>
            <li>Backups automatizados diários</li>
            <li>Monitoramento contínuo de segurança</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Seus Direitos (LGPD)</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
          <ul>
            <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
            <li><strong>Correção:</strong> Atualizar dados incorretos</li>
            <li><strong>Exclusão:</strong> Solicitar remoção dos seus dados</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
            <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
          </ul>
          <p className="mt-4">
            Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@mimuus.com" className="text-brand-pink">privacidade@mimuus.com</a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
          <p>Utilizamos cookies para:</p>
          <ul>
            <li>Manter você conectado</li>
            <li>Lembrar itens no carrinho</li>
            <li>Analisar tráfego do site</li>
            <li>Personalizar conteúdo</li>
          </ul>
          <p className="mt-4">Você pode gerenciar cookies nas configurações do seu navegador.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Retenção de Dados</h2>
          <p>Mantemos seus dados pelo tempo necessário para:</p>
          <ul>
            <li>Cumprir obrigações legais (5 anos para dados fiscais)</li>
            <li>Resolver disputas</li>
            <li>Prevenir fraudes</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por e-mail.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Contato</h2>
          <p>Para dúvidas sobre privacidade:</p>
          <ul>
            <li><strong>E-mail:</strong> privacidade@mimuus.com</li>
            <li><strong>Telefone:</strong> (11) 9999-9999</li>
            <li><strong>Endereço:</strong> São Paulo, SP</li>
          </ul>
        </section>

        <div className="mt-16 p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Mimuus Comércio de Garrafas Personalizadas LTDA</strong><br />
            CNPJ: XX.XXX.XXX/0001-XX<br />
            Esta política está em conformidade com a Lei nº 13.709/2018 (LGPD)
          </p>
        </div>
      </div>
    </div>
  );
}
