import { getAllProducts } from "@/actions/product-actions";
import ProductsClientPage from "@/components/category/ProductsClientPage";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Buscar todos os produtos e filtrar por categoria
  const allProducts = await getAllProducts();
  const products = allProducts.filter(p => 
    p.category?.toLowerCase() === slug.toLowerCase()
  );

  // Mapear slugs para nomes amigáveis
  const categoryNames: Record<string, string> = {
    'sports': 'Esportes',
    'fashion': 'Fashion',
    'kids': 'Kids',
    'lifestyle': 'Lifestyle',
    'pastel': 'Pastel',
    'corporate': 'Corporate'
  };

  const categoryName = categoryNames[slug] || slug;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: "CATEGORIAS", href: "/produtos" },
            { label: categoryName }
          ]}
          className="mb-8"
        />
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>
        
        <ProductsClientPage initialProducts={products} />
      </div>
    </div>
  );
}
