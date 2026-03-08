// Templates de email para welcome e post-purchase

interface WelcomeEmailProps {
  customerName: string;
  discountCode: string;
}

export function generateWelcomeEmail({ customerName, discountCode }: WelcomeEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bem-vindo à Mimuus!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF1B8D 0%, #00D4FF 100%); padding: 60px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 32px;">Bem-vindo à Mimuus! 🎉</h1>
              <p style="color: #ffffff; margin: 0; font-size: 18px;">Sua jornada de personalização começa aqui</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Olá ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6;">
                Estamos muito felizes em ter você conosco! 🚀
              </p>
              <p style="color: #666; line-height: 1.6;">
                Na Mimuus, você pode criar garrafas térmicas únicas que expressam sua personalidade. 
                Use nosso editor 3D e veja seu design ganhar vida!
              </p>
              
              <div style="background-color: #FFF3F8; border: 2px dashed #FF1B8D; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #FF1B8D; font-weight: bold; font-size: 18px;">
                  🎁 Presente de Boas-Vindas!
                </p>
                <p style="margin: 0 0 15px 0; color: #666;">
                  Ganhe <strong>15% OFF</strong> na sua primeira compra:
                </p>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 4px; display: inline-block;">
                  <code style="font-size: 28px; font-weight: bold; color: #FF1B8D; letter-spacing: 3px;">
                    ${discountCode}
                  </code>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://mimuus.com/editor" style="display: inline-block; background-color: #FF1B8D; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                  Começar a Personalizar
                </a>
              </div>
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

interface PostPurchaseEmailProps {
  customerName: string;
  orderNumber: string;
  trackingCode?: string;
  items: Array<{ name: string; quantity: number }>;
}

export function generatePostPurchaseEmail({ 
  customerName, 
  orderNumber, 
  trackingCode,
  items 
}: PostPurchaseEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pedido Confirmado!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF1B8D 0%, #00D4FF 100%); padding: 40px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">✓</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Pedido Confirmado!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333; margin: 0 0 10px 0;">Obrigado, ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
                Seu pedido <strong>#${orderNumber}</strong> foi confirmado e já está sendo preparado com muito carinho! 💖
              </p>

              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">Itens do Pedido:</h3>
                ${items.map(item => `
                  <p style="margin: 5px 0; color: #666;">
                    ${item.quantity}x ${item.name}
                  </p>
                `).join('')}
              </div>

              ${trackingCode ? `
                <div style="background-color: #E8F5E9; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #2E7D32; font-weight: bold;">
                    📦 Seu pedido foi enviado!
                  </p>
                  <p style="margin: 0 0 10px 0; color: #666;">Código de rastreamento:</p>
                  <code style="font-size: 18px; font-weight: bold; color: #2E7D32;">
                    ${trackingCode}
                  </code>
                </div>
              ` : `
                <div style="background-color: #FFF3E0; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                  <p style="margin: 0; color: #E65100;">
                    ⏱️ Seu pedido está sendo preparado. Você receberá o código de rastreamento em breve!
                  </p>
                </div>
              `}

              <div style="text-align: center;">
                <a href="https://mimuus.com/pedidos/${orderNumber}" style="display: inline-block; background-color: #FF1B8D; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold;">
                  Acompanhar Pedido
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                  Dúvidas? Entre em contato: contato@mimuus.com
                </p>
              </div>
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
