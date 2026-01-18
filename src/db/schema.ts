import { index,integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const albumMetadata = sqliteTable(
  "album_metadata",
  {
    albumId: text("album_id").primaryKey().notNull(),
    description: text("description"),
    coverUri: text("cover_uri"),
    displayOrder: integer("display_order").default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
  },
  (table) => [index("order_idx").on(table.displayOrder)]
);

export type AlbumMetadata = typeof albumMetadata.$inferSelect;
export type NewAlbumMetadata = typeof albumMetadata.$inferInsert;
