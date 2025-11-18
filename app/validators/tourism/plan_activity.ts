import vine from '@vinejs/vine'

/**
 * Validator for creating a plan activity
 */
export const createPlanActivityValidator = vine.compile(
  vine.object({
    plan_id: vine.number().withoutDecimals().positive(),
    activity_id: vine.number().withoutDecimals().positive(),
    order: vine.number().withoutDecimals().positive().optional(),
  })
)

/**
 * Validator for updating a plan activity
 */
export const updatePlanActivityValidator = vine.compile(
  vine.object({
    plan_id: vine.number().withoutDecimals().positive().optional(),
    activity_id: vine.number().withoutDecimals().positive().optional(),
    order: vine.number().withoutDecimals().positive().optional(),
  })
)

/**
 * Validator for assigning an activity to a plan
 */
export const assignPlanActivityValidator = vine.compile(
  vine.object({
    plan_id: vine.number().withoutDecimals().positive(),
    activity_id: vine.number().withoutDecimals().positive(),
    order: vine.number().withoutDecimals().positive().optional(),
  })
)
