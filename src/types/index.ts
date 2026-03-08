export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number // Aligned with productService
  oldPrice?: number | null // Aligned with productService
  image?: string // Aligned with productService
  images?: string[]
  badge?: string // Aligned with productService
  tagline?: string // Aligned with productService
  use?: string // Aligned with productService
  style?: string // Aligned with productService
  customizable?: boolean // Aligned with productService
  stock?: number
  category_id?: string | null
  category?: string // DB column for category slug
  // Fields from DB schema (keep specific fields if needed, but match service output)
  base_price?: number
  sale_price?: number | null
  tags?: string[]
  color?: string
  metadata?: Record<string, unknown>
  is_active?: boolean
  created_at?: string
  updated_at?: string
  // Virtual field for join
  category_name?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string | null
  created_at?: string
}

export interface SiteSettings {
  id: string
  cnpj?: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  font_family?: string
  cart_item_scale?: number
  metadata?: Record<string, unknown>
  updated_at?: string
}

export interface EditorConfig {
  id: string
  type: 'sku' | 'font' | 'color' | 'icon_category'
  name: string
  value: string
  config?: Record<string, unknown>
  is_active: boolean
  display_order: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  customization?: DesignData
  thumbnail?: string
  image?: string
  style?: string // Added for checkout display
}

export interface DesignData {
  text?: string
  textColor?: string
  textFont?: string
  fontSize?: number
  backgroundColor?: string
  backgroundPattern?: string
  uploadedImage?: string
  layers?: unknown[]
  previewImage?: string
}

export interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered'
  total: number
  created_at: string
}
