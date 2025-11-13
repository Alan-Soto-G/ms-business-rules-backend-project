// ============================================
// VALIDADOR: app/validators/invoice.ts
// ============================================
import vine from '@vinejs/vine'

/**
 * Validator para crear un Invoice (Factura)
 */
export const createInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(255),
    totalAmount: vine.number().min(0),
    issueDate: vine.string(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    paymentDate: vine.string().optional(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    paymentMethod: vine.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other']),
  })
)

/**
 * Validator para actualizar un Invoice (Factura)
 */
export const updateInvoiceValidator = vine.compile(
  vine.object({
    feeId: vine.number().positive().optional(),
    invoiceNumber: vine.string().trim().minLength(3).maxLength(255).optional(),
    totalAmount: vine.number().min(0).optional(),
    issueDate: vine.string().optional(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    paymentDate: vine.string().optional(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    paymentMethod: vine.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other']).optional(),
  })
)