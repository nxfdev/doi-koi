-- DOI KOI Production Database Schema (PostgreSQL / Supabase)
-- "Bogura at your doorsteps"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bengali_name TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tagline TEXT,
    description TEXT,
    weight TEXT,
    pot_type TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    nutritional_info JSONB DEFAULT '{}'::jsonb,
    storage_instructions TEXT,
    shelf_life TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    images JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    fee NUMERIC(10, 2) NOT NULL,
    estimated_days TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    area TEXT NOT NULL,
    full_address TEXT NOT NULL,
    delivery_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'UNPAID',
    order_status TEXT NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site CMS Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    content_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Public products view" ON public.products
    FOR SELECT USING (is_available = true);

-- Public can view active delivery zones
CREATE POLICY "Public delivery zones view" ON public.delivery_zones
    FOR SELECT USING (is_active = true);

-- Public can view published site content
CREATE POLICY "Public content view" ON public.site_content
    FOR SELECT USING (true);

-- Customers can view their own orders
CREATE POLICY "Customers view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Service role / Admin has full access
CREATE POLICY "Admin full products access" ON public.products
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%@doikoi.com');

CREATE POLICY "Admin full orders access" ON public.orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%@doikoi.com');
