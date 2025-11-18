import vine from '@vinejs/vine'

/**
 * Validator para crear una Actividad Turística
 */
export const createTouristActivityValidator = vine.compile(
  vine.object({
    municipalityId: vine.number().positive().withoutDecimals(),
    name: vine.string().trim().minLength(3).maxLength(150),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]).nullable().optional(),
    duration: vine.number().positive().withoutDecimals().min(1).max(480).nullable().optional(),
    category: vine
      .enum([
        'cultural',
        'adventure',
        'gastronomic',
        'recreational',
        'ecological',
        'aquatic',
        'other',
      ])
      .optional(),
  })
)

/**
 * Validator para actualizar una Actividad Turística
 */
export const updateTouristActivityValidator = vine.compile(
  vine.object({
    municipalityId: vine.number().positive().withoutDecimals().optional(),
    name: vine.string().trim().minLength(3).maxLength(150).optional(),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]).nullable().optional(),
    duration: vine.number().positive().withoutDecimals().min(1).max(480).nullable().optional(),
    category: vine
      .enum([
        'cultural',
        'adventure',
        'gastronomic',
        'recreational',
        'ecological',
        'aquatic',
        'other',
      ])
      .optional(),
  })
)
