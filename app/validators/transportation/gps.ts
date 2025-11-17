import vine from '@vinejs/vine'

/**
 * Validator para crear un GPS
 */
export const createGpsValidator = vine.compile(
  vine.object({
    vehicleId: vine.number().min(1),
    serialNumber: vine
      .string()
      .trim()
      .minLength(5)
      .maxLength(50)
      .unique(async (db, value) => {
        const gps = await db.from('gps').where('serial_number', value).first()
        return !gps
      }),
    brand: vine.string().trim().minLength(2).maxLength(100),
    model: vine.string().trim().minLength(1).maxLength(100),
    isActive: vine.boolean().optional(),
  })
)

/**
 * Validator para actualizar un GPS
 */
export const updateGpsValidator = vine.compile(
  vine.object({
    vehicleId: vine.number().min(1).optional(),
    serialNumber: vine.string().trim().minLength(5).maxLength(50).optional(),
    brand: vine.string().trim().minLength(2).maxLength(100).optional(),
    model: vine.string().trim().minLength(1).maxLength(100).optional(),
    isActive: vine.boolean().optional(),
  })
)
