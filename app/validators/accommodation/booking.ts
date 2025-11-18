import vine from '@vinejs/vine'

/**
 * Validator for creating a booking
 */
export const createBookingValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    room_id: vine.number().withoutDecimals().positive(),
  })
)

/**
 * Validator for updating a booking
 */
export const updateBookingValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive().optional(),
    room_id: vine.number().withoutDecimals().positive().optional(),
  })
)

/**
 * Validator for assigning a room to a trip
 */
export const assignBookingValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    room_id: vine.number().withoutDecimals().positive(),
  })
)
