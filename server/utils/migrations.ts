/**
 * Database Migration Runner
 * Automatically runs migrations on server startup
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import getDatabase from "../utils/db";

export async function runMigrations() {
  const db = getDatabase();

  console.log("[Migrations] Starting database migrations...");

  try {
    // Detect database type from connection
    const isPostgres = db.type === "postgres";
    const migrationName = isPostgres
      ? "001_initial_schema_postgresql"
      : "001_initial_schema_sqlite";

    console.log(
      `[Migrations] Detected ${isPostgres ? "PostgreSQL" : "SQLite"} database`,
    );

    // Create migrations table with appropriate syntax
    if (isPostgres) {
      await db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      await db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          executed_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
    }

    // Check which migrations have been run
    const executedResult = await db.query<{ name: string }>(
      "SELECT name FROM migrations ORDER BY id",
    );
    const executedMigrations = new Set(executedResult.rows.map((r) => r.name));

    if (!executedMigrations.has(migrationName)) {
      console.log(`[Migrations] Running ${migrationName}...`);

      const migrationPath = join(
        process.cwd(),
        "migrations",
        `${migrationName}.sql`,
      );

      if (existsSync(migrationPath)) {
        const sql = readFileSync(migrationPath, "utf-8");

        if (isPostgres) {
          // PostgreSQL can execute multi-statement SQL
          await db.query(sql);
        } else {
          // SQLite - split by semicolons and execute each statement individually
          const statements = sql
            .split(';')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0 && !s.startsWith('--'));

          for (const statement of statements) {
            if (statement.length > 0) {
              await db.query(statement);
            }
          }
        }

        // Record migration


        // Record migration
        await db.query("INSERT INTO migrations (name) VALUES ($1)", [
          migrationName,
        ]);

        console.log(`[Migrations] ✅ ${migrationName} completed`);
      } else {
        console.warn(
          `[Migrations] ⚠️  Migration file not found: ${migrationPath}`,
        );
      }
    } else {
      console.log(`[Migrations] ⏭️  ${migrationName} already executed`);
    }

    console.log("[Migrations] All migrations completed successfully");
  } catch (error) {
    console.error("[Migrations] Failed to run migrations:", error);
    throw error;
  }
}

export default runMigrations;
