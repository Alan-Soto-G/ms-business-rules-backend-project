import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

/**
 * Validator for creating a transportation service.
 * A transportation service represents the assignment of a vehicle to a journey
 * with specific dates and cost.
 */
export const createTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value)),
    endDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value)),
    cost: vine.number().min(0).max(999999999).decimal([0, 2]),
  })
)

/**
 * Validator for updating a transportation service.
 * All fields are optional for partial updates.
 */
export const updateTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals().optional(),
    vehicleId: vine.number().positive().withoutDecimals().optional(),
    startDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value))
      .optional(),
    endDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value))
      .optional(),
    cost: vine.number().min(0).max(999999999).decimal([0, 2]).optional(),
  })
)

/**
 * Validator for assigning a transportation service.
 * Used to assign a vehicle to a journey with service details.
 */
export const assignTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value)),
    endDate: vine
      .string()
      .transform((value) => DateTime.fromISO(value)),
    cost: vine.number().min(0).max(999999999).decimal([0, 2]),
  })
)