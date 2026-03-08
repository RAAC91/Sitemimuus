// Template de email para recuperação de carrinho abandonado

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface AbandonedCartEmailProps {
  customerName: string;
  items: CartItem[];
  cartUrl: string;
  discountCode?: string;
}

export function generateAbandonedCartEmail({
  customerName,
  items,
  cartUrl,
  discountCode
}: AbandonedCartEmailProps): string {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu carrinho está esperando!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF1B8D 0%, #00D4FF 100%); padding: 40px; text-align: center;">
              <a href="https://mimuus.com" style="text-decoration: none;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                  mi<span style="color: #FF1B8D;">mu</span>us.
                </h1>
              </a>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Olá ${customerName}! 👋</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Notamos que você deixou alguns itens no carrinho. Não perca a chance de finalizar sua compra!
              </p>

              <!-- Cart Items -->
              ${items.map(item => `
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                  <table width="100%">
                    <tr>
                      <td width="80">
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                      </td>
                      <td style="padding-left: 20px;">
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${item.name}</h3>
                        <p style="margin: 0; color: #666;">Quantidade: ${item.quantity}</p>
                        <p style="margin: 5px 0 0 0; color: #FF1B8D; font-weight: bold; font-size: 18px;">
                          R$ ${item.price.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              `).join('')}

              <!-- Total -->
              <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 20px;">
                <table width="100%">
                  <tr>
                    <td style="text-align: right; padding-right: 20px;">
                      <p style="margin: 0; color: #666; font-size: 14px;">Subtotal:</p>
                    </td>
                    <td style="text-align: right; width: 120px;">
                      <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold;">
                        R$ ${total.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              ${discountCode ? `
                <!-- Discount -->
                <div style="background-color: #FFF3F8; border: 2px dashed #FF1B8D; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #FF1B8D; font-weight: bold; font-size: 16px;">
                    🎁 Presente especial para você!
                  </p>
                  <p style="margin: 0 0 10px 0; color: #666;">
                    Use o cupom abaixo e ganhe <strong>10% de desconto</strong>:
                  </p>
                  <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; display: inline-block;">
                    <code style="font-size: 24px; font-weight: bold; color: #FF1B8D; letter-spacing: 2px;">
                      ${discountCode}
                    </code>
                  </div>
                </div>
              ` : ''}

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${cartUrl}" style="display: inline-block; background-color: #FF1B8D; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                  Finalizar Compra
                </a>
              </div>

              <!-- Trust Badges -->
              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">
                  ✓ Frete Grátis acima de R$ 150 • ✓ 7 dias para devolução • ✓ Garantia de 9 meses
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                Você recebeu este email porque deixou itens no carrinho em mimuus.com
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                <a href="#" style="color: #FF1B8D; text-decoration: none;">Cancelar inscrição</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
