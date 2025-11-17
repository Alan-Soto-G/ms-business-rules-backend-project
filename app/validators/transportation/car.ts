import vine from '@vinejs/vine'

/**
 * Validator for creating a car.
 * Debe incluir los datos del vehículo y los datos específicos del carro.
 */
export const createCarValidator = vine.compile(
  vine.object({
    // Datos del vehículo
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]{2,15}$/)
      .unique(async (db, value) => {
        const vehicle = await db.from('vehicles').where('license_plate', value).first()
        return !vehicle
      }),
    brand: vine.string().trim().minLength(2).maxLength(100),
    model: vine.string().trim().minLength(1).maxLength(100),
    year: vine
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 5),
    color: vine.string().trim().minLength(3).maxLength(50),
    numberOfSeats: vine.number().min(1).max(50),
    vehicleType: vine.string().trim().optional(),
    status: vine.string().trim().in(['available', 'in_use', 'maintenance', 'retired']).optional(),

    // Datos específicos del carro
    hotelId: vine.number().min(1),
    fuelType: vine.string().trim().minLength(3).maxLength(50),
    transmissionType: vine.string().trim().in(['manual', 'automatic']),
  })
)

/**
 * Validator for updating a car.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 */
export const updateCarValidator = vine.compile(
  vine.object({
    // Datos del vehículo (opcionales)
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]{2,15}$/)
      .optional(),
    brand: vine.string().trim().minLength(2).maxLength(100).optional(),
    model: vine.string().trim().minLength(1).maxLength(100).optional(),
    year: vine
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 5)
      .optional(),
    color: vine.string().trim().minLength(3).maxLength(50).optional(),
    numberOfSeats: vine.number().min(1).max(50).optional(),
    vehicleType: vine.string().trim().optional(),
    status: vine.string().trim().in(['available', 'in_use', 'maintenance', 'retired']).optional(),

    // Datos específicos del carro (opcionales)
    hotelId: vine.number().min(1).optional(),
    fuelType: vine.string().trim().minLength(3).maxLength(50).optional(),
    transmissionType: vine.string().trim().in(['manual', 'automatic']).optional(),
  })
)
