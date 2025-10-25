import vine from '@vinejs/vine'

/**
 * Validator para crear una nueva aerolínea
 * Valida todos los campos requeridos y opcionales
 */
export const createAirlineValidator = vine.compile(
  vine.object({
    // Campos obligatorios
    name: vine.string().minLength(3).maxLength(255).trim(),
    codeIata: vine.string().minLength(2).maxLength(2).trim().toUpperCase(),
    codeIcao: vine.string().minLength(3).maxLength(3).trim().toUpperCase(),
    countryOfOrigin: vine.string().minLength(2).maxLength(100).trim(),

    // Campos opcionales - General
    foundingYear: vine.number().min(1900).max(2100).optional(),
    isActive: vine.boolean().optional(),

    // Campos opcionales - Contacto
    address: vine.string().maxLength(500).trim().optional(),
    phone: vine.string().maxLength(50).trim().optional(),
    email: vine.string().email().maxLength(255).trim().optional(),
    website: vine.string().url().maxLength(255).trim().optional(),
    headquarterCity: vine.string().maxLength(100).trim().optional(),
    ceo: vine.string().maxLength(100).trim().optional(),

    // Campos opcionales - Operaciones
    aircraftCount: vine.number().min(0).optional(),
    aircraftModels: vine.array(vine.string()).optional(),
    numberDestinations: vine.number().min(0).optional(),
    mainHubs: vine.array(vine.string()).optional(),
    alliance: vine.string().maxLength(100).trim().optional(),
    frequentFlyerProgram: vine.string().maxLength(100).trim().optional(),

    // Campos opcionales - Servicio/Reputación
    onTimePerformance: vine.number().min(0).max(100).decimal([0, 2]).optional(),
    serviceRating: vine.number().min(0).max(5).decimal([0, 1]).optional(),
  })
)

/**
 * Validator para actualizar una aerolínea existente
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export const updateAirlineValidator = vine.compile(
  vine.object({
    // Campos obligatorios (pero opcionales en update para permitir actualizaciones parciales)
    name: vine.string().minLength(3).maxLength(255).trim().optional(),
    codeIata: vine.string().minLength(2).maxLength(2).trim().toUpperCase().optional(),
    codeIcao: vine.string().minLength(3).maxLength(3).trim().toUpperCase().optional(),
    countryOfOrigin: vine.string().minLength(2).maxLength(100).trim().optional(),

    // Campos opcionales - General
    foundingYear: vine.number().min(1900).max(2100).optional(),
    isActive: vine.boolean().optional(),

    // Campos opcionales - Contacto
    address: vine.string().maxLength(500).trim().optional(),
    phone: vine.string().maxLength(50).trim().optional(),
    email: vine.string().email().maxLength(255).trim().optional(),
    website: vine.string().url().maxLength(255).trim().optional(),
    headquarterCity: vine.string().maxLength(100).trim().optional(),
    ceo: vine.string().maxLength(100).trim().optional(),

    // Campos opcionales - Operaciones
    aircraftCount: vine.number().min(0).optional(),
    aircraftModels: vine.array(vine.string()).optional(),
    numberDestinations: vine.number().min(0).optional(),
    mainHubs: vine.array(vine.string()).optional(),
    alliance: vine.string().maxLength(100).trim().optional(),
    frequentFlyerProgram: vine.string().maxLength(100).trim().optional(),

    // Campos opcionales - Servicio/Reputación
    onTimePerformance: vine.number().min(0).max(100).decimal([0, 2]).optional(),
    serviceRating: vine.number().min(0).max(5).decimal([0, 1]).optional(),
  })
)
