import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import env from '#start/env'
export default class Security {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    console.log(theRequest)
    if (theRequest.headers.authorization) {
      let token = theRequest.headers.authorization.replace('Bearer ', '')
      let thePermission: object = {
        url: theRequest.url,
        method: theRequest.method,
      }
      try {
        const result = await axios.post(
          `${env.get('MS_SECURITY')}/api/public/security/permissions-validation`,
          thePermission,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log('La respuesta de ms-security >' + result.data + '<')
        if (result.data === true) {
          console.log(result.data)
          await next()
        } else {
          console.log('no puede ingresar')
          return response.status(401)
        }
      } catch (error) {
        console.error(error)
        return response.status(401)
      }
    } else {
      return response.status(401)
    }
  }
}
