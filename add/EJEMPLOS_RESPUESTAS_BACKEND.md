# 📡 Ejemplos de Respuestas del Backend - Dashboard de Reportes

Este archivo contiene ejemplos de las respuestas que el backend debe retornar para que el dashboard funcione correctamente.

---

## 1. Dashboard Completo

**Endpoint:** `GET /api/reports/dashboard`

**Descripción:** Retorna todos los datos del dashboard en una sola petición (RECOMENDADO para mejor performance).

### Request:
```http
GET http://localhost:3333/api/reports/dashboard
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "revenueHistory": [
      {
        "date": "2024-01",
        "revenue": 15000000
      },
      {
        "date": "2024-02",
        "revenue": 18500000
      },
      {
        "date": "2024-03",
        "revenue": 22000000
      },
      {
        "date": "2024-04",
        "revenue": 19500000
      },
      {
        "date": "2024-05",
        "revenue": 25000000
      },
      {
        "date": "2024-06",
        "revenue": 28000000
      }
    ],
    "municipalityTrips": [
      {
        "municipalityId": 1,
        "municipalityName": "Cartagena",
        "tripCount": 25
      },
      {
        "municipalityId": 2,
        "municipalityName": "Santa Marta",
        "tripCount": 18
      },
      {
        "municipalityId": 3,
        "municipalityName": "San Andrés",
        "tripCount": 15
      },
      {
        "municipalityId": 4,
        "municipalityName": "Barranquilla",
        "tripCount": 10
      }
    ],
    "transportDistribution": [
      {
        "type": "aereo",
        "count": 45,
        "percentage": 65.22
      },
      {
        "type": "terrestre",
        "count": 24,
        "percentage": 34.78
      }
    ]
  }
}
```

---

## 2. Estadísticas Generales

**Endpoint:** `GET /api/reports/statistics`

**Descripción:** Retorna los KPIs principales del sistema.

### Request:
```http
GET http://localhost:3333/api/reports/statistics
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalTrips": 68,
    "activeTrips": 12,
    "completedTrips": 45,
    "totalRevenue": 156000000,
    "averageTripPrice": 2294117.65
  }
}
```

### Explicación de campos:
- `totalTrips`: Total de viajes registrados en el sistema
- `activeTrips`: Viajes en curso (estado: "activo" o "en progreso")
- `completedTrips`: Viajes finalizados (estado: "completado")
- `totalRevenue`: Suma de ingresos de todos los viajes completados
- `averageTripPrice`: Promedio del costo de los viajes (totalRevenue / totalTrips)

---

## 3. Histórico de Ingresos

**Endpoint:** `GET /api/reports/revenue-history`

**Descripción:** Retorna el histórico de ingresos agrupados por mes.

### Request:
```http
GET http://localhost:3333/api/reports/revenue-history
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Revenue history retrieved successfully",
  "data": [
    {
      "date": "2024-01",
      "revenue": 15000000
    },
    {
      "date": "2024-02",
      "revenue": 18500000
    },
    {
      "date": "2024-03",
      "revenue": 22000000
    },
    {
      "date": "2024-04",
      "revenue": 19500000
    },
    {
      "date": "2024-05",
      "revenue": 25000000
    },
    {
      "date": "2024-06",
      "revenue": 28000000
    },
    {
      "date": "2024-07",
      "revenue": 30000000
    },
    {
      "date": "2024-08",
      "revenue": 27500000
    },
    {
      "date": "2024-09",
      "revenue": 32000000
    },
    {
      "date": "2024-10",
      "revenue": 35000000
    },
    {
      "date": "2024-11",
      "revenue": 38000000
    },
    {
      "date": "2024-12",
      "revenue": 40000000
    }
  ]
}
```

### Notas:
- `date`: Formato YYYY-MM (año-mes)
- `revenue`: Ingresos en pesos colombianos (número entero)
- Ordenar por fecha ascendente (más antiguo primero)

