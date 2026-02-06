/**
 * Settings Repository
 * Database operations for application settings
 * PostgreSQL-compatible version using UniversalDatabase
 */

import getDatabase from "../utils/db";

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

class SettingsRepository {
  /**
   * Get all settings
   */
  async getAll(): Promise<Setting[]> {
    const db = getDatabase();
    const result = await db.query<Setting>(
      "SELECT * FROM settings ORDER BY key ASC",
    );

    // Values are already parsed by PostgreSQL JSONB column
    return result.rows.map((row) => ({
      ...row,
      value: row.value,
    }));
  }

  /**
   * Get public settings (is_public = true)
   */
  async getPublic(): Promise<Record<string, unknown>> {
    const db = getDatabase();
    const result = await db.query<Setting>(
      "SELECT key, value FROM settings WHERE is_public = true",
    );

    const publicSettings: Record<string, unknown> = {};
    result.rows.forEach((row) => {
      publicSettings[row.key] = row.value;
    });

    return publicSettings;
  }

  /**
   * Get setting by key
   */
  async getByKey(key: string): Promise<Setting | null> {
    const db = getDatabase();
    const result = await db.query<Setting>(
      "SELECT * FROM settings WHERE key = $1",
      [key],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      value: row.value,
    };
  }

  /**
   * Update or create setting
   */
  async update(key: string, value: unknown): Promise<void> {
    const db = getDatabase();
    const jsonValue = JSON.stringify(value);

    // Check if key exists
    const existing = await this.getByKey(key);

    if (existing) {
      await db.query(
        `UPDATE settings 
                 SET value = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE key = $2`,
        [jsonValue, key],
      );
    } else {
      await db.query(
        `INSERT INTO settings (key, value, is_public) 
                 VALUES ($1, $2, true)`,
        [key, jsonValue],
      );
    }
  }

  /**
   * Update multiple settings in a transaction
   */
  async updateMultiple(settings: Record<string, unknown>): Promise<void> {
    const db = getDatabase();

    // Use transaction for batch update
    await db.transaction(async (execute) => {
      for (const [key, value] of Object.entries(settings)) {
        const jsonValue = JSON.stringify(value);

        // Use upsert (PostgreSQL 9.5+ syntax)
        await execute(
          `INSERT INTO settings (key, value, is_public, updated_at) 
                     VALUES ($1, $2, true, CURRENT_TIMESTAMP)
                     ON CONFLICT (key) DO UPDATE SET 
                     value = EXCLUDED.value, 
                     updated_at = EXCLUDED.updated_at`,
          [key, jsonValue],
        );
      }
    });
  }

  /**
   * Delete setting by key
   */
  async delete(key: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.query("DELETE FROM settings WHERE key = $1", [key]);
    return result.rowCount > 0;
  }

  /**
   * Get setting value by key (convenience method)
   */
  async getValue<T = unknown>(key: string): Promise<T | null> {
    const setting = await this.getByKey(key);
    return setting?.value as T | null;
  }

  /**
   * Set setting value by key (convenience method)
   */
  async setValue(key: string, value: unknown): Promise<void> {
    await this.update(key, value);
  }
}

export default new SettingsRepository();
