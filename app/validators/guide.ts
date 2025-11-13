import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createGuideValidator = vine.compile(
  vine.object({
    // User fields
    idCard: vine.string().trim().minLength(5).maxLength(20),
    email: vine.string().trim().email().normalizeEmail(),
    fullName: vine.string().trim().minLength(3).maxLength(255),
    phone: vine.string().trim().optional(),
    birthDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)).optional(),
    address: vine.string().trim().optional(),

    // Guide specific fields
    licenseNumber: vine.string().trim().minLength(3).maxLength(50),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).optional(),
    isAvailable: vine.boolean().optional(),
  })
)

export const updateGuideValidator = vine.compile(
  vine.object({
    // User fields
    idCard: vine.string().trim().minLength(5).maxLength(20).optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
    fullName: vine.string().trim().minLength(3).maxLength(255).optional(),
    phone: vine.string().trim().optional(),
    birthDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)).optional(),
    address: vine.string().trim().optional(),

    // Guide specific fields
    licenseNumber: vine.string().trim().minLength(3).maxLength(50).optional(),
    specialties: vine.string().trim().optional(),
    rating: vine.number().min(0).max(5).optional(),
    isAvailable: vine.boolean().optional(),
  })
)
