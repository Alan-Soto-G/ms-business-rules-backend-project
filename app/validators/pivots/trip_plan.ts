import vine from '@vinejs/vine'

/**
 * Validator for creating a trip plan
 */
export const createTripPlanValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    plan_id: vine.number().withoutDecimals().positive(),
  })
)

/**
 * Validator for updating a trip plan
 */
export const updateTripPlanValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive().optional(),
    plan_id: vine.number().withoutDecimals().positive().optional(),
  })
)

/**
 * Validator for assigning a plan to a trip
 */
export const assignTripPlanValidator = vine.compile(
  vine.object({
    trip_id: vine.number().withoutDecimals().positive(),
    plan_id: vine.number().withoutDecimals().positive(),
  })
)
