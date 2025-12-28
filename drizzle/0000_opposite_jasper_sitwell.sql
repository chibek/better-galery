CREATE TABLE `album_metadata` (
	`album_id` text PRIMARY KEY NOT NULL,
	`description` text,
	`cover_uri` text,
	`display_order` integer DEFAULT 0,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `order_idx` ON `album_metadata` (`display_order`);