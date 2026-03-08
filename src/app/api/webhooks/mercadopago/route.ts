import { NextResponse } from "next/server";
import postgres from 'postgres';
import { sendOrderConfirmation } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");
    
    // O Mercado Pago manda JSON no body e args na querystring
    const body = await req.json().catch(() => ({} as Record<string, unknown>));

    // Se é atualização de pagamento ('payment')
    // Podemos tentar pegar o ID do pagamento de data.id no JSON ou da URL
    const paymentId = body?.data?.id || id;
    const topic = body?.type || body?.topic || type;

    if (topic === 'payment' && paymentId) {
      // Buscar status do pagamento da própria API do Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      });
      
      const paymentData = await mpResponse.json();

      if (paymentData.status === 'approved') {
         // Atualiza no banco: Acha o Order ID sabendo qual é a descrição ou metadados
         // Assumindo que o "external_reference" é o Order ID. O Pix do checkout 
         // Router usa external_reference? A gente mandou "description: Mimuus Pedido #UUID"
         
         const externalRef = paymentData.external_reference;
         let orderId = externalRef;
         
         if (!orderId && paymentData.description?.includes('Pedido #')) {
           orderId = paymentData.description.split('Pedido #')[1];
         }

         if (orderId) {
           const sql = postgres(process.env.DATABASE_URL!, {
             ssl: { rejectUnauthorized: false }
           });

           const [order] = await sql`
             UPDATE orders 
             SET 
               status = 'paid',
               stripe_payment_intent_id = ${paymentId}
             WHERE id = ${orderId}::uuid
             RETURNING *
           `;

           if (order) {
              console.log(`✅ Pagamento Mercado Pago Aprovado para Pedido #${orderId}`);
              
              await sendOrderConfirmation(order.customer_email || paymentData.payer?.email, {
                 orderId: order.id,
                 customerName: order.customer_name || 'Cliente',
                 items: order.items || [],
                 total: order.total || paymentData.transaction_amount,
                 paymentMethod: 'pix_boleto'
              });
           }
           
           await sql.end();
         }
      }
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error('❌ Erro no webhook do Mercado Pago:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
