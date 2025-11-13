import vine from '@vinejs/vine'

export const createHotelAdminValidator = vine.compile(
  vine.object({
    // Referencia al usuario del MS de seguridad
    user_id: vine.number().positive(),

    // HotelAdmin specific fields
    isVerified: vine.boolean().optional(),
  })
)

export const updateHotelAdminValidator = vine.compile(
  vine.object({
    // HotelAdmin specific fields
    isVerified: vine.boolean().optional(),
  })
)
