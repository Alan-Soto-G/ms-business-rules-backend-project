// app/validators/invoice.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive().withoutDecimals(),
    bankCardId: vine.number().positive().withoutDecimals().nullable().optional(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(50),
    totalAmount: vine.number().positive().decimal([0, 2]),
    issueDate: vine.date().transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    paymentDate: vine
      .date()
      .nullable()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    paymentMethod: vine
      .enum(['credit_card', 'debit_card', 'cash', 'bank_transfer', 'paypal', 'other'])
      .optional(),
  })
)

export const updateInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive().withoutDecimals().optional(),
    bankCardId: vine.number().positive().withoutDecimals().nullable().optional(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(50).optional(),
    totalAmount: vine.number().positive().decimal([0, 2]).optional(),
    issueDate: vine
      .date()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value))
      .optional(),
    paymentDate: vine
      .date()
      .nullable()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : value)),
    paymentMethod: vine
      .enum(['credit_card', 'debit_card', 'cash', 'bank_transfer', 'paypal', 'other'])
      .optional(),
  })
)
