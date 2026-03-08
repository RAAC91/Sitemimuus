import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from '@react-email/components';
import * as React from 'react';

interface TrackingUpdateEmailProps {
  orderId: string;
  customerName: string;
  trackingCode: string;
  trackingUrl: string;
}

export default function TrackingUpdateEmail({
  orderId = '12345',
  customerName = 'João',
  trackingCode = 'BR123456789BR',
  trackingUrl = 'https://correios.com.br/rastreamento',
}: TrackingUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Seu pedido #{orderId} foi despachado!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Seu Pedido Chegou na Reta Final!</Heading>
          
          <Text style={text}>
            Olá {customerName}!
          </Text>
          <Text style={text}>
            Boas notícias: seu pedido <strong>#{orderId}</strong> foi recém-despachado de nossa fábrica e já está a caminho do seu endereço.
          </Text>

          <Section style={trackingBox}>
            <Text style={trackingTitle}>Seu Código de Rastreio:</Text>
            <Text style={trackingCodeText}>{trackingCode}</Text>
            <Button style={{ ...button, padding: '12px 20px' }} href={trackingUrl}>
              Acompanhar Entrega
            </Button>
          </Section>

          <Text style={footer}>
            Agradecemos mais uma vez por escolher a Mimuus!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '15px',
};

const trackingBox = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '30px',
  textAlign: 'center' as const,
};

const trackingTitle = {
  color: '#888',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  marginBottom: '10px',
};

const trackingCodeText = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0 0 20px 0',
};

const button = {
  backgroundColor: '#ff4081',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '40px',
  textAlign: 'center' as const,
};
