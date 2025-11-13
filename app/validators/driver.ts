import vine from '@vinejs/vine'

/**
 * Validador para crear un conductor
 */
export const createDriverValidator = vine.compile(
  vine.object({
    user_id: vine.string().trim().minLength(1),
    experience_years: vine.number().min(0).max(100),
  })
)

/**
 * Validador para actualizar un conductor
 */
export const updateDriverValidator = vine.compile(
  vine.object({
    user_id: vine.string().trim().minLength(1).optional(),
    experience_years: vine.number().min(0).max(100).optional(),
  })
)
