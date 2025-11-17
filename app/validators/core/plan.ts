import vine from '@vinejs/vine'

/**
 * Validator para crear un Plan
 */
export const createPlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(1000).optional(),
    price: vine.number().positive(),
    duration: vine.number().positive().optional(),
  })
)

/**
 * Validator para actualizar un Plan
 */
export const updatePlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().minLength(3).maxLength(1000).optional(),
    price: vine.number().positive().optional(),
    duration: vine.number().positive().optional(),
  })
)
