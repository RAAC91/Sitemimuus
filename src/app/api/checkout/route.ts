import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { createPixPayment } from "@/lib/mercadopago";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { items, paymentMethod, orderId, customer_email, customer_name, cpf } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("No items in checkout", { status: 400 });
    }

    if (!orderId) {
      return new NextResponse("Order ID required", { status: 400 });
    }

    // Calcular o total internamente p/ MercadoPago
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // GATEWAY 1: STRIPE (Cartão de Crédito)
    if (paymentMethod === 'credit_card') {
      const line_items = items.map((item: any) => ({
        quantity: item.quantity,
        price_data: {
          currency: "BRL",
          product_data: {
            name: item.name,
            images: item.thumbnail ? [item.thumbnail] : undefined,
            description: item.customization?.text ? `Personalizado: ${item.customization.text}` : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
      }));

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        customer_email: customer_email || undefined,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
        metadata: {
          orderId: orderId,
          source: "mimuus_checkout",
        }
      });

      return NextResponse.json({ provider: 'stripe', url: session.url }, { headers: corsHeaders });
    }

    // GATEWAY 2: MERCADO PAGO (PIX)
    if (paymentMethod === 'pix') {
      
      const [firstName, ...lastNames] = (customer_name || 'Cliente').split(' ');
      
      // Cria a intenção de PIX usando nosso utilitário
      const pixResponse = await createPixPayment(
        Number(totalAmount),
        `Mimuus Pedido #${orderId}`,
        customer_email || 'comprador@email.com',
        firstName,
        lastNames.join(' ') || 'Mimuus',
        cpf || '00000000000'
      );

      if (!pixResponse.success) {
        return new NextResponse("Mercado Pago Integration Failed", { status: 500 });
      }

      return NextResponse.json({ 
        provider: 'mercadopago', 
        type: 'pix',
        qr_code: pixResponse.data?.qrCode,
        qr_code_base64: pixResponse.data?.qrCodeBase64,
        payment_id: pixResponse.data?.id
      }, { headers: corsHeaders });
    }

    // GATEWAY 3: MERCADO PAGO (BOLETO) - Retorna sucesso mock para ser tratado dps
    if (paymentMethod === 'boleto') {
      return NextResponse.json({ 
        provider: 'mercadopago', 
        type: 'boleto',
        message: 'Boleto será gerado e enviado por e-mail.' 
      }, { headers: corsHeaders });
    }

    return new NextResponse("Invalid Payment Method", { status: 400 });

  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
