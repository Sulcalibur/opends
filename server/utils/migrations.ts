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
          // SQLite - execute each statement separately (better-sqlite3 cannot
          // run multi-statement SQL). A naive split(';') breaks on triggers,
          // whose body contains internal semicolons (BEGIN ... UPDATE ...; END;),
          // and drops chunks that start with a "--" banner comment. This
          // tokenizer splits only on statement-terminating semicolons:
          // inside string literals, identifiers, parentheses, BEGIN/END
          // trigger blocks, or after inline "--" comments it never splits.
          const statements = splitSqlStatements(sql);

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

/**
 * Split a SQLite script into individual statements without breaking on:
 *  - string literals ('...', "...")
 *  - quoted/backtick/bracket identifiers
 *  - trigger bodies (BEGIN ... END) whose internal UPDATEs end with ';'
 *  - "--" comments (skipped)
 * Splits only on ';' at paren depth 0 outside any BEGIN block.
 */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = []
  let current = ''
  let paren = 0
  let block = 0 // BEGIN ... END trigger depth
  let i = 0
  const n = sql.length

  const isWordChar = (ch: string) => /[A-Za-z0-9_]/.test(ch)

  while (i < n) {
    const ch = sql[i]
    const next = sql[i + 1]

    // Line comment — skip to end of line
    if (ch === '-' && next === '-') {
      while (i < n && sql[i] !== '\n') i++
      current += '\n'
      i++
      continue
    }

    // Quoted string or identifier — copy verbatim until its closer
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      current += quote
      i++
      while (i < n) {
        if (sql[i] === quote) {
          if (sql[i + 1] === quote) {
            current += quote + quote // escaped quote
            i += 2
            continue
          }
          current += quote
          i++
          break
        }
        current += sql[i]
        i++
      }
      continue
    }

    // [bracket] identifiers
    if (ch === '[') {
      current += ch
      i++
      while (i < n && sql[i] !== ']') {
        current += sql[i]
        i++
      }
      if (i < n) { current += ']'; i++ }
      continue
    }

    // Parenthesis depth
    if (ch === '(') paren++
    if (ch === ')') paren = Math.max(0, paren - 1)

    // BEGIN / END block tracking (only meaningful outside parentheses)
    if (/[A-Za-z]/.test(ch)) {
      let j = i
      while (j < n && isWordChar(sql[j])) j++
      const word = sql.slice(i, j).toUpperCase()
      current += sql.slice(i, j)
      if (paren === 0) {
        if (word === 'BEGIN') block++
        else if (word === 'END') block = Math.max(0, block - 1)
      }
      i = j
      continue
    }

    // Statement terminator
    if (ch === ';' && paren === 0 && block === 0) {
      const trimmed = current.trim()
      if (trimmed) statements.push(trimmed)
      current = ''
      i++
      continue
    }

    current += ch
    i++
  }

  const last = current.trim()
  if (last) statements.push(last)

  return statements
}
