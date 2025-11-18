// app/validators/trip.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

/**
 * Validator para crear un Trip (Viaje)
 */
export const createTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150),
    description: vine.string().trim().optional(),
    destination: vine.string().trim().minLength(3).maxLength(150),
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    price: vine.number().positive().decimal([0, 2]),
    capacity: vine.number().positive().withoutDecimals().min(1).max(500),
    availableSeats: vine.number().min(0).withoutDecimals(),
    status: vine
      .enum(['draft', 'published', 'active', 'full', 'completed', 'cancelled'])
      .optional(),
  })
)

/**
 * Validator para actualizar un Trip (Viaje)
 */
export const updateTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150).optional(),
    description: vine.string().trim().optional(),
    destination: vine.string().trim().minLength(3).maxLength(150).optional(),
    startDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    endDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    price: vine.number().positive().decimal([0, 2]).optional(),
    capacity: vine.number().positive().withoutDecimals().min(1).max(500).optional(),
    availableSeats: vine.number().min(0).withoutDecimals().optional(),
    status: vine
      .enum(['draft', 'published', 'active', 'full', 'completed', 'cancelled'])
      .optional(),
  })
)
