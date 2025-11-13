import vine from '@vinejs/vine'

/**
 * Validador para crear un turno
 */
export const createShiftValidator = vine.compile(
  vine.object({
    driver_id: vine.number().positive(),
    vehicle_id: vine.number().positive(),
    start_date: vine.date(),
    end_date: vine.date().afterField('start_date'),
  })
)

/**
 * Validador para actualizar un turno
 */
export const updateShiftValidator = vine.compile(
  vine.object({
    driver_id: vine.number().positive().optional(),
    vehicle_id: vine.number().positive().optional(),
    start_date: vine.date().optional(),
    end_date: vine.date().optional(),
  })
)
