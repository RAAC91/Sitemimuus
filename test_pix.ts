import { createPixPayment } from './src/lib/mercadopago';

async function testPix() {
  const result = await createPixPayment(
    99.9,
    "Mimuus Pedido TEST",
    "test@example.com",
    "Test",
    "Setup",
    "00000000000"
  );
  console.log("Pix Result:", result);
}

testPix();
