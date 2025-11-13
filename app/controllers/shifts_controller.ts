import type { HttpContext } from '@adonisjs/core/http'
import Shift from '#models/shift'
import Driver from '#models/driver'
import Vehicle from '#models/vehicle'
import { createShiftValidator, updateShiftValidator } from '#validators/shift'
import { DateTime } from 'luxon'

export default class ShiftsController {
  /**
   * Obtener todos los turnos o uno por ID
   */
  public async findShift({ response, request, params }: HttpContext) {
    if (params.id) {
      const shift = await Shift.query()
        .where('id', params.id)
        .preload('driver')
        .preload('vehicle')
        .firstOrFail()
      return response.status(200).json(shift)
    } else {
      const dataShifts = request.all()
      if ('page' in dataShifts && 'per_page' in dataShifts) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const shifts = await Shift.query()
          .preload('driver')
          .preload('vehicle')
          .paginate(page, perPage)
        return response.status(200).json(shifts)
      }

      const allShifts = await Shift.query().preload('driver').preload('vehicle')
      return response.status(200).json(allShifts)
    }
  }

  /**
   * Obtener turnos activos (donde la fecha actual esté entre start_date y end_date)
   */
  public async getActiveShifts({ response }: HttpContext) {
    const today = DateTime.now().toISODate()

    const activeShifts = await Shift.query()
      .where('start_date', '<=', today!)
      .where('end_date', '>=', today!)
      .preload('driver')
      .preload('vehicle')

    return response.status(200).json(activeShifts)
  }

  /**
   * Crear un nuevo turno
   */
  public async createShift({ request, response }: HttpContext) {
    const data = await request.validateUsing(createShiftValidator)

    // Verificar que el conductor existe
    const driver = await Driver.find(data.driver_id)
    if (!driver) {
      return response.status(404).json({
        message: 'Conductor no encontrado',
      })
    }

    // Verificar que el vehículo existe
    const vehicle = await Vehicle.find(data.vehicle_id)
    if (!vehicle) {
      return response.status(404).json({
        message: 'Vehículo no encontrado',
      })
    }

    // Verificar que no haya conflictos de turnos para el mismo conductor
    const conflictingShift = await Shift.query()
      .where('driver_id', data.driver_id)
      .where((query) => {
        query
          .whereBetween('start_date', [data.start_date, data.end_date])
          .orWhereBetween('end_date', [data.start_date, data.end_date])
          .orWhere((subQuery) => {
            subQuery
              .where('start_date', '<=', data.start_date)
              .where('end_date', '>=', data.end_date)
          })
      })
      .first()

    if (conflictingShift) {
      return response.status(400).json({
        message: 'El conductor ya tiene un turno asignado en ese rango de fechas',
      })
    }

    const shift = await Shift.create({
      driverId: data.driver_id,
      vehicleId: data.vehicle_id,
      startDate: DateTime.fromJSDate(data.start_date),
      endDate: DateTime.fromJSDate(data.end_date),
    })

    await shift.load('driver')
    await shift.load('vehicle')

    return response.status(201).json(shift)
  }

  /**
   * Actualizar un turno
   */
  public async updateShift({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Shift ID not provided' })
    }

    const data = await request.validateUsing(updateShiftValidator)
    const shift = await Shift.findOrFail(params.id)

    if (data.driver_id !== undefined) {
      const driver = await Driver.find(data.driver_id)
      if (!driver) {
        return response.status(404).json({
          message: 'Conductor no encontrado',
        })
      }
      shift.driverId = data.driver_id
    }

    if (data.vehicle_id !== undefined) {
      const vehicle = await Vehicle.find(data.vehicle_id)
      if (!vehicle) {
        return response.status(404).json({
          message: 'Vehículo no encontrado',
        })
      }
      shift.vehicleId = data.vehicle_id
    }

    if (data.start_date !== undefined) {
      shift.startDate = DateTime.fromJSDate(data.start_date)
    }

    if (data.end_date !== undefined) {
      shift.endDate = DateTime.fromJSDate(data.end_date)
    }

    await shift.save()
    await shift.load('driver')
    await shift.load('vehicle')

    return response.status(200).json(shift)
  }

  /**
   * Eliminar un turno
   */
  public async deleteShift({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Shift ID not provided' })
    }

    const shift = await Shift.findOrFail(params.id)
    await shift.delete()

    return response.status(204).json({})
  }
}