---

## 4. Viajes por Municipio

**Endpoint:** `GET /api/reports/municipality-trips`

**Descripción:** Retorna la cantidad de viajes por cada municipio destino.

### Request:
```http
GET http://localhost:3333/api/reports/municipality-trips
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Municipality trips retrieved successfully",
  "data": [
    {
      "municipalityId": 1,
      "municipalityName": "Cartagena",
      "tripCount": 25
    },
    {
      "municipalityId": 2,
      "municipalityName": "Santa Marta",
      "tripCount": 18
    },
    {
      "municipalityId": 3,
      "municipalityName": "San Andrés",
      "tripCount": 15
    },
    {
      "municipalityId": 4,
      "municipalityName": "Barranquilla",
      "tripCount": 10
    },
    {
      "municipalityId": 5,
      "municipalityName": "Medellín",
      "tripCount": 8
    },
    {
      "municipalityId": 6,
      "municipalityName": "Bogotá",
      "tripCount": 6
    }
  ]
}
```

### Notas:
- `municipalityId`: ID del municipio en la base de datos
- `municipalityName`: Nombre del municipio
- `tripCount`: Cantidad de viajes a ese municipio
- Ordenar por tripCount descendente (más viajes primero)
- Limitar a top 10 municipios (opcional)

---

## 5. Distribución de Transporte

**Endpoint:** `GET /api/reports/transport-distribution`

**Descripción:** Retorna el porcentaje de uso de transporte aéreo vs terrestre.

### Request:
```http
GET http://localhost:3333/api/reports/transport-distribution
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Transport distribution retrieved successfully",
  "data": [
    {
      "type": "aereo",
      "count": 45,
      "percentage": 65.22
    },
    {
      "type": "terrestre",
      "count": 24,
      "percentage": 34.78
    }
  ]
}
```

### Notas:
- `type`: "aereo" o "terrestre" (exactamente con estos valores)
- `count`: Cantidad de viajes con ese tipo de transporte
- `percentage`: Porcentaje sobre el total (debe sumar 100)

### Cálculo:
```javascript
const total = aereo.count + terrestre.count;
aereo.percentage = (aereo.count / total) * 100;
terrestre.percentage = (terrestre.count / total) * 100;
```

---

## 6. Top Destinos (Opcional)

**Endpoint:** `GET /api/reports/top-destinations?limit=5`

**Descripción:** Retorna los N destinos más visitados.

### Request:
```http
GET http://localhost:3333/api/reports/top-destinations?limit=5
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Top destinations retrieved successfully",
  "data": [
    {
      "municipalityId": 1,
      "municipalityName": "Cartagena",
      "tripCount": 25
    },
    {
      "municipalityId": 2,
      "municipalityName": "Santa Marta",
      "tripCount": 18
    },
    {
      "municipalityId": 3,
      "municipalityName": "San Andrés",
      "tripCount": 15
    },
    {
      "municipalityId": 4,
      "municipalityName": "Barranquilla",
      "tripCount": 10
    },
    {
      "municipalityId": 5,
      "municipalityName": "Medellín",
      "tripCount": 8
    }
  ]
}
```

### Query Parameters:
- `limit` (opcional): Cantidad de destinos a retornar (default: 5)

---

## 7. Ingresos Mensuales del Año Actual (Opcional)

**Endpoint:** `GET /api/reports/monthly-revenue`

**Descripción:** Retorna los ingresos de cada mes del año actual.

