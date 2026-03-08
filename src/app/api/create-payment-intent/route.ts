import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, orderId, customer_email, customer_name, receipt_email } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("No items in checkout", { status: 400 });
    }

    if (!orderId) {
      return new NextResponse("Order ID required", { status: 400 });
    }

    // Calculate total amount in BRL cents
    // Make sure we round properly to avoid decimal issues in Stripe (e.g., 99.90 -> 9990)
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const amountInCents = Math.round(totalAmount * 100);

    // Provide a description containing some details of the first item at least or customization
    const firstItemName = items[0]?.name || 'Produto Mimuus';
    const hasMoreItems = items.length > 1;
    const desc = `${firstItemName}${hasMoreItems ? ` e mais ${items.length - 1} item(ns)` : ''}`;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "brl",
      description: `Pedido #${orderId} - ${desc}`,
      receipt_email: customer_email || receipt_email || undefined,
      metadata: {
        orderId: orderId,
        source: "mimuus_checkout_elements",
        customer_name: customer_name || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error("[PAYMENT_INTENT_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
