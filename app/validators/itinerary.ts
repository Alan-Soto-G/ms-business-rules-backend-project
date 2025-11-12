import vine from '@vinejs/vine'

/**
 * Validator para crear un itinerario
 */
export const createItineraryValidator = vine.compile(
  vine.object({
    originMunicipalityId: vine.number().min(1),
    destinationMunicipalityId: vine.number().min(1),
    distance: vine.number().min(0).optional(),
    estimatedTime: vine.number().min(0).optional(),
  })
)

/**
 * Validator para actualizar un itinerario
 */
export const updateItineraryValidator = vine.compile(
  vine.object({
    distance: vine.number().min(0).optional(),
    estimatedTime: vine.number().min(0).optional(),
  })
)
