import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeDelete } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from '#models/core/plan'
import TouristActivity from '#models/tourism/tourist_activity'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

export default class PlanActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'plan_id' })
  declare planId: number

  @column({ columnName: 'activity_id' })
  declare activityId: number

  // Specific attributes of PlanActivity
  @column({ columnName: 'order' })
  declare order: number

  // Relation N to 1 with Plan
  @belongsTo(() => Plan, {
    foreignKey: 'planId',
  })
  declare plan: BelongsTo<typeof Plan>

  // Relation N to 1 with Activity
  @belongsTo(() => TouristActivity, {
    foreignKey: 'activityId',
  })
  declare activity: BelongsTo<typeof TouristActivity>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Notifica cuando se elimina una actividad de un plan (cancelación)
   */
  @beforeDelete()
  static async notifyActivityRemoval(planActivity: PlanActivity) {
    console.log(
      `🗑️ Eliminando actividad ${planActivity.activityId} del plan ${planActivity.planId}`
    )

    // Cargar relaciones necesarias
    await planActivity.load('activity')
    await planActivity.load('plan', (query) => {
      query.preload('tripPlans', (tripPlanQuery) => {
        tripPlanQuery.preload('trip')
      })
    })

    const activity = planActivity.activity
    const plan = planActivity.plan

    // Notificar para cada viaje activo que usa este plan
    if (plan.tripPlans) {
      for (const tripPlan of plan.tripPlans) {
        if (tripPlan.trip) {
          const trip = tripPlan.trip

          // Solo notificar si el viaje está activo o publicado
          if (['active', 'published'].includes(trip.status)) {
            const affectedClients = await getAffectedClientsFromTrip(trip.id)

            console.log(`❌ Notificando cancelación de actividad: ${activity.name}`)
            console.log(`   Viaje: ${trip.name}`)
            console.log(`   Clientes afectados: ${affectedClients.length}`)

            await notificationService.notifyActivityCancelled({
              activityId: activity.id,
              activityName: activity.name,
              reason: 'Actividad eliminada del plan',
              tripId: trip.id,
              tripName: trip.name,
              affectedClients,
            })
          }
        }
      }
    }
  }
}
