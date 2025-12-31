export default defineEventHandler(async (event) => {
    const db = event.context.cloudflare?.env?.DB
    if (!db) {
        throw createError({
            statusCode: 500,
            message: 'Database connection not available'
        })
    }

    const { SettingsRepository } = await import('~~/server/repositories/settings.repository')
    const repo = new SettingsRepository(db)

    const publicSettings = await repo.getPublic()

    return {
        success: true,
        settings: publicSettings
    }
})
