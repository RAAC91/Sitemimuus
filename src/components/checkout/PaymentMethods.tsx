'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    icon: '💳',
    description: 'Parcelamento em até 12x sem juros'
  },
  {
    id: 'pix',
    name: 'Pix',
    icon: '📱',
    description: 'Aprovação instantânea'
  },
  {
    id: 'boleto',
    name: 'Boleto Bancário',
    icon: '🏦',
    description: 'Vencimento em 3 dias úteis'
  }
];

interface PaymentMethodsProps {
  onSelect: (methodId: string) => void;
  selected?: string;
}

export function PaymentMethods({ onSelect, selected }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Forma de Pagamento</h3>
      
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${selected === method.id 
              ? 'border-brand-pink bg-brand-pink/5' 
              : 'border-gray-200 hover:border-brand-pink/50'
            }
          `}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{method.icon}</span>
            <div className="flex-1">
              <div className="font-bold">{method.name}</div>
              <div className="text-sm text-gray-600">{method.description}</div>
            </div>
            {selected === method.id && (
              <div className="w-6 h-6 rounded-full bg-brand-pink flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </button>
      ))}

      {/* Security Badges */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500 text-xl">🔒</span>
            <span>Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-blue-500 text-xl">🛡️</span>
            <span>SSL Certificado</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-purple-500 text-xl">⚡</span>
            <span>Stripe Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
