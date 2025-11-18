import vine from '@vinejs/vine'

/**
 * Validator for creating a transport itinerary.
 * A transport itinerary represents a connection between a journey and a trip (N:N pivot).
 */
export const createTransportItineraryValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    tripId: vine.number().positive().withoutDecimals(),
    transportationServiceId: vine.number().positive().withoutDecimals(),
    order: vine.number().min(1).withoutDecimals(),
  })
)

/**
 * Validator for updating a transport itinerary.
 * All fields are optional for partial updates.
 */
export const updateTransportItineraryValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals().optional(),
    tripId: vine.number().positive().withoutDecimals().optional(),
    transportationServiceId: vine.number().positive().withoutDecimals().optional(),
    order: vine.number().min(1).withoutDecimals().optional(),
  })
)

/**
 * Validator for assigning transport itineraries (can be used for multiple assignments).
 */
export const assignTransportItineraryValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    tripId: vine.number().positive().withoutDecimals(),
    transportationServiceId: vine.number().positive().withoutDecimals(),
    order: vine.number().min(1).withoutDecimals(),
  })
)
