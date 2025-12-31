export default defineEventHandler(async (event) => {
    const db = event.context.cloudflare?.env?.DB
    if (!db) {
        throw createError({
            statusCode: 500,
            message: 'Database connection not available'
        })
    }

    // TODO: Add proper auth check
    // For now, only admins should be able to update settings

    const body = await readBody(event)
    if (!body || typeof body !== 'object') {
        throw createError({
            statusCode: 400,
            message: 'Invalid settings data'
        })
    }

    const { SettingsRepository } = await import('~~/server/repositories/settings.repository')
    const repo = new SettingsRepository(db)

    await repo.updateMultiple(body)

    return {
        success: true,
        message: 'Settings updated successfully'
    }
})
