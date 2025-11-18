import vine from '@vinejs/vine'

/**
 * Validator for creating a guide activity
 */
export const createGuideActivityValidator = vine.compile(
  vine.object({
    guide_id: vine.number().withoutDecimals().positive(),
    activity_id: vine.number().withoutDecimals().positive(),
    assignment_date: vine.date().optional(),
  })
)

/**
 * Validator for updating a guide activity
 */
export const updateGuideActivityValidator = vine.compile(
  vine.object({
    guide_id: vine.number().withoutDecimals().positive().optional(),
    activity_id: vine.number().withoutDecimals().positive().optional(),
    assignment_date: vine.date().optional(),
  })
)

/**
 * Validator for assigning a guide to an activity
 */
export const assignGuideActivityValidator = vine.compile(
  vine.object({
    guide_id: vine.number().withoutDecimals().positive(),
    activity_id: vine.number().withoutDecimals().positive(),
    assignment_date: vine.date().optional(),
  })
)
