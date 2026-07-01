-- Custom SQL migration file, put your code below! --
-- Uključuje Row Level Security (RLS) na svim public tabelama i uklanja direktne
-- privilegije anon/authenticated rola (Supabase PostgREST / anon ključ).
--
-- SIGURNOST: aplikacija se konektuje kao rola `postgres` koja ima
-- rolbypassrls=true I vlasnik je svih tabela → NIJE pogođena ovim (bypassuje RLS).
-- Bez politika je namerno (nema politike = potpuno zaključano za anon/authenticated).
-- Bez FORCE ROW LEVEL SECURITY (da vlasnik/app ostane izuzet).
-- ENABLE i REVOKE su idempotentni (bezbedno pri ponovnom pokretanju).

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
-- Belt-and-suspenders: skini direktne privilegije anon/authenticated na svim
-- postojećim tabelama (ne dira rolu `postgres` koju app koristi).
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
--> statement-breakpoint
-- Spreči da buduće tabele (koje kreira `postgres`) automatski dobiju te grantove.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
