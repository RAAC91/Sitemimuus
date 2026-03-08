"use server";

import postgres from 'postgres';
import { Product } from '@/types';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug}
         OR p.name ILIKE ${slug.replace(/-/g, ' ')}
         OR p.id::text = ${slug}
      LIMIT 1
    `;
    const product = products[0];
    if (!product) return null;
    return mapProduct(product);
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    return products.map(mapProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    const product = products[0];
    if (!product) return null;
    return mapProduct(product);
  } catch (error) {
    console.error(`Error fetching product by id (${id}):`, error);
    return null;
  }
}

// Safely parse images — DB may return a JSON string, JS array, or null
function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]).filter(Boolean) : [];
    } catch {
      return raw ? [raw] : [];
    }
  }
  if (typeof raw === 'string' && raw.trim()) return [raw];
  return [];
}

function mapProduct(row: Record<string, unknown>): Product {
  const images = parseImages(row.images);
  const image = (row.image as string) || '';
  const allImages = images.length > 0 ? images : (image ? [image] : []);

  return {
    id: row.id as string,
    name: row.name as string,
    price: Number(row.price || row.base_price),
    oldPrice: (row.old_price || row.sale_price) ? Number(row.old_price || row.sale_price) : undefined,
    image: allImages[0] || '',
    images: allImages,
    description: (row.description as string) || undefined,
    badge: (row.badge as string) || undefined,
    tagline: (row.tagline as string) || undefined,
    use: (row.use as string) || undefined,
    style: (row.style as string) || undefined,
    customizable: (row.customizable as boolean) || undefined,
    stock: Number(row.stock || 0),
    color: (row.color as string) || undefined,
    category: (row.category as string) || 'garrafas',
    slug: (row.slug as string) || String(row.id),
    // Joined from categories table
    category_name: (row.category_name as string) || undefined,
    category_id: (row.category_id as string) || undefined,
    // Editor design data
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    // Compatibility fields
    base_price: Number(row.price || row.base_price),
    sale_price: (row.old_price || row.sale_price) ? Number(row.old_price || row.sale_price) : undefined,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}
