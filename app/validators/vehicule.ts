// app/validators/vehicle.ts
import vine from '@vinejs/vine'

/**
 * Validator para crear un nuevo vehículo
 */
export const createVehicleValidator = vine.compile(
  vine.object({
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]+$/)
      .minLength(5)
      .maxLength(15)
      .unique(async (db, value) => {
        const vehicle = await db.from('vehicles').where('license_plate', value).first()
        return !vehicle
      }),
    
    brand: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50),
    
    model: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50),
    
    year: vine
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    
    color: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(30),
    
    capacity: vine
      .number()
      .min(0)
      .max(500),
    
    vehicleType: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(30),
    
    status: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(30)
      .optional()
  })
)

/**
 * Validator para actualizar un vehículo existente
 */
export const updateVehicleValidator = vine.compile(
  vine.object({
    licensePlate: vine
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]+$/)
      .minLength(5)
      .maxLength(15)
      .unique(async (db, value, field) => {
        const vehicle = await db
          .from('vehicles')
          .where('license_plate', value)
          .whereNot('id', field.meta.vehicleId)
          .first()
        return !vehicle
      })
      .optional(),
    
    brand: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50)
      .optional(),
    
    model: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50)
      .optional(),
    
    year: vine
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .optional(),
    
    color: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(30)
      .optional(),
    
    capacity: vine
      .number()
      .min(0)
      .max(500)
      .optional(),
    
    vehicleType: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(30)
      .optional(),
    
    status: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(30)
      .optional()
  })
)