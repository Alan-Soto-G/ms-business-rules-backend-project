import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100),
    emergencyContactName: vine.string().trim().minLength(3).maxLength(100).optional(),
    emergencyContactPhone: vine.string().trim().minLength(7).maxLength(20).optional(),
    allergies: vine.string().trim().optional(),
    loyaltyPoints: vine.number().min(0).withoutDecimals().optional(),
    isVip: vine.boolean().optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1).maxLength(100).optional(),
    emergencyContactName: vine.string().trim().minLength(3).maxLength(100).optional(),
    emergencyContactPhone: vine.string().trim().minLength(7).maxLength(20).optional(),
    allergies: vine.string().trim().optional(),
    loyaltyPoints: vine.number().min(0).withoutDecimals().optional(),
    isVip: vine.boolean().optional(),
  })
)
