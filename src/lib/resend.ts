import React from 'react';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import TrackingUpdateEmail from '@/emails/TrackingUpdate';
import AbandonedCartEmail from '@/emails/AbandonedCart';
import OrderStatusUpdateEmail from '@/emails/OrderStatusUpdate';

const resend = new Resend(process.env.RESEND_API_KEY || 're_GrAuAe1q_XTyXyCMdPH5GqfgU7iKDutcM');
const FROM_EMAIL = 'noreply@mimuus.store';
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mimuus.store';

export async function sendOrderConfirmation(email: string, orderData: Record<string, any>) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Pedido Confirmado #${orderData.orderId} - Mimuus`,
      react: OrderConfirmationEmail(orderData as any) as any,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Falha geral no disparo de email:', err);
    return { success: false, error: err };
  }
}

export async function sendTrackingUpdate(email: string, trackingData: Record<string, any>) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Atualização de Rastreio #${trackingData.orderId} - Mimuus`,
      react: TrackingUpdateEmail(trackingData as any) as any,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de rastreio:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Falha geral no disparo de email:', err);
    return { success: false, error: err };
  }
}

export async function sendAbandonedCart(email: string, recoveryData: Record<string, any>) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Você esqueceu algo especial na Mimuus!',
      react: AbandonedCartEmail(recoveryData as any) as any,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de carrinho abandonado:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Falha geral no disparo de email:', err);
    return { success: false, error: err };
  }
}

// ─── Status update email ───────────────────────────────────────────────────────

const STATUS_EMAIL_MAP: Record<string, { label: string; message: string }> = {
  paid:      { label: 'Pagamento Confirmado ✅', message: 'Recebemos o seu pagamento! Seu pedido já entrou na fila de produção.' },
  preparing: { label: 'Em Produção 🏭',          message: 'Seu pedido está sendo produzido com todo carinho pela nossa equipe.' },
  shipped:   { label: 'Enviado 🚚',              message: 'Seu pedido foi despachado e está a caminho do seu endereço!' },
  delivered: { label: 'Entregue 🎉',             message: 'Seu pedido foi entregue! Esperamos que você ame. Se precisar de qualquer coisa, fale com a gente.' },
  cancelled: { label: 'Cancelado ❌',            message: 'Seu pedido foi cancelado. Entre em contato conosco caso tenha alguma dúvida ou queira reativar.' },
};

export async function sendStatusUpdate(
  email: string,
  data: {
    orderId: string;
    orderNumber?: string;
    customerName: string;
    newStatus: string;
    trackingCode?: string;
    trackingUrl?: string;
  }
) {
  const statusContent = STATUS_EMAIL_MAP[data.newStatus];
  if (!statusContent) return { success: false, error: 'Status sem e-mail configurado' };

  try {
    const { data: res, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `${statusContent.label} — Pedido #${data.orderNumber ?? data.orderId.slice(0, 8).toUpperCase()} - Mimuus`,
      react: OrderStatusUpdateEmail({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        newStatus: data.newStatus,
        statusLabel: statusContent.label,
        statusMessage: statusContent.message,
        trackingCode: data.trackingCode,
        trackingUrl: data.trackingUrl,
      }) as React.ReactElement,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de status:', error);
      return { success: false, error };
    }
    return { success: true, data: res };
  } catch (err) {
    console.error('Falha no disparo de e-mail de status:', err);
    return { success: false, error: err };
  }
}
