import vine from '@vinejs/vine'

/**
 * Validator for creating an aircraft.
 * Supports two scenarios:
 * A) Provide vehicleId to associate with existing vehicle
 * B) Provide all vehicle data to create a new vehicle
 */
export const createAircraftValidator = vine.compile(
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

    // Aircraft-specific data (always required)
    airlineId: vine.number().positive(),
    registrationCountry: vine.string().trim().minLength(2).maxLength(100),
    maxAltitude: vine.number().min(0).max(60000).optional(),
  })
)

/**
 * Validator for updating an aircraft.
 * All fields are optional for partial updates.
 */
export const updateAircraftValidator = vine.compile(
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

    // Aircraft-specific data (optional)
    airlineId: vine.number().positive().optional(),
    registrationCountry: vine.string().trim().minLength(2).maxLength(100).optional(),
    maxAltitude: vine.number().min(0).max(60000).optional(),
  })
)
