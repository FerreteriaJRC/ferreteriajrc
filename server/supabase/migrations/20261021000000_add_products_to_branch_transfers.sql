ALTER TABLE public.branch_transfer_requests
ADD COLUMN IF NOT EXISTS products jsonb NOT NULL DEFAULT '[]'::jsonb;
