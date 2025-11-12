import vine from '@vinejs/vine'

/**
 * Validator para crear un municipio
 */
export const createMunicipalityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    department: vine.string().trim().minLength(2).maxLength(255),
    code: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(20)
      .unique(async (db, value) => {
        const municipality = await db.from('municipalities').where('code', value).first()
        return !municipality
      }),
  })
)

/**
 * Validator para actualizar un municipio
 */
export const updateMunicipalityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    department: vine.string().trim().minLength(2).maxLength(255).optional(),
    code: vine.string().trim().minLength(2).maxLength(20).optional(),
  })
)

/**
 * Validator para crear un itinerario (relación entre municipios)
 */
export const createItineraryValidator = vine.compile(
  vine.object({
    destinationMunicipalityId: vine.number().min(1),
    distance: vine.number().min(0).optional(),
    estimatedTime: vine.number().min(0).optional(),
  })
)
