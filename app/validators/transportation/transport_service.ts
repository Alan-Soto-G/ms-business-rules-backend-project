import vine from '@vinejs/vine'

/**
 * Validator for creating a transportation service.
 * A transportation service represents a connection between a journey and a vehicle (N:N pivot).
 */
export const createTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine.date(),
    endDate: vine.date(),
    cost: vine.number().positive().min(0),
  })
)

/**
 * Validator for updating a transportation service.
 * All fields are optional for partial updates.
 */
export const updateTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals().optional(),
    vehicleId: vine.number().positive().withoutDecimals().optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    cost: vine.number().positive().min(0).optional(),
  })
)

/**
 * Validator for assigning transportation services (can be used for multiple assignments).
 */
export const assignTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine.date(),
    endDate: vine.date(),
    cost: vine.number().positive().min(0),
  })
)
