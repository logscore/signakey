CREATE TABLE "signatures" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"ip_hash" text NOT NULL,
	CONSTRAINT "signatures_text_unique" UNIQUE("text")
);
