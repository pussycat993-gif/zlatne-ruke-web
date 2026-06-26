ALTER TABLE "conversations" ADD COLUMN "last_sender_id" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "buyer_last_read_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "seller_last_read_at" timestamp with time zone;