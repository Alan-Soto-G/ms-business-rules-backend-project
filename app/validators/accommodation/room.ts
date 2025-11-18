import vine from '@vinejs/vine'

export const createRoomValidator = vine.compile(
  vine.object({
    hotelId: vine.number().positive().withoutDecimals(),
    roomNumber: vine.string().trim().minLength(1).maxLength(20),
    roomType: vine.string().trim().minLength(3).maxLength(50),
    capacity: vine.number().positive().withoutDecimals().min(1).max(20),
    pricePerNight: vine.number().positive().decimal([0, 2]),
    status: vine.enum(['available', 'occupied', 'maintenance', 'cleaning']).optional(),
  })
)

export const updateRoomValidator = vine.compile(
  vine.object({
    hotelId: vine.number().positive().withoutDecimals().optional(),
    roomNumber: vine.string().trim().minLength(1).maxLength(20).optional(),
    roomType: vine.string().trim().minLength(3).maxLength(50).optional(),
    capacity: vine.number().positive().withoutDecimals().min(1).max(20).optional(),
    pricePerNight: vine.number().positive().decimal([0, 2]).optional(),
    status: vine.enum(['available', 'occupied', 'maintenance', 'cleaning']).optional(),
  })
)
