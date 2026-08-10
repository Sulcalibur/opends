/**
 * Settings Repository — PocketBase-backed
 *
 * Same interface as the SQL SettingsRepository, reading/writing the
 * `settings` collection (key/value JSON pairs). The PocketBase collection
 * has no is_public column — every setting is treated as public.
 * The committed schema has null list/view rules, so all operations run
 * with admin auth.
 */

import getPocketBase, { authenticateAdmin } from '../utils/pocketbase'

export interface Setting {
  id: string
  key: string
  value: unknown
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface PbSettingRecord {
  id: string
  key: string
  value: unknown
  created: string
  updated: string
}

function mapSetting(record: PbSettingRecord): Setting {
  return {
    id: record.id,
    key: record.key,
    value: record.value,
    is_public: true,
    created_at: record.created,
    updated_at: record.updated,
  }
}

class SettingsRepository {
  /**
   * Get all settings
   */
  async getAll(): Promise<Setting[]> {
    await authenticateAdmin()
    const pb = getPocketBase()

    const result = await pb.collection('settings').getList<PbSettingRecord>(1, 200, {
      sort: 'key',
    })

    return result.items.map(mapSetting)
  }

  /**
   * Get public settings (all settings are public in the PB schema)
   */
  async getPublic(): Promise<Record<string, unknown>> {
    const all = await this.getAll()
    const publicSettings: Record<string, unknown> = {}
    for (const setting of all) {
      publicSettings[setting.key] = setting.value
    }
    return publicSettings
  }

  /**
   * Get setting by key
   */
  async getByKey(key: string): Promise<Setting | null> {
    await authenticateAdmin()
    const pb = getPocketBase()
    try {
      const record = await pb
        .collection('settings')
        .getFirstListItem<PbSettingRecord>(`key = "${key}"`)
      return mapSetting(record)
    } catch {
      return null
    }
  }

  /**
   * Update or create setting
   */
  async update(key: string, value: unknown): Promise<void> {
    await authenticateAdmin()
    const pb = getPocketBase()

    const existing = await this.getByKey(key)
    if (existing) {
      await pb.collection('settings').update(existing.id, { value })
    } else {
      await pb.collection('settings').create({ key, value })
    }
  }

  /**
   * Update multiple settings (no transaction support in PocketBase —
   * applied sequentially)
   */
  async updateMultiple(settings: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.update(key, value)
    }
  }

  /**
   * Delete setting by key
   */
  async delete(key: string): Promise<boolean> {
    await authenticateAdmin()
    const pb = getPocketBase()

    const existing = await this.getByKey(key)
    if (!existing) return false

    try {
      await pb.collection('settings').delete(existing.id)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get setting value by key (convenience method)
   */
  async getValue<T = unknown>(key: string): Promise<T | null> {
    const setting = await this.getByKey(key)
    return setting?.value as T | null
  }

  /**
   * Set setting value by key (convenience method)
   */
  async setValue(key: string, value: unknown): Promise<void> {
    await this.update(key, value)
  }
}

export default new SettingsRepository()
