interface ProductSchemaProps {
  name: string
  description: string
  image: string[]
  sku: string
  price: number
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  ratingValue?: number
  reviewCount?: number
  brand?: string
}

export function generateProductSchema({
  name,
  description,
  image,
  sku,
  price,
  availability = 'InStock',
  ratingValue = 4.9,
  reviewCount = 0,
  brand = 'Mimuus',
}: ProductSchemaProps) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image,
    description,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://mimuus.com/produto/${sku}`,
      priceCurrency: 'BRL',
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Mimuus',
      },
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue.toString(),
        reviewCount: reviewCount.toString(),
      },
    }),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mimuus',
    url: 'https://mimuus.com',
    logo: 'https://mimuus.com/logo.png',
    description:
      'Garrafas térmicas personalizadas de alta qualidade. Design único, mantém bebidas geladas por 24h.',
    sameAs: [
      'https://instagram.com/mimuus_oficial',
      'https://facebook.com/mimuus',
      'https://twitter.com/mimuus_oficial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-9999',
      contactType: 'Customer Service',
      availableLanguage: ['pt-BR'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
    },
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://mimuus.com${item.url}`,
    })),
  }
}

interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
