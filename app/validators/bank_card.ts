// ==========================================
// app/validators/bank_card.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createBankCardValidator = vine.compile(
  vine.object({
    clientId: vine.number().positive(),
    cardNumber: vine.string().trim().minLength(13).maxLength(16).regex(/^\d+$/),
    cvv: vine.string().trim().minLength(3).maxLength(4).regex(/^\d+$/),
    expirationDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    cardHolderName: vine.string().trim().minLength(3).maxLength(255),
  })
)

export const updateBankCardValidator = vine.compile(
  vine.object({
    clientId: vine.number().positive().optional(),
    cardNumber: vine.string().trim().minLength(13).maxLength(16).regex(/^\d+$/).optional(),
    cvv: vine.string().trim().minLength(3).maxLength(4).regex(/^\d+$/).optional(),
    expirationDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    cardHolderName: vine.string().trim().minLength(3).maxLength(255).optional(),
  })
)
