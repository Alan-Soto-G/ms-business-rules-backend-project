import vine from '@vinejs/vine'

export const createHotelAdminValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100),
    isVerified: vine.boolean().optional(),
  })
)

export const updateHotelAdminValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100).optional(),
    isVerified: vine.boolean().optional(),
  })
)
