import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from '@react-email/components';
import * as React from 'react';

interface AbandonedCartEmailProps {
  customerName: string;
  checkoutUrl: string;
}

export default function AbandonedCartEmail({
  customerName = 'João',
  checkoutUrl = 'https://mimuus.com.br/checkout/recover/123',
}: AbandonedCartEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sua garrafa exclusiva Mimuus ainda está te esperando!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Não deixe sua personalização escapar!</Heading>
          
          <Text style={text}>
            Oi {customerName},
          </Text>
          <Text style={text}>
            Vimos que você separou algo muito especial no seu carrinho, mas não finalizou a compra. 
            Suas personalizações continuam salvas esperando por você!
          </Text>

          <Section style={ctaBox}>
            <Text style={ctaText}>Volte e garanta a sua Mimuus agora mesmo.</Text>
            <Button style={{ ...button, padding: '12px 20px' }} href={checkoutUrl}>
              Finalizar Minha Compra
            </Button>
          </Section>

          <Text style={footer}>
            Se precisar de alguma ajuda para finalizar, estamos à disposição neste mesmo e-mail.
            <br />
            Equipe Mimuus.
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

const ctaBox = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '30px',
  textAlign: 'center' as const,
};

const ctaText = {
  color: '#333',
  fontSize: '16px',
  marginBottom: '20px',
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
