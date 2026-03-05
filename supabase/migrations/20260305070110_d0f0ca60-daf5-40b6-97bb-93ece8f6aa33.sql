
-- Inventory / Ingredients table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  stock_level NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  reorder_level NUMERIC NOT NULL DEFAULT 5,
  usage_rate_per_day NUMERIC NOT NULL DEFAULT 0,
  last_restocked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can insert inventory" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update inventory" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete inventory" ON public.inventory FOR DELETE USING (true);

-- Staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Waiter',
  shift TEXT NOT NULL DEFAULT 'Morning',
  contact TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Anyone can insert staff" ON public.staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update staff" ON public.staff FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete staff" ON public.staff FOR DELETE USING (true);

-- Restaurant tables (floor map)
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'available',
  position_x NUMERIC NOT NULL DEFAULT 0,
  position_y NUMERIC NOT NULL DEFAULT 0,
  customer_name TEXT,
  reservation_time TEXT,
  guests INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tables" ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tables" ON public.restaurant_tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tables" ON public.restaurant_tables FOR UPDATE USING (true);

-- Seed some default tables
INSERT INTO public.restaurant_tables (table_number, capacity, position_x, position_y) VALUES
(1, 2, 10, 10), (2, 2, 30, 10), (3, 4, 50, 10), (4, 4, 70, 10),
(5, 6, 10, 35), (6, 6, 30, 35), (7, 4, 50, 35), (8, 8, 70, 35),
(9, 2, 10, 60), (10, 4, 30, 60), (11, 4, 50, 60), (12, 6, 70, 60);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
