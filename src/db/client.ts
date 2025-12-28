import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

export const DATABASE_NAME = "gallery.db";

// 1. Open the physical connection
export const expoDb = openDatabaseSync("db.db", {
  enableChangeListener: true,
});

// 2. Initialize Drizzle once (Singleton)
export const db = drizzle(expoDb, { schema });
