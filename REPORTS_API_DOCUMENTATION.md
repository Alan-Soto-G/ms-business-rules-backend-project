# Sistema de Reportes y Dashboard - API Documentation

## 📊 Descripción General

Este módulo proporciona endpoints para obtener datos de reportes y dashboard del sistema de viajes. Los datos están diseñados para ser visualizados mediante gráficas en el frontend.

## 🔗 Base URL

```
http://localhost:3333/api/reports
```

## 📍 Endpoints Disponibles

### 1. Dashboard Completo

**GET** `/api/reports/dashboard`

Obtiene todos los datos del dashboard en una sola llamada (recomendado para cargar el dashboard completo).

**Response:**

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

**Uso para gráficas:**

- `revenueHistory` → **Gráfica de líneas** (eje X: fecha, eje Y: ingresos)
- `municipalityTrips` → **Gráfica de barras** (eje X: municipios, eje Y: cantidad de viajes)
- `transportDistribution` → **Gráfica circular/pie** (porcentajes de transporte aéreo vs terrestre)

---

### 2. Histórico de Ingresos

**GET** `/api/reports/revenue-history`

Obtiene el histórico de dinero recolectado en todos los viajes vendidos, agrupado por mes.

**Response:**

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
    }
  ]
}
```

**Tipo de gráfica recomendada:** Líneas o área

- **Eje X:** Fecha (formato YYYY-MM)
- **Eje Y:** Ingresos en pesos

---

### 3. Viajes por Municipio

**GET** `/api/reports/municipality-trips`

Obtiene la cantidad de viajes que ha recibido cada municipio como destino.

**Response:**

```json
{
  "success": true,
  "message": "Municipality trips count retrieved successfully",
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
      "municipalityName": "Medellín",
      "tripCount": 15
    }
  ]
}
```

**Tipo de gráfica recomendada:** Barras verticales u horizontales

- **Eje X:** Nombre del municipio
- **Eje Y:** Cantidad de viajes

---

### 4. Distribución de Transporte

**GET** `/api/reports/transport-distribution`

Obtiene el porcentaje de veces que se utilizó transporte aéreo vs terrestre.

**Response:**

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

**Tipo de gráfica recomendada:** Circular (Pie chart) o Donut

- **Etiquetas:** Tipo de transporte (Aéreo / Terrestre)
- **Valores:** Porcentajes

---

### 5. Estadísticas Generales

**GET** `/api/reports/statistics`

Obtiene estadísticas generales del sistema (útil para mostrar KPIs en cards).

**Response:**

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

**Uso:** Mostrar en tarjetas (cards) con números grandes y títulos descriptivos.

---

### 6. Top Destinos Populares

**GET** `/api/reports/top-destinations?limit=5`

Obtiene los destinos más populares (por defecto top 5, configurable con query param).

**Query Parameters:**

- `limit` (opcional): Número de destinos a retornar (default: 5)

**Response:**

```json
{
  "success": true,
  "message": "Top destinations retrieved successfully",
  "data": [
    {
      "municipalityId": 1,
      "municipalityName": "Cartagena",
      "department": "Bolívar",
      "tripCount": 25
    },
    {
      "municipalityId": 2,
      "municipalityName": "Santa Marta",
      "department": "Magdalena",
      "tripCount": 18
    }
  ]
}
```

**Tipo de gráfica recomendada:** Barras horizontales con colores degradados

- **Eje X:** Cantidad de viajes
- **Eje Y:** Nombre del municipio

---

### 7. Ingresos Mensuales del Año Actual

**GET** `/api/reports/monthly-revenue`

Obtiene los ingresos mensuales del año en curso (todos los 12 meses, incluso si son 0).

**Response:**

```json
{
  "success": true,
  "message": "Monthly revenue retrieved successfully",
  "data": {
    "year": 2024,
    "data": [
      {
        "month": 1,
        "monthName": "enero",
        "revenue": 15000000
      },
      {
        "month": 2,
        "monthName": "febrero",
        "revenue": 18500000
      },
      {
        "month": 3,
        "monthName": "marzo",
        "revenue": 22000000
      },
      {
        "month": 4,
        "monthName": "abril",
        "revenue": 0
      }
      // ... resto de meses
    ]
  }
}
```

**Tipo de gráfica recomendada:** Barras o líneas

- **Eje X:** Nombre del mes
- **Eje Y:** Ingresos

---

## 🎨 Recomendaciones para el Frontend

### Librerías de Gráficas Recomendadas (Angular)

1. **ng2-charts** (wrapper de Chart.js) - Recomendada ✅
2. **ngx-charts** (basada en D3.js)
3. **Highcharts Angular**
4. **ApexCharts Angular**

### Implementación Sugerida

#### 1. Servicio Angular para Reportes

```typescript
// reports.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'http://localhost:3333/api/reports'

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`)
  }

  getRevenueHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue-history`)
  }

  getMunicipalityTrips(): Observable<any> {
    return this.http.get(`${this.apiUrl}/municipality-trips`)
  }

  getTransportDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transport-distribution`)
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`)
  }

  getTopDestinations(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-destinations?limit=${limit}`)
  }

  getMonthlyRevenue(): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly-revenue`)
  }
}
```

#### 2. Configuración de Gráficas con Chart.js

##### Gráfica de Líneas (Histórico de Ingresos)

```typescript
// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

