CREATE TABLE `signatures` (
	`id` integer PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL,
	`ip_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `signatures_text_unique` ON `signatures` (`text`);