### Request:
```http
GET http://localhost:3333/api/reports/monthly-revenue
Content-Type: application/json
Authorization: Bearer {token}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Monthly revenue retrieved successfully",
  "data": [
    {
      "date": "2024-01",
      "revenue": 15000000
    },
    {
      "date": "2024-02",
      "revenue": 18500000
    },
    {
      "date": "2024-03",
      "revenue": 22000000
    },
    {
      "date": "2024-04",
      "revenue": 19500000
    },
    {
      "date": "2024-05",
      "revenue": 25000000
    },
    {
      "date": "2024-06",
      "revenue": 28000000
    },
    {
      "date": "2024-07",
      "revenue": 0
    },
    {
      "date": "2024-08",
      "revenue": 0
    },
    {
      "date": "2024-09",
      "revenue": 0
    },
    {
      "date": "2024-10",
      "revenue": 0
    },
    {
      "date": "2024-11",
      "revenue": 0
    },
    {
      "date": "2024-12",
      "revenue": 0
    }
  ]
}
```

### Notas:
- Siempre retornar 12 meses (enero a diciembre)
- Si un mes no tiene datos, retornar revenue: 0
- Año dinámico (año actual)

---

## ❌ Manejo de Errores

### Error 401 - No autenticado:
```json
{
  "success": false,
  "message": "Unauthorized. Please login.",
  "data": null
}
```

### Error 403 - Sin permisos:
```json
{
  "success": false,
  "message": "Forbidden. You don't have permission to access this resource.",
  "data": null
}
```

### Error 500 - Error del servidor:
```json
{
  "success": false,
  "message": "Internal server error. Please try again later.",
  "data": null
}
```

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: cURL
```bash
curl -X GET http://localhost:3333/api/reports/dashboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Opción 2: Postman
1. Crear request GET
2. URL: `http://localhost:3333/api/reports/dashboard`
3. Headers:
   - Content-Type: application/json
   - Authorization: Bearer {token}
4. Send

### Opción 3: Thunder Client (VS Code)
1. Nueva request
2. GET `http://localhost:3333/api/reports/dashboard`
3. Auth → Bearer Token
4. Send

---

## 💡 Tips para Implementar en AdonisJS

### 1. Crear el controlador:
```bash
node ace make:controller ReportsController
```

### 2. Estructura del controlador:
```typescript
// app/Controllers/Http/ReportsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ReportsController {
  public async dashboard({ response }: HttpContextContract) {
    try {
      const revenueHistory = await this.getRevenueHistory()
      const municipalityTrips = await this.getMunicipalityTrips()
      const transportDistribution = await this.getTransportDistribution()

      return response.ok({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: {
          revenueHistory,
          municipalityTrips,
          transportDistribution
        }
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving dashboard data',
        data: null
      })
    }
  }

  public async statistics({ response }: HttpContextContract) {
    try {
      const totalTrips = await Database.from('trips').count('* as total')
      const activeTrips = await Database.from('trips')
        .where('status', 'active')
        .count('* as total')
      const completedTrips = await Database.from('trips')
        .where('status', 'completed')
        .count('* as total')
      const totalRevenue = await Database.from('trips')
        .where('status', 'completed')
        .sum('price as total')
      
      const total = totalTrips[0].total
      const revenue = totalRevenue[0].total || 0
      const averageTripPrice = total > 0 ? revenue / total : 0

      return response.ok({
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          totalTrips: total,
          activeTrips: activeTrips[0].total,
          completedTrips: completedTrips[0].total,
          totalRevenue: revenue,
          averageTripPrice: averageTripPrice
        }
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving statistics',
        data: null
      })
    }
  }

  // Métodos privados para cada tipo de reporte...
}
```

### 3. Agregar rutas:
```typescript
// start/routes.ts

Route.group(() => {
  Route.get('/dashboard', 'ReportsController.dashboard')
  Route.get('/statistics', 'ReportsController.statistics')
  Route.get('/revenue-history', 'ReportsController.revenueHistory')
  Route.get('/municipality-trips', 'ReportsController.municipalityTrips')
  Route.get('/transport-distribution', 'ReportsController.transportDistribution')
}).prefix('/api/reports').middleware(['auth'])
```

---

**Fecha:** Diciembre 2025  
**Versión:** 1.0  
**Estado:** Documentación completa para implementación backend

