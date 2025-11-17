// app/validators/trip.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

/**
 * Validator para crear un Trip (Viaje)
 */
export const createTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(1000),
    destination: vine.string().trim().minLength(3).maxLength(255),
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    price: vine.number().min(0),
    capacity: vine.number().min(1),
    availableSeats: vine.number().min(0),
    status: vine.enum(['active', 'cancelled', 'completed', 'pending']),
  })
)

/**
 * Validator para actualizar un Trip (Viaje)
 */
export const updateTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().minLength(3).maxLength(1000).optional(),
    destination: vine.string().trim().minLength(3).maxLength(255).optional(),
    startDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    endDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    price: vine.number().min(0).optional(),
    capacity: vine.number().min(1).optional(),
    availableSeats: vine.number().min(0).optional(),
    status: vine.enum(['active', 'cancelled', 'completed', 'pending']).optional(),
  })
)
