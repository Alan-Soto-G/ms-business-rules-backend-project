// app/validators/user.ts
import vine from '@vinejs/vine'

/**
 * Validator para crear un nuevo usuario
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    
    fullName: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(100),
    
    userType: vine
      .enum(['guide', 'client', 'admin'])
  })
)

/**
 * Validator para actualizar un usuario existente
 */
export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .where('email', value)
          .whereNot('id', field.meta.userId)
          .first()
        return !user
      })
      .optional(),
    
    fullName: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(100)
      .optional(),
    
    userType: vine
      .enum(['guide', 'client', 'admin'])
      .optional()
  })
)