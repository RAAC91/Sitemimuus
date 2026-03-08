import { getAllProducts } from "@/actions/product-actions";
import ProductsClientPage from "@/components/category/ProductsClientPage";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsClientPage initialProducts={products} />;
}
