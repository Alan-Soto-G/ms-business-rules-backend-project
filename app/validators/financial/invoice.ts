// app/validators/invoice.ts
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(50),
    totalAmount: vine.number().positive().decimal([0, 2]),
    issueDate: vine.date().transform((value) => DateTime.fromJSDate(value)),
    paymentDate: vine
      .date()
      .nullable()
      .transform(
        (value) => (value ? DateTime.fromJSDate(value) : undefined) as DateTime | undefined
      ),
    paymentMethod: vine.string().trim().minLength(3).maxLength(50),
  })
)

export const updateInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive().optional(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(50).optional(),
    totalAmount: vine.number().positive().decimal([0, 2]).optional(),
    issueDate: vine
      .date()
      .transform((value) => DateTime.fromJSDate(value))
      .optional(),
    paymentDate: vine
      .date()
      .nullable()
      .optional()
      .transform(
        (value) => (value ? DateTime.fromJSDate(value) : undefined) as DateTime | undefined
      ),
    paymentMethod: vine.string().trim().minLength(3).maxLength(50).optional(),
  })
)
