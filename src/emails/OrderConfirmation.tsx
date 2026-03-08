import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Row, Column } from '@react-email/components';
import { formatPrice } from '../lib/utils';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  total: number;
  paymentMethod: string;
}

export default function OrderConfirmationEmail({
  orderId = '12345',
  customerName = 'João',
  items = [
    { name: 'Garrafa Premium Branca', quantity: 1, price: 149.9 },
  ],
  total = 149.9,
  paymentMethod = 'stripe',
}: OrderConfirmationEmailProps) {
  const methodText = paymentMethod === 'stripe' ? 'Cartão de Crédito' : 'PIX/Boleto';

  return (
    <Html>
      <Head />
      <Preview>Seu pedido #{orderId} foi confirmado com sucesso!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Mimuus - Seu Pedido está Confirmado!</Heading>
          
          <Text style={text}>
            Olá {customerName}, obrigado por sua compra!
          </Text>
          <Text style={text}>
            Estamos preparando o seu pedido <strong>#{orderId}</strong> com muito carinho. 
            Você receberá um novo e-mail assim que o seu pacote for despachado.
          </Text>

          <Section style={orderSection}>
            <Heading as="h2" style={h2}>Resumo do Pedido</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.name} x{item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={totalText}>Total Pago</Text>
              </Column>
              <Column align="right">
                <Text style={totalPrice}>{formatPrice(total)}</Text>
              </Column>
            </Row>
            <Text style={paymentText}>Forma de pagamento: {methodText}</Text>
          </Section>

          <Text style={footer}>
            Se tiver qualquer dúvida, basta responder a este e-mail.
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

const h2 = {
  color: '#444',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '15px',
};

const orderSection = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '30px',
};

const itemRow = {
  marginBottom: '10px',
};

const itemName = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
};

const itemPrice = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const totalText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const totalPrice = {
  color: '#ff4081',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const paymentText = {
  color: '#888',
  fontSize: '12px',
  marginTop: '15px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '40px',
  textAlign: 'center' as const,
};
