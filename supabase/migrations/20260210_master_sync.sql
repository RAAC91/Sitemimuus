-- MIGRAÇÃO V2.1: MASTER CMS & ARCHITECTURE SYNC
-- Objetivo: Sincronizar banco com lógica da aplicação e adicionar gestão dinâmica.

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE CONFIGURAÇÕES DO SITE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    cnpj TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#f43f5e',
    secondary_color TEXT DEFAULT '#0f172a',
    font_family TEXT DEFAULT 'Montserrat',
    cart_item_scale FLOAT DEFAULT 1.0,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE CONFIGURAÇÕES DO EDITOR (Cores, Fontes, SKUs)
CREATE TABLE IF NOT EXISTS public.editor_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('sku', 'font', 'color', 'icon_category')),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AJUSTES NA TABELA DE PRODUTOS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='slug') THEN
        ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='images') THEN
        ALTER TABLE public.products ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='tags') THEN
        ALTER TABLE public.products ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock') THEN
        ALTER TABLE public.products ADD COLUMN stock INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_active') THEN
        ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='updated_at') THEN
        ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 6. TABELA DE REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DADOS INICIAIS
INSERT INTO public.site_settings (id, cnpj, font_family) 
VALUES ('global', '00.000.000/0000-00', 'Montserrat')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.editor_configs (type, name, value, config) VALUES
('sku', 'Branco', 'SKU-BRANCO', '{"price": 89.90, "color": "#FFFFFF", "img": "https://ik.imagekit.io/gocase/v3/case_types/1534/original/shbranca.jpg?tr=w-500,h-500"}'),
('sku', 'Preto', 'SKU-PRETO', '{"price": 89.90, "color": "#000000", "img": "https://ik.imagekit.io/gocase/v3/case_types/1537/original/shpretu.jpg?tr=w-500,h-500"}'),
('sku', 'Rosa', 'SKU-ROSA', '{"price": 89.90, "color": "#FFC0CB", "img": "https://ik.imagekit.io/gocase/v3/case_types/1535/original/shrosa.jpg?tr=w-500,h-500"}'),
('sku', 'Azul', 'SKU-AZUL', '{"price": 89.90, "color": "#87CEEB", "img": "https://ik.imagekit.io/gocase/v3/case_types/1539/original/shzumari.jpg?tr=w-500,h-500"}'),
('sku', 'Lilás', 'SKU-LILAS', '{"price": 89.90, "color": "#C8A2C8", "img": "https://ik.imagekit.io/gocase/v3/case_types/1540/original/shlilais.jpg?tr=w-500,h-500"}')
ON CONFLICT DO NOTHING;
