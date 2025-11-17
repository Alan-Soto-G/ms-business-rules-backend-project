import vine from '@vinejs/vine'

/**
 * Validator para crear una Actividad Turística
 */
export const createTouristActivityValidator = vine.compile(
  vine.object({
    municipalityId: vine.number().positive(),
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(1000).optional(),
    price: vine.number().positive().optional(),
    duration: vine.number().positive().optional(),
    category: vine.enum(['cultural', 'adventure', 'gastronomic', 'recreational', 'other']),
  })
)

/**
 * Validator para actualizar una Actividad Turística
 */
export const updateTouristActivityValidator = vine.compile(
  vine.object({
    municipalityId: vine.number().positive().optional(),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().minLength(3).maxLength(1000).optional(),
    price: vine.number().positive().optional(),
    duration: vine.number().positive().optional(),
    category: vine
      .enum(['cultural', 'adventure', 'gastronomic', 'recreational', 'other'])
      .optional(),
  })
)
