import vine from '@vinejs/vine'

/**
 * Validator para crear un itinerario
 */
export const createItineraryValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().min(1),
    destinationMunicipalityId: vine.number().min(1),
    distance: vine.number().min(0).optional(),
    vehicleId: vine.number().min(1),
    tripId: vine.number().min(1),
  })
)

/**
 * Validator para actualizar un itinerario
 */
export const updateItineraryValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().min(1).optional(),
    destinationMunicipalityId: vine.number().min(1).optional(),
    distance: vine.number().min(0).optional(),
    vehicleId: vine.number().min(1).optional(),
    tripId: vine.number().min(1).optional(),
  })
)
