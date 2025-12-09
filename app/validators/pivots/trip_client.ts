import vine from '@vinejs/vine'

/**
 * Validator for creating a trip client
 */
export const createTripClientValidator = vine.compile(
  vine.object({
    tripId: vine.number().withoutDecimals().positive(),
    clientId: vine.number().withoutDecimals().positive(),
    travelers: vine.number().withoutDecimals().positive().optional(),
    quantity: vine.number().withoutDecimals().positive().optional(),
    installments: vine.number().withoutDecimals().positive().optional(),
    totalAmount: vine.number().positive(),
    totalWithInterest: vine.number().positive().optional(),
    interestRate: vine.number().min(0).optional(),
    paymentStatus: vine.enum(['pending', 'processing', 'partial', 'completed', 'cancelled', 'refunded']).optional(),
    epaycoRef: vine.string().optional(),
  })
)

/**
 * Validator for updating a trip client
 */
export const updateTripClientValidator = vine.compile(
  vine.object({
    tripId: vine.number().withoutDecimals().positive().optional(),
    clientId: vine.number().withoutDecimals().positive().optional(),
    travelers: vine.number().withoutDecimals().positive().optional(),
    quantity: vine.number().withoutDecimals().positive().optional(),
    installments: vine.number().withoutDecimals().positive().optional(),
    totalAmount: vine.number().positive().optional(),
    totalWithInterest: vine.number().positive().optional(),
    interestRate: vine.number().min(0).optional(),
    paymentStatus: vine.enum(['pending', 'processing', 'partial', 'completed', 'cancelled', 'refunded']).optional(),
    epaycoRef: vine.string().optional(),
  })
)

/**
 * Validator for assigning a client to a trip
 */
export const assignTripClientValidator = vine.compile(
  vine.object({
    tripId: vine.number().withoutDecimals().positive(),
    clientId: vine.number().withoutDecimals().positive(),
    travelers: vine.number().withoutDecimals().positive().optional(),
    quantity: vine.number().withoutDecimals().positive().optional(),
    installments: vine.number().withoutDecimals().positive().optional(),
    totalAmount: vine.number().positive(),
    totalWithInterest: vine.number().positive().optional(),
    interestRate: vine.number().min(0).optional(),
    paymentStatus: vine.enum(['pending', 'processing', 'partial', 'completed', 'cancelled', 'refunded']).optional(),
    epaycoRef: vine.string().optional(),
  })
)