import vine from '@vinejs/vine'

export const createGuideValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100),
    licenseNumber: vine.string().trim().minLength(3).maxLength(50),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).decimal([0, 2]).optional(),
    isAvailable: vine.boolean().optional(),
  })
)

export const updateGuideValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100).optional(),
    licenseNumber: vine.string().trim().minLength(3).maxLength(50).optional(),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).decimal([0, 2]).optional(),
    isAvailable: vine.boolean().optional(),
  })
)
