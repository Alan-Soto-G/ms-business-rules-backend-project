// ============================================
// VALIDADOR: app/validators/bank_card.ts
// ============================================
import vine from '@vinejs/vine'

/**
 * Validator para crear un BankCard (Tarjeta Bancaria)
 * ⚠️ IMPORTANTE: Información sensible - manejar con cuidado
 */
export const createBankCardValidator = vine.compile(
  vine.object({
    clientId: vine.number().positive(),
    cardNumber: vine.string().trim().minLength(13).maxLength(19), // Tarjetas típicamente 13-19 dígitos
    cvv: vine.string().trim().minLength(3).maxLength(4), // CVV de 3 o 4 dígitos
    expirationDate: vine.string(), // 🚀 enviar como string ISO (YYYY-MM-DD) o formato MM/YY
    cardHolderName: vine.string().trim().minLength(3).maxLength(255),
  })
)

/**
 * Validator para actualizar un BankCard (Tarjeta Bancaria)
 */
export const updateBankCardValidator = vine.compile(
  vine.object({
    clientId: vine.number().positive().optional(),
    cardNumber: vine.string().trim().minLength(13).maxLength(19).optional(),
    cvv: vine.string().trim().minLength(3).maxLength(4).optional(),
    expirationDate: vine.string().optional(),
    cardHolderName: vine.string().trim().minLength(3).maxLength(255).optional(),
  })
)