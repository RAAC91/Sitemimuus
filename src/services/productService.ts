import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
      price: item.price,
      oldPrice: item.old_price,
      image: item.image,
      badge: item.badge,
      tagline: item.tagline,
      use: item.use,
      style: item.style,
      customizable: item.customizable,
      description: item.description,
      stock: item.stock
    }));
  },

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
      price: data.price,
      oldPrice: data.old_price,
      image: data.image,
      badge: data.badge,
      tagline: data.tagline,
      use: data.use,
      style: data.style,
      customizable: data.customizable,
      description: data.description,
      stock: data.stock
    };
  }
};
