import vine from '@vinejs/vine'

/**
 * Validator para crear una nueva aerolínea
 */
export const createAirlineValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255).trim(),
    codeIata: vine
      .string()
      .minLength(2)
      .maxLength(2)
      .trim()
      .toUpperCase()
      .unique(async (db, value) => {
        const airline = await db.from('airlines').where('code_iata', value).first()
        return !airline
      }),
    codeIcao: vine
      .string()
      .minLength(3)
      .maxLength(3)
      .trim()
      .toUpperCase()
      .unique(async (db, value) => {
        const airline = await db.from('airlines').where('code_icao', value).first()
        return !airline
      }),
    countryOfOrigin: vine.string().minLength(2).maxLength(100).trim(),
    isActive: vine.boolean().optional(),
  })
)

/**
 * Validator para actualizar una aerolínea existente
 */
export const updateAirlineValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255).trim().optional(),
    codeIata: vine.string().minLength(2).maxLength(2).trim().toUpperCase().optional(),
    codeIcao: vine.string().minLength(3).maxLength(3).trim().toUpperCase().optional(),
    countryOfOrigin: vine.string().minLength(2).maxLength(100).trim().optional(),
    isActive: vine.boolean().optional(),
  })
)
