/**
 * Global teardown — remove this run's throwaway SQLite database.
 */
import type { FullConfig } from '@playwright/test'
import { rmSync } from 'node:fs'
import { DB_PATH } from './support/env'

export default async function globalTeardown(_config: FullConfig): Promise<void> {
  for (const suffix of ['', '-wal', '-shm']) {
    try {
      rmSync(`${DB_PATH}${suffix}`, { force: true })
    } catch {
      /* best effort */
    }
  }
}
