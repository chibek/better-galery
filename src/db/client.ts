import * as schema from "./schema";
import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

export const DATABASE_NAME = "gallery.db";

// Singleton pattern to ensure single database instance
class DatabaseClient {
  private static instance: DatabaseClient;
  private _expoDb: SQLiteDatabase | null = null;
  private _db: ExpoSQLiteDatabase<typeof schema> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  /**
   * Initialize the database connection (call once at app startup)
   */
  public initialize(): void {
    if (this._expoDb && this._db) {
      return; // Already initialized
    }

    try {
      this._expoDb = openDatabaseSync(DATABASE_NAME, {
        enableChangeListener: true,
      });
      this._db = drizzle(this._expoDb, { schema });
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  /**
   * Get the raw SQLite database instance
   */
  public getExpoDb(): SQLiteDatabase {
    if (!this._expoDb) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this._expoDb;
  }

  /**
   * Get the Drizzle database instance
   */
  public getDb(): ExpoSQLiteDatabase<typeof schema> {
    if (!this._db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this._db;
  }

  /**
   * Check if database is initialized
   */
  public isInitialized(): boolean {
    return this._expoDb !== null && this._db !== null;
  }
}

// Export singleton instance methods
const dbClient = DatabaseClient.getInstance();

export const initializeDatabase = () => dbClient.initialize();
export const getExpoDb = () => dbClient.getExpoDb();
export const getDb = () => dbClient.getDb();
export const isDbInitialized = () => dbClient.isInitialized();

// Auto-initialize on first access with Proxy pattern
export const expoDb = new Proxy({} as SQLiteDatabase, {
  get: (_, prop) => {
    if (!dbClient.isInitialized()) {
      dbClient.initialize();
    }
    const db = getExpoDb();
    return typeof db[prop as keyof SQLiteDatabase] === "function"
      ? (db[prop as keyof SQLiteDatabase] as Function).bind(db)
      : db[prop as keyof SQLiteDatabase];
  },
});

export const db = new Proxy({} as ExpoSQLiteDatabase<typeof schema>, {
  get: (_, prop) => {
    if (!dbClient.isInitialized()) {
      dbClient.initialize();
    }
    const database = getDb();
    return typeof database[prop as keyof ExpoSQLiteDatabase<typeof schema>] ===
      "function"
      ? (
          database[prop as keyof ExpoSQLiteDatabase<typeof schema>] as Function
        ).bind(database)
      : database[prop as keyof ExpoSQLiteDatabase<typeof schema>];
  },
});
