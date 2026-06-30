CREATE TYPE "public"."tag_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"group_label" text DEFAULT '' NOT NULL,
	"proposed_by_shop_id" text,
	"proposed_by_name" text DEFAULT '' NOT NULL,
	"status" "tag_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_proposed_by_shop_id_shops_id_fk" FOREIGN KEY ("proposed_by_shop_id") REFERENCES "public"."shops"("id") ON DELETE set null ON UPDATE no action;