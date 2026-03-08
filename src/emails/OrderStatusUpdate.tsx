import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from '@react-email/components';
import * as React from 'react';

interface OrderStatusUpdateEmailProps {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  newStatus: string;
  statusLabel: string;
  statusMessage: string;
  trackingCode?: string;
  trackingUrl?: string;
}

export default function OrderStatusUpdateEmail({
  orderId = '12345',
  orderNumber,
  customerName = 'Cliente',
  newStatus = 'preparing',
  statusLabel = 'Preparando',
  statusMessage = 'Seu pedido está sendo preparado.',
  trackingCode,
  trackingUrl,
}: OrderStatusUpdateEmailProps) {
  // Accent color per status
  const accentMap: Record<string, string> = {
    paid:      '#10b981',
    preparing: '#3b82f6',
    shipped:   '#6366f1',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };
  const accent = accentMap[newStatus] ?? '#ff4081';
  const displayId = orderNumber ?? orderId.slice(0, 8).toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Atualização do seu pedido #{displayId} - Mimuus</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header stripe */}
          <div style={{ backgroundColor: accent, height: '6px', borderRadius: '8px 8px 0 0' }} />

          <div style={{ padding: '40px 32px 32px' }}>
            <Heading style={h1}>Atualização do Pedido</Heading>

            <Text style={text}>Olá, <strong>{customerName}</strong>!</Text>
            <Text style={text}>
              Seu pedido <strong>#{displayId}</strong> teve o status atualizado.
            </Text>

            {/* Status badge */}
            <Section style={{ ...statusBox, borderColor: accent }}>
              <Text style={{ ...statusLabelText, color: accent }}>{statusLabel}</Text>
              <Text style={statusMessage_}>{statusMessage}</Text>
            </Section>

            {/* Tracking info if shipped */}
            {trackingCode && (
              <Section style={trackingBox}>
                <Text style={trackingTitle}>Código de rastreio:</Text>
                <Text style={trackingCodeText}>{trackingCode}</Text>
                {trackingUrl && (
                  <Button style={{ ...button, backgroundColor: accent }} href={trackingUrl}>
                    Rastrear Entrega
                  </Button>
                )}
              </Section>
            )}

            <Text style={footer}>
              Qualquer dúvida, entre em contato pelo nosso e-mail ou WhatsApp.
              <br />
              Obrigado por escolher a <strong>Mimuus</strong> 💗
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '12px',
  maxWidth: '600px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
};

const h1 = {
  color: '#111827',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const text = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
  marginBottom: '12px',
};

const statusBox = {
  border: '2px solid',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const statusLabelText = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const statusMessage_ = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const trackingBox = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '16px',
  textAlign: 'center' as const,
};

const trackingTitle = {
  color: '#9ca3af',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '8px',
};

const trackingCodeText = {
  color: '#111827',
  fontSize: '22px',
  fontWeight: 'bold',
  letterSpacing: '3px',
  margin: '0 0 16px',
};

const button = {
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
