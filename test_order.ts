import { createOrder } from './src/actions/order-actions';

async function testOrder() {
  const data = {
    customer_name: 'Test Setup',
    customer_email: 'test@example.com',
    paymentMethod: 'pix',
    shipping_address: { cep: '00000000' },
    items: [
      { 
        product_id: 1, 
        quantity: 1, 
        price: 99.9, 
        product_name: 'Test Setup',
        thumbnail_url: 'image.png',
        customization: { text: "Hello" } 
      }
    ],
    total: 99.9
  };

  const res = await createOrder(data as any);
  console.log("Order test result:", res);
}

testOrder();
