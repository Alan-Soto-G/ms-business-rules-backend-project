import vine from '@vinejs/vine'

/**
 * Validator para crear un municipio
 */
export const createMunicipalityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    department: vine.string().trim().minLength(2).maxLength(100),
    code: vine.string().trim().minLength(2).maxLength(20),
  })
)

/**
 * Validator para actualizar un municipio
 */
export const updateMunicipalityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    department: vine.string().trim().minLength(2).maxLength(100).optional(),
    code: vine.string().trim().minLength(2).maxLength(20).optional(),
  })
)
