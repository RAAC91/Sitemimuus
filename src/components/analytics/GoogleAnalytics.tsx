'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId || gaId === 'G-XYZ123456') {
    console.warn('Google Analytics ID not configured');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Helper para rastrear eventos personalizados
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

// Eventos pré-configurados para e-commerce
export const ecommerceEvents = {
  viewProduct: (productId: string, productName: string, price: number) => {
    trackEvent('view_item', {
      currency: 'BRL',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price
      }]
    });
  },

  addToCart: (productId: string, productName: string, price: number, quantity: number) => {
    trackEvent('add_to_cart', {
      currency: 'BRL',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity
      }]
    });
  },

  beginCheckout: (value: number, items: any[]) => {
    trackEvent('begin_checkout', {
      currency: 'BRL',
      value: value,
      items: items
    });
  },

  purchase: (transactionId: string, value: number, items: any[]) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: 'BRL',
      value: value,
      items: items
    });
  }
};
