import vine from '@vinejs/vine'

/**
 * Validator for creating a trip client
 */
export const createTripClientValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    client_id: vine.number().withoutDecimals().positive(),
  })
)

/**
 * Validator for updating a trip client
 */
export const updateTripClientValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive().optional(),
    client_id: vine.number().withoutDecimals().positive().optional(),
  })
)

/**
 * Validator for assigning a client to a trip
 */
export const assignTripClientValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    client_id: vine.number().withoutDecimals().positive(),
  })
)
