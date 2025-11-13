// ============================================
// VALIDADOR: app/validators/fee.ts
// ============================================
import vine from '@vinejs/vine'

/**
 * Validator para crear un Fee (Tarifa/Cuota)
 */
export const createFeeValidator = vine.compile(
  vine.object({
    tripId: vine.number().positive(),
    amount: vine.number().min(0),
    description: vine.string().trim().maxLength(500).optional(),
    dueDate: vine.string(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    status: vine.enum(['pending', 'paid', 'overdue']),
  })
)

/**
 * Validator para actualizar un Fee (Tarifa/Cuota)
 */
export const updateFeeValidator = vine.compile(
  vine.object({
    tripId: vine.number().positive().optional(),
    amount: vine.number().min(0).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    dueDate: vine.string().optional(), // 🚀 enviar como string ISO (YYYY-MM-DD)
    status: vine.enum(['pending', 'paid', 'overdue']).optional(),
  })
)