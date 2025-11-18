import vine from '@vinejs/vine'

/**
 * Validator para crear un Plan
 */
export const createPlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]),
    duration: vine.number().positive().withoutDecimals().min(1).max(365).optional(),
  })
)

/**
 * Validator para actualizar un Plan
 */
export const updatePlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150).optional(),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]).optional(),
    duration: vine.number().positive().withoutDecimals().min(1).max(365).optional(),
  })
)
