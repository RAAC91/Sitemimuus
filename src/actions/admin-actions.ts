"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { imagekit } from '@/lib/imagekit';
import { stripe } from '@/lib/stripe';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

const ADMIN_EMAILS = ['rueliton.andrade@gmail.com'];

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    console.error('Admin Access Denied:', user?.email);
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  category?: string;    // legacy TEXT column (kept for DB compat)
  category_id?: string; // new relational FK → categories table
  base_price: number;
  sale_price?: number;
  stock?: number;
  images?: string[];
  tags?: string[];
  color?: string | null;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
}) {
  await checkAdmin();
  try {
    // Transform base64 images to ImageKit URLs before saving to DB
    const processedImages = await Promise.all(
        (data.images || []).map(async (imgUrl, index) => {
            if (imgUrl.startsWith('data:image/')) {
                // Extract base64
                const base64Data = imgUrl.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                try {
                    const uploadResponse = await imagekit.upload({
                        file: buffer,
                        fileName: `${data.slug}-preview-${index}-${Date.now()}.png`,
                        folder: `/mimuus/products/${data.slug}`
                    });
                    return uploadResponse.url;
                } catch (e) {
                    console.error('Failed to upload base64 image to ImageKit:', e);
                    // fallback to raw if failed, though not ideal
                    return imgUrl;
                }
            }
            return imgUrl;
        })
    );

    const product = await sql`
      INSERT INTO products (
        name, slug, description, category, category_id, base_price, sale_price, stock, images, tags, color, metadata, is_active
      ) VALUES (
        ${data.name},
        ${data.slug},
        ${data.description || ''},
        ${data.category || 'garrafa'},
        ${data.category_id || null},
        ${data.base_price},
        ${data.sale_price || null},
        ${data.stock || 0},
        ${processedImages},
        ${data.tags || []},
        ${data.color || null},
        ${JSON.stringify(data.metadata || {})},
        ${data.is_active ?? true}
      )
      RETURNING *
    `;

    let newProduct = product[0];

    // Create the product in Stripe
    try {
      const stripeProduct = await stripe.products.create({
        name: data.name,
        description: data.description || '',
        images: processedImages.length > 0 ? processedImages.slice(0, 8) : undefined, // Stripe max 8 images
        metadata: {
          product_id: newProduct.id,
          slug: data.slug,
        }
      });
      
      // Update the product with the Stripe ID
      await sql`
        UPDATE products 
        SET stripe_product_id = ${stripeProduct.id}
        WHERE id = ${newProduct.id}
      `;
      
      newProduct.stripe_product_id = stripeProduct.id;
    } catch (stripeError) {
      console.error('Failed to create product in Stripe:', stripeError);
      // We don't fail the whole creation if Stripe fails, but we log it
    }

    // Explicitly create ImageKit folder for the new product
    try {
      // It might already exist if we uploaded the images above, but that's fine
      await imagekit.createFolder({
        folderName: newProduct.slug,
        parentFolderPath: '/mimuus/products'
      });
    } catch (folderError) {
      console.warn('ImageKit folder creation skipped or failed:', folderError);
    }

    revalidatePath('/produtos');
    revalidatePath('/x7z-4dm1n-P4n3l/products');
    
    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminStats() {
  await checkAdmin();
  try {
    // 1. Total Revenue (Paid Orders)
    const [revenue] = await sql`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM orders 
      WHERE status = 'paid'
    `;

    // 2. Total Orders
    const [ordersCount] = await sql`
      SELECT COUNT(*) as total FROM orders
    `;

    // 3. Active Customers (Unique Emails)
    const [customersCount] = await sql`
      SELECT COUNT(DISTINCT customer_email) as total FROM orders
    `;

    // 4. Recent Sales (Last 5)
    const recentSales = await sql`
      SELECT customer_name, customer_email, total, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return {
      success: true,
      stats: {
        totalRevenue: parseFloat(revenue.total),
        orders: parseInt(ordersCount.total),
        customers: parseInt(customersCount.total),
        recentSales: recentSales.map(s => ({
          name: s.customer_name,
          email: s.customer_email,
          value: parseFloat(s.total),
          date: s.created_at
        }))
      }
    };
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  base_price: number;
  sale_price: number | null;
  stock: number;
  images: string[];
  tags: string[];
  color: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
}>) {
  await checkAdmin();
  try {
    const allowedKeys = [
      'name', 'slug', 'description', 'category_id', 
      'base_price', 'sale_price', 'stock', 'images', 'tags', 'color', 'is_active', 'metadata'
    ];
    
    const updateData: any = {};
    Object.keys(data).forEach(key => {
      if (allowedKeys.includes(key) && (data as any)[key] !== undefined) {
        updateData[key] = (data as any)[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }

    const product = await sql`
      UPDATE products 
      SET ${sql(updateData)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    const updatedProduct = product[0];

    // Update Stripe if needed
    if (updateData.name || updateData.description || updateData.images) {
      if (updatedProduct.stripe_product_id) {
        try {
          await stripe.products.update(updatedProduct.stripe_product_id, {
            name: updateData.name,
            description: updateData.description,
            images: updateData.images?.length > 0 ? updateData.images.slice(0, 8) : undefined,
          });
        } catch (stripeError) {
          console.error('Failed to update product in Stripe:', stripeError);
        }
      }
    }

    revalidatePath('/produtos');
    revalidatePath('/x7z-4dm1n-P4n3l/products');

    return { success: true, product: product[0] };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  await checkAdmin();
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    
    revalidatePath('/produtos');
    revalidatePath('/x7z-4dm1n-P4n3l/products');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadProductImage(formData: FormData, productSlug?: string) {
  await checkAdmin();
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Default folder structure: /mimuus/products/ (legacy/default)
    // If slug provided: /mimuus/products/[slug]
    const targetFolder = productSlug 
      ? `/mimuus/products/${productSlug.toLowerCase()}`
      : '/mimuus/products';

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: targetFolder
    });

    return { success: true, url: uploadResponse.url };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

// --- SITE SETTINGS ---
export async function getSiteSettings() {
  try {
    const [settings] = await sql`SELECT * FROM site_settings WHERE id = 'global'`;
    return { success: true, settings: settings || null };
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSiteSettings(data: any) {
  await checkAdmin();
  try {
    await sql`
      INSERT INTO site_settings ${sql({ ...data, id: 'global' })}
      ON CONFLICT (id) DO UPDATE SET ${sql(data)}, updated_at = NOW()
    `;
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }
}

// --- CATEGORIES ---
export async function getCategories() {
  try {
    const categories = await sql`SELECT * FROM categories ORDER BY name ASC`;
    return { success: true, categories: categories as unknown as any[] };
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminProducts() {
  await checkAdmin();
  try {
    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    return { success: true, products };
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return { success: false, error: error.message };
  }
}

export async function upsertCategory(data: { id?: string; name: string; slug: string; parent_id?: string | null }) {
  await checkAdmin();
  try {
    if (data.id) {
       await sql`
        UPDATE categories 
        SET name = ${data.name}, slug = ${data.slug}, parent_id = ${data.parent_id || null}, updated_at = NOW()
        WHERE id = ${data.id}
      `;
    } else {
      await sql`
        INSERT INTO categories (name, slug, parent_id)
        VALUES (${data.name}, ${data.slug}, ${data.parent_id || null})
      `;
    }
    revalidatePath('/x7z-4dm1n-P4n3l/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Error upserting category:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/x7z-4dm1n-P4n3l/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}

// --- EDITOR CONFIGS ---
export async function getEditorConfigs(type?: string) {
  try {
    const configs = type 
      ? await sql`SELECT * FROM editor_configs WHERE type = ${type} AND is_active = true ORDER BY display_order ASC`
      : await sql`SELECT * FROM editor_configs WHERE is_active = true ORDER BY type, display_order ASC`;
    return { success: true, configs };
  } catch (error: any) {
    console.error('Error fetching editor configs:', error);
    return { success: false, error: error.message };
  }
}

// --- ORDERS ---
export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdmin();
  try {
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
    `;
    revalidatePath('/x7z-4dm1n-P4n3l/orders');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

// Helper para gerar slug a partir do nome
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por -
    .replace(/^-+|-+$/g, ''); // Remove - do início e fim
}
