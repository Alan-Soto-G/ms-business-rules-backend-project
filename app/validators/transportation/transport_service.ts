import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

/**
 * Validator for creating a transportation service.
 * A transportation service represents a connection between a journey and a vehicle (N:N pivot).
 */
export const createTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    cost: vine.number().positive().min(0),
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
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    endDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    cost: vine.number().positive().min(0).optional(),
  })
)

/**
 * Validator for assigning transportation services (can be used for multiple assignments).
 */
export const assignTransportationServiceValidator = vine.compile(
  vine.object({
    journeyId: vine.number().positive().withoutDecimals(),
    vehicleId: vine.number().positive().withoutDecimals(),
    startDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    endDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    cost: vine.number().positive().min(0),
  })
)