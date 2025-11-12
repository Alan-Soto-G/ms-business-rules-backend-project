// app/validators/trip.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

/**
 * Validator para crear un Trip (Viaje)
 */
export const createTripValidator = vine.compile(
  vine.object({
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    destination: vine.string().trim().minLength(3).maxLength(255),
  })
)

/**
 * Validator para actualizar un Trip (Viaje)
 */
export const updateTripValidator = vine.compile(
  vine.object({
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)).optional(),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)).optional(),
    destination: vine.string().trim().minLength(3).maxLength(255).optional(),
  })
)