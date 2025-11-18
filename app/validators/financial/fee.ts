// app/validators/fee.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createFeeValidator = vine.compile(
  vine.object({
    tripId: vine.number().positive().withoutDecimals(),
    amount: vine.number().positive().decimal([0, 2]),
    description: vine.string().trim().minLength(3).maxLength(255),
    dueDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    status: vine.enum(['pending', 'paid', 'overdue', 'cancelled', 'refunded']).optional(),
  })
)

export const updateFeeValidator = vine.compile(
  vine.object({
    tripId: vine.number().positive().withoutDecimals().optional(),
    amount: vine.number().positive().decimal([0, 2]).optional(),
    description: vine.string().trim().minLength(3).maxLength(255).optional(),
    dueDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    status: vine.enum(['pending', 'paid', 'overdue', 'cancelled', 'refunded']).optional(),
  })
)
