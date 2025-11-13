import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    // Referencia al usuario del MS de seguridad
    user_id: vine.number().positive(),

    // Client specific fields
    emergencyContactName: vine.string().trim().optional(),
    emergencyContactPhone: vine.string().trim().optional(),
    allergies: vine.string().trim().optional(),
    loyaltyPoints: vine.number().min(0).optional(),
    isVip: vine.boolean().optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    // Client specific fields
    emergencyContactName: vine.string().trim().optional(),
    emergencyContactPhone: vine.string().trim().optional(),
    allergies: vine.string().trim().optional(),
    loyaltyPoints: vine.number().min(0).optional(),
    isVip: vine.boolean().optional(),
  })
)
