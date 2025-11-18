import vine from '@vinejs/vine'

export const createHotelValidator = vine.compile(
  vine.object({
    hotelAdminId: vine.number().positive().withoutDecimals(),
    municipalityId: vine.number().positive().withoutDecimals(),
    name: vine.string().trim().minLength(3).maxLength(150),
    address: vine.string().trim().minLength(10),
    phone: vine.string().trim().minLength(7).maxLength(20),
    email: vine.string().trim().email().maxLength(100),
    starRating: vine.number().min(0).max(5).withoutDecimals().optional(),
    status: vine.enum(['active', 'inactive', 'under_renovation']).optional(),
  })
)

export const updateHotelValidator = vine.compile(
  vine.object({
    hotelAdminId: vine.number().positive().withoutDecimals().optional(),
    municipalityId: vine.number().positive().withoutDecimals().optional(),
    name: vine.string().trim().minLength(3).maxLength(150).optional(),
    address: vine.string().trim().minLength(10).optional(),
    phone: vine.string().trim().minLength(7).maxLength(20).optional(),
    email: vine.string().trim().email().maxLength(100).optional(),
    starRating: vine.number().min(0).max(5).withoutDecimals().optional(),
    status: vine.enum(['active', 'inactive', 'under_renovation']).optional(),
  })
)
