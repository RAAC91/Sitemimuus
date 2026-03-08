import { getProductBySlug } from "@/actions/product-actions";
import { ProductClientPage } from "@/components/product/ProductClientPage";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}
