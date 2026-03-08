"use server";

import postgres from 'postgres';
import { Order } from '@/types';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }, 
});

interface CreateOrderData {
  user_id?: string;
  customer_email: string;
  customer_name: string;
  paymentMethod: string;
  shipping_address: Record<string, any>;
  items: {
    product_id: string;
    product_name: string;
    thumbnail_url: string;
    quantity: number;
    price: number;
    customization: any;
  }[];
  total: number;
}

export async function createOrder(data: CreateOrderData) {
  try {
    return await sql.begin(async (sqlTx: any) => {
      // 1. Insert Order
      const [order] = await sqlTx`
        INSERT INTO orders (
          user_id, 
          status, 
          total, 
          subtotal,
          shipping_address,
          customer_name,
          customer_email
        ) VALUES (
          ${data.user_id || null}, 
          'pending', 
          ${data.total}, 
          ${data.total},
          ${data.shipping_address as any},
          ${data.customer_name},
          ${data.customer_email}
        )
        RETURNING id
      `;

      const orderId = order.id;

      // 2. Insert Items
      for (const item of data.items) {
        console.log("Inserting item:", { orderId, item });
        await sqlTx`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            thumbnail_url,
            quantity,
            unit_price,
            total_price,
            customization
          ) VALUES (
            ${orderId},
            ${item.product_id},
            ${item.product_name},
            ${item.thumbnail_url},
            ${item.quantity},
            ${item.price},
            ${item.quantity * item.price},
            ${item.customization || {}}
          )
        `;
      }

      return { success: true, orderId: String(orderId) };
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error), orderId: undefined };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await sql`
      SELECT id, status, total, stripe_session_id, created_at,
             (SELECT json_agg(json_build_object(
                'id', oi.id,
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price,
                'thumbnail_url', oi.thumbnail_url
             )) FROM order_items oi WHERE oi.order_id = orders.id) as items
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;
    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrderById(orderId: string, userId: string) {
  try {
    const orders = await sql`
      SELECT id, status, total, shipping_address, created_at,
             (SELECT json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'total_price', oi.total_price,
                'thumbnail_url', oi.thumbnail_url,
                'customization', oi.customization
             )) FROM order_items oi WHERE oi.order_id = orders.id) as items
      FROM orders
      WHERE id = ${orderId} AND user_id = ${userId}
      LIMIT 1;
    `;
    if (orders.length === 0) return { success: false, error: 'Pedido não encontrado' };
    return { success: true, order: orders[0] };
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return { success: false, error: error.message };
  }
}



