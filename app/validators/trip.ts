import vine from '@vinejs/vine'
import { DateTime } from 'luxon'


/**
 * Validator para crear un Trip (Viaje)
 */
export const createTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(500).optional(),
    destination: vine.string().trim().minLength(3).maxLength(255),
    startDate: vine.string().optional(), // 🚀 enviar como string ISO
    endDate: vine.string().optional(),   // 🚀 enviar como string ISO
    price: vine.number().min(0),
    capacity: vine.number().min(0),
    availableSeats: vine.number().min(0),
    status: vine.enum(['active', 'inactive']),
  })
)

/**
 * Validator para actualizar un Trip (Viaje)
 */
export const updateTripValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    destination: vine.string().trim().minLength(3).maxLength(255).optional(),
    startDate: vine.string().optional(), // 🚀 enviar como string ISO
    endDate: vine.string().optional(), 
    price: vine.number().min(0).optional(),
    capacity: vine.number().min(0).optional(),
    availableSeats: vine.number().min(0).optional(),
    status: vine.enum(['active', 'inactive']).optional(),
  })
)
