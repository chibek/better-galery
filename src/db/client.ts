import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const DATABASE_NAME = "gallery.db";

// 1. Open the physical connection
export const expoDb = openDatabaseSync(DATABASE_NAME);

// 2. Initialize Drizzle once (Singleton)
export const db = drizzle(expoDb, { schema });
