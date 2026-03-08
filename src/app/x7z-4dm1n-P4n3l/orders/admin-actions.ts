"use server"

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { sendStatusUpdate } from '@/lib/resend';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        // Update status and fetch the order to get customer info for the email
        const [order] = await sql`
            UPDATE orders 
            SET status = ${status}, updated_at = NOW() 
            WHERE id = ${orderId}
            RETURNING id, customer_email, customer_name, order_number
        `;

        revalidatePath('/x7z-4dm1n-P4n3l/orders');

        // Fire email notification (non-blocking — failure won't abort the status update)
        if (order?.customer_email) {
            sendStatusUpdate(order.customer_email, {
                orderId:      order.id,
                orderNumber:  order.order_number,
                customerName: order.customer_name ?? 'Cliente',
                newStatus:    status,
            }).catch((err) => console.error('Email dispatch error:', err));
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}