lineChartData: any;
lineChartOptions: any;

ngOnInit() {
  this.reportsService.getRevenueHistory().subscribe(response => {
    const data = response.data;

    this.lineChartData = {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'Ingresos ($)',
        data: data.map(item => item.revenue),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }]
    };

    this.lineChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Histórico de Ingresos por Mes'
        },
        tooltip: {
          callbacks: {
            label: (context) => `$${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`
          }
        }
      }
    };
  });
}
```

##### Gráfica de Barras (Viajes por Municipio)

```typescript
barChartData: any;
barChartOptions: any;

ngOnInit() {
  this.reportsService.getMunicipalityTrips().subscribe(response => {
    const data = response.data;

    this.barChartData = {
      labels: data.map(item => item.municipalityName),
      datasets: [{
        label: 'Cantidad de Viajes',
        data: data.map(item => item.tripCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Viajes por Municipio'
        }
      }
    };
  });
}
```

##### Gráfica Circular (Distribución de Transporte)

```typescript
pieChartData: any;
pieChartOptions: any;

ngOnInit() {
  this.reportsService.getTransportDistribution().subscribe(response => {
    const data = response.data;

    this.pieChartData = {
      labels: data.map(item =>
        item.type === 'aereo' ? 'Transporte Aéreo' : 'Transporte Terrestre'
      ),
      datasets: [{
        data: data.map(item => item.percentage),
        backgroundColor: ['#2196F3', '#FF9800']
      }]
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribución de Tipo de Transporte'
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`
          }
        }
      }
    };
  });
}
```

#### 3. Template HTML Sugerido

```html
<!-- dashboard.component.html -->
<div class="dashboard-container">
  <h1>Dashboard de Reportes</h1>

  <!-- KPIs Cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Total Viajes</h3>
      <p class="stat-number">{{ statistics?.totalTrips }}</p>
    </div>
    <div class="stat-card">
      <h3>Viajes Activos</h3>
      <p class="stat-number">{{ statistics?.activeTrips }}</p>
    </div>
    <div class="stat-card">
      <h3>Ingresos Totales</h3>
      <p class="stat-number">${{ statistics?.totalRevenue | number }}</p>
    </div>
    <div class="stat-card">
      <h3>Precio Promedio</h3>
      <p class="stat-number">${{ statistics?.averageTripPrice | number }}</p>
    </div>
  </div>

  <!-- Charts -->
  <div class="charts-grid">
    <div class="chart-card">
      <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" type="line"> </canvas>
    </div>

    <div class="chart-card">
      <canvas baseChart [data]="barChartData" [options]="barChartOptions" type="bar"> </canvas>
    </div>

    <div class="chart-card">
      <canvas baseChart [data]="pieChartData" [options]="pieChartOptions" type="pie"> </canvas>
    </div>
  </div>
</div>
```

---

## 🧪 Ejemplos de Prueba (cURL)

### Dashboard completo

```bash
curl -X GET http://localhost:3333/api/reports/dashboard
```

### Histórico de ingresos

```bash
curl -X GET http://localhost:3333/api/reports/revenue-history
```

### Viajes por municipio

```bash
curl -X GET http://localhost:3333/api/reports/municipality-trips
```

### Distribución de transporte

```bash
curl -X GET http://localhost:3333/api/reports/transport-distribution
```

### Estadísticas generales

```bash
curl -X GET http://localhost:3333/api/reports/statistics
```

### Top 10 destinos

```bash
curl -X GET "http://localhost:3333/api/reports/top-destinations?limit=10"
```

---

## 📝 Notas Importantes

1. **Seguridad**: Los endpoints actualmente no tienen middleware de seguridad activado. Cuando se active el middleware de seguridad, será necesario incluir el token JWT en los headers.

2. **CORS**: Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde `http://localhost:4200`.

3. **Formato de fechas**: Las fechas en `revenueHistory` están en formato `YYYY-MM`. El frontend puede parsearlas y mostrarlas en el formato deseado.

4. **Moneda**: Todos los valores monetarios están en pesos colombianos (COP). El frontend debe formatearlos apropiadamente con separadores de miles.

5. **Estados de trips**: Los reportes solo incluyen trips con estados que no sean `'draft'` o `'cancelled'` para reflejar datos reales de ventas.

---

## 🔧 Troubleshooting

### Error 500 en endpoints

- Verifica que la base de datos tenga datos en las tablas `trips`, `transport_itineraries`, `journeys`, `municipalities`, `transportation_services`, `vehicles`.
- Revisa los logs del servidor para mensajes de error específicos.

### Datos vacíos

- Es normal si no hay trips creados en la base de datos.
- Crea algunos trips de prueba con diferentes municipios y tipos de transporte.

### CORS errors

- Agrega `http://localhost:4200` a la configuración de CORS en `config/cors.ts` del backend.

---

## 📦 Colección Postman

Se ha creado una colección de Postman con todos los endpoints en el archivo `Postman_Collection_Reports.json`.
