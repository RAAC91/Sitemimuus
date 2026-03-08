import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import postgres from 'postgres';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Record<string, any>;

  if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
    console.log(`✅ Payment successful (Stripe ${event.type}):`, session.id);
    
    try {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: { rejectUnauthorized: false }
      });

      // Extract orderId depending on the type of event
      const orderId = session.metadata?.orderId;
      const paymentIntentId = event.type === "payment_intent.succeeded" ? session.id : (session.payment_intent || null);
      const sessionId = event.type === "checkout.session.completed" ? session.id : null;

      if (orderId) {
        // Obter os itens e o cliente para enviar no E-mail
        const [order] = await sql`
          UPDATE orders 
          SET 
            status = 'paid',
            stripe_session_id = ${sessionId ? sessionId : null},
            stripe_payment_intent_id = ${paymentIntentId ? paymentIntentId : null}
          WHERE id = ${orderId}
          RETURNING *
        `;

        if (order) {
          console.log(`✅ Pedido ${orderId} atualizado para 'paid'`);

          // Enviar email de confirmação
          const { sendOrderConfirmation } = await import("@/lib/resend");
          const customerEmail = order.customer_email || session.customer_details?.email || session.receipt_email;
          const customerName = order.customer_name || session.customer_details?.name || session.metadata?.customer_name || 'Cliente';
          
          if (customerEmail) {
            await sendOrderConfirmation(customerEmail, {
               orderId: order.id,
               customerName: customerName,
               items: order.items || [], // Assumindo jsonb com a estrutura de carrinho
               total: order.total || (session.amount_total ? session.amount_total / 100 : session.amount / 100),
               paymentMethod: 'stripe'
            });
          }
        }
      } else {
        // Caso fallback para checkouts não conformes a nova api
        await sql`
          INSERT INTO orders (
            stripe_session_id, stripe_payment_intent_id, customer_email, 
            customer_name, total, status, items, shipping_address
          ) VALUES (
            ${sessionId}, ${paymentIntentId}, ${session.customer_details?.email || session.receipt_email || ''},
            ${session.customer_details?.name || session.shipping?.name || ''}, ${session.amount_total ? session.amount_total / 100 : (session.amount ? session.amount / 100 : 0)},
            'paid', ${JSON.stringify(session.metadata || {})}, ${JSON.stringify(session.customer_details?.address || session.shipping?.address || {})}
          )
        `;
        console.log('✅ Pedido fallback salvo no banco:', session.id);
      }

      await sql.end();
    } catch (error) {
      console.error('❌ Erro ao salvar pedido do Stripe:', error);
    }
  }

  return new NextResponse(null, { status: 200 });
}
