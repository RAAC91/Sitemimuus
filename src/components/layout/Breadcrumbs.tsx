'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SchemaOrg, generateBreadcrumbs } from '@/components/seo/SchemaOrg';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', href: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      name: segment
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: isLast ? '' : currentPath
    });
  });

  // Generate Schema.org data
  const schemaData = generateBreadcrumbs(pathname);

  return (
    <>
      <SchemaOrg type="Breadcrumb" data={{ items: schemaData }} />
      <nav className="py-4 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {isLast || !crumb.href ? (
                    <span className="text-gray-900 font-medium">{crumb.name}</span>
                  ) : (
                    <Link 
                      href={crumb.href}
                      className="text-brand-pink hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
