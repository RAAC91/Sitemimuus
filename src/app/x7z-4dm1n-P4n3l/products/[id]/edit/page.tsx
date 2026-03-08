import { getProductById } from "@/actions/product-actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 h-full">
      <ProductForm initialData={product} />
    </div>
  );
}
