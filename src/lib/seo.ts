import type { Metadata } from 'next'

interface SEOMetadataProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  keywords?: string[]
  type?: 'website' | 'article'
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  keywords = [],
  type = 'website',
}: SEOMetadataProps): Metadata {
  const baseUrl = 'https://mimuus.com'
  const fullUrl = canonical ? `${baseUrl}${canonical}` : baseUrl

  return {
    title: {
      default: title,
      template: '%s | Mimuus - Garrafas Personalizadas',
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Mimuus' }],
    creator: 'Mimuus',
    publisher: 'Mimuus',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'pt_BR',
      url: fullUrl,
      title,
      description,
      siteName: 'Mimuus',
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${ogImage}`],
      creator: '@mimuus_oficial',
    },
    verification: {
      google: 'your-google-site-verification',
    },
  }
}

// Homepage Metadata
export const homeMetadata = generateMetadata({
  title: 'Garrafas Térmicas Personalizadas | Mimuus',
  description:
    'Crie sua garrafa térmica personalizada com design único. Mantém bebidas geladas por 24h e quentes por 12h. Frete grátis acima de R$ 299. Qualidade Premium.',
  canonical: '/',
  keywords: [
    'garrafa térmica personalizada',
    'garrafa com nome',
    'squeeze personalizado',
    'garrafa termica',
    'garrafa academia',
    'presente personalizado',
    'garrafa inox',
  ],
  type: 'website',
})
