'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/actions/order-actions';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { usePostHog } from 'posthog-js/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { useEffect, useRef } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddressState {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const initialAddress: AddressState = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

// CEP mask: 00000-000
function maskCEP(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/^(\d{5})(\d{1,3})/, '$1-$2');
}

// CPF mask: 000.000.000-00
function maskCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function CheckoutPage() {
  const posthog = usePostHog();
  const { items, total } = useCartStore();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [showComplement, setShowComplement] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState<AddressState>(initialAddress);

  const handleAddressChange = (field: keyof AddressState, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCEPChange = useCallback(async (rawValue: string) => {
    const masked = maskCEP(rawValue);
    handleAddressChange('cep', masked);

    const digits = masked.replace(/\D/g, '');
    if (digits.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error('CEP não encontrado. Verifique e tente novamente.');
        return;
      }
      setAddress((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
      toast.success('Endereço encontrado!');
      
      // Auto-focus number field after fetching CEP
      setTimeout(() => {
        numberInputRef.current?.focus();
      }, 100);

    } catch {
      toast.error('Erro ao buscar CEP. Preencha o endereço manualmente.');
    } finally {
      setCepLoading(false);
    }
  }, []);

  const validateStep1 = () => {
    if (!email || !name || !cpf) {
      toast.error('Preencha todos os campos de contato.');
      return false;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido.');
      return false;
    }
    return true;
  };

  const validateStep2 = useCallback(() => {
    if (!address.cep || !address.street || !address.number || !address.city) {
      toast.error('Preencha todos os campos de endereço obrigatórios.');
      return false;
    }
    return true;
  }, [address.cep, address.street, address.number, address.city]);

  const initializePayment = useCallback(async () => {
    setIsInitializingPayment(true);
    try {
      const shippingAddress: Record<string, string> = { name, email, cpf, ...address };
      
      let currentOrderId = createdOrderId;
      
      if (!currentOrderId) {
        const orderPayload = {
          customer_name: name || 'Convidado',
          customer_email: email,
          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            product_name: item.name,
            thumbnail_url: item.thumbnail || item.image || '',
            customization: item.customization || {},
          })),
          total: total(),
          paymentMethod: 'stripe',
          shipping_address: shippingAddress,
        };
        
        const result = await createOrder(orderPayload as any);

        if (!result.success || !result.orderId) {
          const errorMsg = 'error' in result ? result.error : 'Erro desconhecido';
          toast.error('Erro ao criar pedido: ' + errorMsg);
          setIsInitializingPayment(false);
          return;
        }
        currentOrderId = result.orderId;
        setCreatedOrderId(currentOrderId);
      }
      
      if (!clientSecret) {
        const piReq = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: total(),
            items, 
            orderId: currentOrderId,
            customer_email: email,
            customer_name: name,
            receipt_email: email
          })
        });

        if (!piReq.ok) {
           toast.error('Erro ao iniciar pagamento. Tente novamente.');
           setIsInitializingPayment(false);
           return;
        }

        const piData = await piReq.json();
        setClientSecret(piData.clientSecret);
      }
      
      setCurrentStep(3);
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error('Erro inesperado ao preparar o pagamento.');
    } finally {
      setIsInitializingPayment(false);
    }
  }, [address, clientSecret, cpf, createdOrderId, email, items, name, total]);

  // Auto-advance to step 3 when step 2 is fully filled
  useEffect(() => {
    if (currentStep === 2 && !isInitializingPayment && address.cep && address.street && address.number && address.city) {
      const isCepValid = address.cep.replace(/\D/g, '').length === 8;
      if (isCepValid) {
        // We add a small delay so the user sees the fields they typed before it transitions
        const timer = setTimeout(() => {
          if (validateStep2()) {
             posthog.capture('checkout_step_completed', { step: 2, step_name: 'address_auto' });
             initializePayment();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, address.cep, address.street, address.number, address.city, isInitializingPayment, validateStep2, posthog, initializePayment]);



  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Link href="/produtos" className="text-brand-pink hover:underline">
            Voltar às compras
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg
    focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all
    bg-white dark:bg-white/5 text-slate-900 dark:text-white`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black">
              mi<span className="text-brand-pink">mu</span>us.
            </h1>
          </Link>
          <Link 
            href="/produtos" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-pink transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm"
          >
            ← Voltar às compras
          </Link>
        </div>

        <CheckoutProgress currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column — Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm">
              {/* Step 1: Contact */}
              {currentStep === 1 && (
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    1. Informações de Contato
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">E-mail *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CPF *</label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(maskCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => { 
                      if (validateStep1()) {
                        posthog.capture('checkout_step_completed', { step: 1, step_name: 'contact' });
                        setCurrentStep(2); 
                      }
                    }}
                    className="mt-8 w-full bg-brand-pink text-white py-4 rounded-lg font-bold hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-pink/20"
                  >
                    Continuar para Endereço →
                  </button>
                </section>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setCurrentStep(1)} className="text-sm text-brand-pink hover:underline">
                      ← Voltar
                    </button>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      2. Endereço de Entrega
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 relative">
                      <label className="block text-sm font-medium mb-2">CEP *</label>
                      <input
                        type="text"
                        value={address.cep}
                        onChange={(e) => handleCEPChange(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        className={inputClass}
                      />
                      {cepLoading && (
                        <div className="absolute right-3 top-10 w-5 h-5 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin" />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Endereço *</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        placeholder="Rua, Avenida..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Número *</label>
                      <input
                        ref={numberInputRef}
                        type="text"
                        value={address.number}
                        onChange={(e) => handleAddressChange('number', e.target.value)}
                        placeholder="123"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      {showComplement ? (
                        <>
                          <label className="block text-sm font-medium mb-2">Complemento</label>
                          <input
                            type="text"
                            value={address.complement}
                            onChange={(e) => handleAddressChange('complement', e.target.value)}
                            placeholder="Apto, Bloco..."
                            className={inputClass}
                            autoFocus
                          />
                        </>
                      ) : (
                        <div>
                           <label className="block text-sm font-medium mb-2 text-transparent select-none">Complemento</label>
                           <button
                             type="button"
                             onClick={() => setShowComplement(true)}
                             className="text-brand-pink text-sm font-semibold hover:underline flex items-center h-[50px] px-2"
                           >
                             + Adicionar complemento (Opcional)
                           </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bairro</label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                        placeholder="Centro"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Cidade *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="São Paulo"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estado</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="SP"
                        maxLength={2}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => { 
                      if (validateStep2()) {
                        posthog.capture('checkout_step_completed', { step: 2, step_name: 'address' });
                        initializePayment();
                      }
                    }}
                    disabled={isInitializingPayment}
                    className="mt-8 w-full bg-brand-pink text-white py-4 rounded-lg font-bold hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isInitializingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Preparando pagamento...</span>
                      </>
                    ) : (
                      <span>Continuar para Pagamento →</span>
                    )}
                  </button>
                </section>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setCurrentStep(2)} className="text-sm text-brand-pink hover:underline">
                      ← Voltar
                    </button>
                    <div className="flex items-center justify-between flex-1">
                      <h2 className="text-xl font-bold">3. Pagamento</h2>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                        Ambiente Seguro SSL
                      </span>
                    </div>
                  </div>
                  {/* STRIPE ELEMENTS FORM injected directly in Step 3 */}
                  {clientSecret && createdOrderId ? (
                    <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-lg font-bold mb-4">Efetuar Pagamento</h3>
                      <Elements 
                        stripe={stripePromise} 
                        options={{ 
                          clientSecret,
                          appearance: {
                            theme: 'stripe',
                            variables: {
                              colorPrimary: '#ec4899', // brand-pink
                            }
                          },
                          // @ts-expect-error - Some Stripe type versions might lack this property although it works seamlessly.
                          developerTools: {
                            assistant: {
                              enabled: false
                            }
                          }
                        }}
                      >
                        <StripePaymentForm 
                          totalAmount={total()} 
                          orderId={createdOrderId}
                        />
                      </Elements>
                    </div>
                  ) : (
                    <div className="mt-8 py-10 flex flex-col items-center justify-center">
                       <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin mb-4" />
                       <p className="text-gray-500">Carregando opções de pagamento seguras...</p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              <div className="max-h-60 overflow-y-auto mb-4 border-b border-gray-200 dark:border-white/10 pb-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden shrink-0 relative">
                      <Image
                        src={item.thumbnail || item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1.5 rounded-tl-md font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{item.style || 'Padrão'}</p>
                      <p className="text-sm font-bold mt-1 text-brand-pink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Frete</span>
                  <span className="text-green-600 font-bold">GRÁTIS</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-gray-100 dark:border-white/10">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>



              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 text-center text-xs text-gray-500 space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  Compra 100% segura
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  Satisfação garantida
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/produtos"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/privacidade" className="hover:text-brand-pink mx-2 transition-colors">Privacidade</Link>
          <span className="text-gray-300">•</span>
          <Link href="/termos" className="hover:text-brand-pink mx-2 transition-colors">Termos</Link>
        </div>
      </div>
    </div>
  );
}
