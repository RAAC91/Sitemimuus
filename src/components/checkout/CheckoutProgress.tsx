'use client';

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: 'Carrinho' },
  { number: 2, label: 'Pagamento' },
  { number: 3, label: 'Confirmação' }
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-brand-pink transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${isCompleted ? 'bg-brand-pink text-white' : ''}
                  ${isActive ? 'bg-brand-pink text-white scale-110 shadow-lg' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-2 border-gray-300 text-gray-400' : ''}
                `}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium
                  ${isActive ? 'text-brand-pink' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
