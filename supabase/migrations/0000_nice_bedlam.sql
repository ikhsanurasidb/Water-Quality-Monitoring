CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"suhu" integer NOT NULL,
	"tds" integer NOT NULL,
	"ph" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
