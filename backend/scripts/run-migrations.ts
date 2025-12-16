import { dataSource } from '../src/infrastructure/database/data-source'

async function runMigrations() {
  try {
    await dataSource.initialize()
    console.log('Database connection established')
    
    const migrations = await dataSource.runMigrations()
    console.log(`Ran ${migrations.length} migration(s):`)
    
    migrations.forEach(migration => {
      console.log(`  - ${migration.name}`)
    })
    
    await dataSource.destroy()
    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()