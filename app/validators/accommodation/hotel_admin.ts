import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createHotelAdminValidator = vine.compile(
  vine.object({
    // User fields
    idCard: vine.string().trim().minLength(5).maxLength(20),
    email: vine.string().trim().email().normalizeEmail(),
    fullName: vine.string().trim().minLength(3).maxLength(255),
    phone: vine.string().trim().optional(),
    birthDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    address: vine.string().trim().optional(),

    // HotelAdmin specific fields
    isVerified: vine.boolean().optional(),
  })
)

export const updateHotelAdminValidator = vine.compile(
  vine.object({
    // User fields
    idCard: vine.string().trim().minLength(5).maxLength(20).optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
    fullName: vine.string().trim().minLength(3).maxLength(255).optional(),
    phone: vine.string().trim().optional(),
    birthDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    address: vine.string().trim().optional(),

    // HotelAdmin specific fields
    isVerified: vine.boolean().optional(),
  })
)
