import vine from '@vinejs/vine'

/**
 * Validator for creating a vehicle.
 */
export const createVehicleValidator = vine.compile(
  vine.object({
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]{2,20}$/)
      .unique(async (db, value) => {
        const vehicle = await db.from('vehicles').where('license_plate', value).first()
        return !vehicle
      }),
    brand: vine.string().trim().minLength(2).maxLength(50),
    model: vine.string().trim().minLength(1).maxLength(50),
    year: vine.number().min(1900).max(2100),
    color: vine.string().trim().minLength(2).maxLength(30),
    numberOfSeats: vine.number().min(1).max(100),
    vehicleType: vine.string().trim().minLength(2).maxLength(50),
    status: vine.enum(['available', 'in_use', 'maintenance', 'retired']).optional(),
  })
)

/**
 * Validator for updating a vehicle.
 * All fields are optional for partial updates.
 */
export const updateVehicleValidator = vine.compile(
  vine.object({
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]{2,20}$/)
      .optional(),
    brand: vine.string().trim().minLength(2).maxLength(50).optional(),
    model: vine.string().trim().minLength(1).maxLength(50).optional(),
    year: vine.number().min(1900).max(2100).optional(),
    color: vine.string().trim().minLength(2).maxLength(30).optional(),
    numberOfSeats: vine.number().min(1).max(100).optional(),
    vehicleType: vine.string().trim().minLength(2).maxLength(50).optional(),
    status: vine.enum(['available', 'in_use', 'maintenance', 'retired']).optional(),
  })
)
