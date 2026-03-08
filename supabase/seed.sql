-- Seed products data
insert into public.products (name, price, old_price, image, badge, tagline, use, style, customizable)
values
  ('Garrafa Pink Punk', 119.9, 139.9, '/products/pink-punk.png', 'Mais Vendida', 'A favorita das creators.', ARRAY['academia', 'presente'], 'pop', true),
  ('Garrafa Cyan Pop', 119.9, 139.9, '/products/cyan-pop.png', 'Lançamento', 'Estilo urbano vibrante.', ARRAY['trabalho'], 'pop', true),
  ('Garrafa Yellow Mellow', 139.9, null, '/products/yellow.png', 'Ideal para Presente', 'Perfeita para um toque doce.', ARRAY['presente'], 'premium', false);
