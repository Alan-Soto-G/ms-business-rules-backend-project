import vine from '@vinejs/vine'

/**
 * Validator for creating a car.
 * Supports two scenarios:
 * A) Provide vehicleId to associate with existing vehicle
 * B) Provide all vehicle data to create a new vehicle
 */
export const createCarValidator = vine.compile(
  vine.object({
    // Option A: Use existing vehicle
    vehicleId: vine.number().positive().optional(),

    // Option B: Create new vehicle (required if vehicleId not provided)
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

    // Car-specific data (always required)
    hotelId: vine.number().positive(),
    fuelType: vine.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg']),
    transmissionType: vine.enum(['manual', 'automatic', 'cvt']),
  })
)

/**
 * Validator for updating a car.
 * All fields are optional for partial updates.
 */
export const updateCarValidator = vine.compile(
  vine.object({
    // Vehicle data (optional)
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

    // Car-specific data (optional)
    hotelId: vine.number().positive().optional(),
    fuelType: vine.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg']).optional(),
    transmissionType: vine.enum(['manual', 'automatic', 'cvt']).optional(),
  })
)
