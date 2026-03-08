import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Verifica a existência do Access Token no ambiente.
// Exemplo de chave: APP_USR-XXXXXXXXXXXXXXXXXXX 
const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const mercadopagoClient = new MercadoPagoConfig({
  accessToken: mpAccessToken,
  options: {
    timeout: 5000,
    idempotencyKey: 'mimuus_idempotent_key' // Evitar pagamentos duplicados
  }
});

// Clients reutilizáveis para PIX e Checkout Pro
export const mpPayment = new Payment(mercadopagoClient);
export const mpPreference = new Preference(mercadopagoClient);

/**
 * Função utilitária para gerar Pix (linha digitável e QR Code)
 * Útil para Checkout Transparente.
 */
export async function createPixPayment(
  transactionAmount: number,
  description: string,
  payerEmail: string,
  payerFirstName: string,
  payerLastName: string,
  payerCpf: string
) {
  try {
    const payment = await mpPayment.create({
      body: {
        transaction_amount: transactionAmount,
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
          first_name: payerFirstName,
          last_name: payerLastName,
          identification: {
            type: 'CPF',
            number: payerCpf.replace(/\D/g, '') // Garante que serão apenas números
          }
        },
      }
    });

    return {
      success: true,
      data: {
        id: payment.id,
        status: payment.status, // costuma nascer 'pending'
        qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url
      }
    };
  } catch (error) {
    console.error('Mercado Pago PIX Error:', error);
    return { success: false, error: 'Falha ao processar pagamento PIX.' };
  }
}
