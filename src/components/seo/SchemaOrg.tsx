import Script from 'next/script';

interface SchemaOrgProps {
  type: 'Product' | 'Organization' | 'Breadcrumb' | 'FAQ' | 'Review';
  data: any;
}

export function SchemaOrg({ type, data }: SchemaOrgProps) {
  const schemas = {
    Product: (d: any) => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: d.name,
      description: d.description,
      image: d.images || [],
      brand: {
        '@type': 'Brand',
        name: 'Mimuus'
      },
      offers: {
        '@type': 'Offer',
        price: d.price,
        priceCurrency: 'BRL',
        availability: d.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: d.url,
        seller: {
          '@type': 'Organization',
          name: 'Mimuus'
        }
      },
      aggregateRating: d.rating ? {
        '@type': 'AggregateRating',
        ratingValue: d.rating.value,
        reviewCount: d.rating.count
      } : undefined
    }),

    Organization: (d: any) => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Mimuus',
      url: 'https://mimuus.com',
      logo: 'https://mimuus.com/logo.png',
      description: 'Garrafas térmicas personalizadas de alta qualidade',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+55-11-99999-9999',
        contactType: 'Customer Service',
        email: 'contato@mimuus.com',
        availableLanguage: ['Portuguese']
      },
      sameAs: [
        'https://instagram.com/mimuus',
        'https://facebook.com/mimuus'
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'SP',
        addressLocality: 'São Paulo'
      }
    }),

    Breadcrumb: (d: any) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: d.items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }),

    FAQ: (d: any) => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.questions.map((q: any) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      }))
    }),

    Review: (d: any) => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: d.productName
      },
      author: {
        '@type': 'Person',
        name: d.authorName
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: d.rating,
        bestRating: 5
      },
      reviewBody: d.text,
      datePublished: d.date
    })
  };

  const schema = schemas[type](data);

  return (
    <Script
      id={`schema-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper para gerar breadcrumbs automaticamente
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', url: 'https://mimuus.com' }];

  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    items.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      url: `https://mimuus.com${currentPath}`
    });
  });

  return items;
}
