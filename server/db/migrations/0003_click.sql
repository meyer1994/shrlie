CREATE TABLE `click` (
	`id` text PRIMARY KEY NOT NULL,
	`lie_id` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`referer` text,
	`cf` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lie_id`) REFERENCES `lie`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `click_lie_id_idx` ON `click` (`lie_id`);