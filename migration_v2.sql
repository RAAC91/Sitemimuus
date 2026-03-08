-- Migration v2.1: Master CMS Foundations (Robust Version)
-- This script aligns the products table and creates categories, site_settings, and editor_configs.

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Align Products Table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='images') THEN
        ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='tags') THEN
        ALTER TABLE products ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='metadata') THEN
        ALTER TABLE products ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY, -- 'global'
    site_name TEXT DEFAULT 'Mimuus',
    cnpj TEXT,
    contact_email TEXT,
    contact_whatsapp TEXT,
    instagram_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    css_tokens JSONB DEFAULT '{}', -- Store design system tokens
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Editor Configs (Colors and Materials)
CREATE TABLE IF NOT EXISTS editor_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'material' or 'print_color'
    name TEXT NOT NULL,
    value TEXT NOT NULL, -- hex or image URL
    price_impact DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}', -- e.g. { style: { background: '...' } } for gradients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert initial data if empty
-- Default category
INSERT INTO categories (name, slug) 
VALUES ('Geral', 'geral')
ON CONFLICT (slug) DO NOTHING;

-- Default global settings
INSERT INTO site_settings (id, site_name) 
VALUES ('global', 'Mimuus')
ON CONFLICT (id) DO NOTHING;
