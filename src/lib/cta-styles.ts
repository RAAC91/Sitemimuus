// Unique gradient variants for Von Restorff Effect - making primary CTAs stand out
export const ctaGradients = {
  primary: 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600',
  secondary: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
  
  // Special high-contrast CTAs
  hero: 'bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 hover:shadow-2xl hover:scale-105 transition-all duration-300',
  checkout: 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl',
  
  // Subtle variants
  ghost: 'hover:bg-gray-100',
  outline: 'border-2 border-gray-900 hover:bg-gray-900 hover:text-white',
}

// Shadow effects for CTAs
export const ctaShadows = {
  default: 'shadow-md hover:shadow-xl',
  large: 'shadow-lg hover:shadow-2xl',
  none: 'shadow-none',
  glow: 'shadow-lg shadow-pink-500/50 hover:shadow-2xl hover:shadow-pink-600/50',
}

// Helper to combine gradient + shadow for primary CTAs
export function getPrimaryCTA() {
  return `${ctaGradients.primary} ${ctaShadows.large} text-white font-bold transition-all duration-300 hover:translate-y-[-2px]`
}

export function getHeroCTA() {
  return `${ctaGradients.hero} ${ctaShadows.glow} text-white font-black transition-all duration-300`
}

export function getCheckoutCTA() {
  return `${ctaGradients.checkout} ${ctaShadows.large} text-white font-bold transition-all duration-300`
}
