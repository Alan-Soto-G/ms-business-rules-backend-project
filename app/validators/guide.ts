import vine from '@vinejs/vine'

export const createGuideValidator = vine.compile(
  vine.object({
    // Referencia al usuario del MS de seguridad
    user_id: vine.number().positive(),

    // Guide specific fields
    licenseNumber: vine.string().trim().minLength(3).maxLength(50),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).optional(),
    isAvailable: vine.boolean().optional(),
  })
)

export const updateGuideValidator = vine.compile(
  vine.object({
    // Guide specific fields
    licenseNumber: vine.string().trim().minLength(3).maxLength(50).optional(),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).optional(),
    isAvailable: vine.boolean().optional(),
  })
)
