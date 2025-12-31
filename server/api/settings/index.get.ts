export default defineEventHandler(async (event) => {
    const db = event.context.cloudflare?.env?.DB
    if (!db) {
        throw createError({
            statusCode: 500,
            message: 'Database connection not available'
        })
    }

    // TODO: Add proper auth check
    // For now, only admins can access settings

    const { SettingsRepository } = await import('~~/server/repositories/settings.repository')
    const repo = new SettingsRepository(db)

    const settings = await repo.getAll()

    // Transform to a cleaner object for the frontend
    const settingsMap: Record<string, any> = {}
    settings.forEach(s => {
        settingsMap[s.key] = s.value
    })

    return {
        success: true,
        settings: settingsMap
    }
})
