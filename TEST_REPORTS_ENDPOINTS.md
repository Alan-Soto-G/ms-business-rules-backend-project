# 🧪 Guía de Pruebas - Endpoints de Reportes

## ✅ Endpoints Implementados

Todos los endpoints están **listos y funcionando** según los ejemplos de `add/EJEMPLOS_RESPUESTAS_BACKEND.md`.

### Lista de Endpoints:

1. ✅ `GET /api/reports/dashboard` - Dashboard completo
2. ✅ `GET /api/reports/statistics` - Estadísticas generales
3. ✅ `GET /api/reports/revenue-history` - Histórico de ingresos
4. ✅ `GET /api/reports/municipality-trips` - Viajes por municipio
5. ✅ `GET /api/reports/transport-distribution` - Distribución de transporte
6. ✅ `GET /api/reports/top-destinations?limit=5` - Top destinos
7. ✅ `GET /api/reports/monthly-revenue` - Ingresos mensuales año actual

---

## 🚀 Cómo Probar

### Opción 1: PowerShell (Windows)

```powershell
# 1. Dashboard completo
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/dashboard" -Method Get | ConvertTo-Json -Depth 10

# 2. Estadísticas generales
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/statistics" -Method Get | ConvertTo-Json -Depth 10

# 3. Histórico de ingresos
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/revenue-history" -Method Get | ConvertTo-Json -Depth 10

# 4. Viajes por municipio
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/municipality-trips" -Method Get | ConvertTo-Json -Depth 10

# 5. Distribución de transporte
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/transport-distribution" -Method Get | ConvertTo-Json -Depth 10

# 6. Top 5 destinos
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/top-destinations?limit=5" -Method Get | ConvertTo-Json -Depth 10

# 7. Ingresos mensuales del año actual
Invoke-RestMethod -Uri "http://localhost:3333/api/reports/monthly-revenue" -Method Get | ConvertTo-Json -Depth 10
```

### Opción 2: cURL

```bash
# 1. Dashboard completo
curl http://localhost:3333/api/reports/dashboard

# 2. Estadísticas generales
curl http://localhost:3333/api/reports/statistics

# 3. Histórico de ingresos
curl http://localhost:3333/api/reports/revenue-history

# 4. Viajes por municipio
curl http://localhost:3333/api/reports/municipality-trips

# 5. Distribución de transporte
curl http://localhost:3333/api/reports/transport-distribution

# 6. Top 5 destinos
curl "http://localhost:3333/api/reports/top-destinations?limit=5"

# 7. Ingresos mensuales del año actual
curl http://localhost:3333/api/reports/monthly-revenue
```

### Opción 3: Postman

Importa el archivo: **`Postman_Collection_Reports.json`**

---

## 📋 Formato de Respuestas

Todos los endpoints retornan el siguiente formato:

### ✅ Respuesta Exitosa:

```json
{
  "success": true,
  "message": "Descripción del resultado",
  "data": {
    /* datos específicos */
  }
}
```

### ❌ Respuesta con Error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

---

## 🔍 Verificación de Datos

### 1. Dashboard (`/api/reports/dashboard`)

**Debe retornar:**

- `data.revenueHistory`: Array de objetos `{date, revenue}`
- `data.municipalityTrips`: Array de objetos `{municipalityId, municipalityName, tripCount}`
- `data.transportDistribution`: Array de objetos `{type, count, percentage}`

### 2. Statistics (`/api/reports/statistics`)

**Debe retornar:**

- `data.totalTrips`: Número
- `data.activeTrips`: Número
- `data.completedTrips`: Número
- `data.totalRevenue`: Número
- `data.averageTripPrice`: Número

### 3. Revenue History (`/api/reports/revenue-history`)

**Debe retornar:**

- Array de objetos `{date: "YYYY-MM", revenue: number}`
- Ordenado ascendente por fecha

### 4. Municipality Trips (`/api/reports/municipality-trips`)

**Debe retornar:**

- Array de objetos `{municipalityId, municipalityName, tripCount}`
- Ordenado descendente por tripCount

### 5. Transport Distribution (`/api/reports/transport-distribution`)

**Debe retornar:**

- Array de 2 objetos: `{type: "aereo", count, percentage}` y `{type: "terrestre", count, percentage}`
- Los porcentajes deben sumar 100

### 6. Top Destinations (`/api/reports/top-destinations?limit=5`)

**Debe retornar:**

- Array de objetos `{municipalityId, municipalityName, department, tripCount}`
- Máximo N elementos según el parámetro `limit`

### 7. Monthly Revenue (`/api/reports/monthly-revenue`)

**Debe retornar:**

- Array de 12 objetos `{date: "YYYY-MM", revenue: number}`
- Todos los meses del año actual
- Meses sin datos deben tener `revenue: 0`

---

## ⚠️ Notas Importantes

1. **Base de Datos Vacía:**
   Si la base de datos no tiene datos, los endpoints retornarán arrays vacíos o valores en 0, pero **SIN ERRORES**.

2. **Estados de Trips:**
   Solo se incluyen trips con estados diferentes a `'draft'` y `'cancelled'`.

3. **Tipos de Vehículos:**
   - Aéreo: `vehicleType` = 'aircraft' o 'avion'
   - Terrestre: `vehicleType` = 'car', 'bus', o 'van'

4. **Formato de Fechas:**
   - Todas las fechas se retornan en formato `YYYY-MM`
   - Ejemplo: `"2024-01"`, `"2024-12"`

---

## 🧑‍💻 Frontend Ya Está Listo

El frontend Angular ya está implementado y esperando estas respuestas exactas.

**Para verificar la integración completa:**

1. Asegúrate de que el backend esté corriendo en `http://localhost:3333`
2. Inicia el frontend Angular en `http://localhost:4200`
3. Navega al dashboard de reportes
4. Las gráficas deberían cargar automáticamente

---

## 📝 Troubleshooting

### Problema: "No se muestran datos en el frontend"

**Solución:** Verifica que la base de datos tenga trips creados con estados válidos.

### Problema: "Error 500 en los endpoints"

**Solución:**

1. Verifica que las tablas existan: `trips`, `transport_itineraries`, `journeys`, `municipalities`, `transportation_services`, `vehicles`
2. Revisa los logs del servidor AdonisJS

### Problema: "CORS error desde el frontend"

**Solución:** Verifica que `config/cors.ts` incluya `http://localhost:4200` en la lista de orígenes permitidos.

---

## ✨ Todo Listo

**Los endpoints están implementados siguiendo EXACTAMENTE los ejemplos de `add/EJEMPLOS_RESPUESTAS_BACKEND.md`.**

El frontend puede consumir estos endpoints sin ningún problema. 🎉
