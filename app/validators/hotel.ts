import vine from '@vinejs/vine'

export const createHotelValidator = vine.compile(
  vine.object({
    hotelAdminId: vine.number().positive(),
    name: vine.string().trim().minLength(3).maxLength(255),
    address: vine.string().trim().minLength(10).maxLength(500),
    phone: vine.string().trim().minLength(7).maxLength(20),
    email: vine.string().trim().email().normalizeEmail(),
    starRating: vine.number().min(0).max(5).optional(),
    status: vine.enum(['active', 'inactive']).optional(),
  })
)

export const updateHotelValidator = vine.compile(
  vine.object({
    hotelAdminId: vine.number().positive().optional(),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    address: vine.string().trim().minLength(10).maxLength(500).optional(),
    phone: vine.string().trim().minLength(7).maxLength(20).optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
    starRating: vine.number().min(0).max(5).optional(),
    status: vine.enum(['active', 'inactive']).optional(),
  })
)
