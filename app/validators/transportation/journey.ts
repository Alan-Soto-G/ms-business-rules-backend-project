import vine from '@vinejs/vine'

/**
 * Validator for creating a journey.
 * A journey represents a connection between two municipalities (origin and destination).
 */
export const createJourneyValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().positive().withoutDecimals(),
    destinationMunicipalityId: vine.number().positive().withoutDecimals(),
    distance: vine.number().min(0).max(50000).optional(),
  })
)

/**
 * Validator for updating a journey.
 * All fields are optional for partial updates.
 */
export const updateJourneyValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().positive().withoutDecimals().optional(),
    destinationMunicipalityId: vine.number().positive().withoutDecimals().optional(),
    distance: vine.number().min(0).max(50000).optional(),
  })
)

/**
 * Validator for assigning journeys (can be used for multiple assignments).
 */
export const assignJourneyValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().positive().withoutDecimals(),
    destinationMunicipalityId: vine.number().positive().withoutDecimals(),
    distance: vine.number().min(0).max(50000).optional(),
  })
)
