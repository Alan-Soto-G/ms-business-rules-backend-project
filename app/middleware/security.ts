import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import env from '#start/env'

export default class Security {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const theRequest = request.toJSON()
    const { authorization } = theRequest.headers

    console.log('🟡 Middleware Security iniciado')
    console.log('👉 URL de la petición Adonis:', theRequest.url)
    console.log('👉 Método:', theRequest.method)
    console.log('👉 Authorization header:', authorization)
    console.log('👉 MS_SECURITY env var:', env.get('MS_SECURITY'))

    // Si no hay token → corta el flujo
    if (!authorization) {
      console.log('🚫 No se recibió token en el header Authorization')
      return response.status(401).json({ message: 'Unauthorized: Missing token' })
    }

    const token = authorization.replace('Bearer ', '')
    const thePermission = {
      url: theRequest.url,
      method: theRequest.method,
    }

    // 🔍 Antes del try, probamos conexión básica con el microservicio
    try {
      console.log('🧪 Verificando conexión con microservicio...')
      const test = await axios.get(`${env.get('MS_SECURITY')}/actuator/health`, { timeout: 3000 })
      console.log('✅ Microservicio responde al health check:', test.data)
    } catch (err) {
      console.error('❌ No se pudo conectar al microservicio:', err.message)
    }

    try {
      const url = `${env.get('MS_SECURITY')}/api/public/security/permissions-validation`
      console.log('🚀 Llamando al microservicio de seguridad en:', url)

      const result = await axios.post(url, thePermission, {
        headers: { Authorization: `Bearer ${token}` },
        
      })

      console.log('✅ Respuesta del microservicio:', result.data)

      const isValid =
        result.data === true ||
        result.data === 'true' ||
        result.data?.valid === true ||
        result.data?.authorized === true

      if (isValid) {
        console.log('✅ Permiso válido, continuando hacia el controlador...')
        await next()
      } else {
        console.log('🚫 Permiso denegado por el microservicio')
        return response.status(401).json({ message: 'Unauthorized: Insufficient permissions' })
      }
    } catch (error: any) {
      console.error('❌ Error al llamar al microservicio:')
      console.error('  • Mensaje:', error.message)
      console.error('  • Código:', error.code)
      console.error('  • URL:', error.config?.url)
      return response.status(401).json({ message: 'Unauthorized: Error in security validation' })
    }
  }
}
