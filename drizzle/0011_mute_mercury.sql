CREATE TABLE "newsletter_signups" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
-- Dosledno sa 0010_enable_rls: uključi RLS i na novoj tabeli. Bez politika =
-- potpuno zaključano za anon/authenticated. App (rola postgres, rolbypassrls)
-- i dalje piše preko servera. Anon/authenticated nemaju grantove (ALTER DEFAULT
-- PRIVILEGES iz 0010 već sprečava automatske grantove na nove tabele).
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
