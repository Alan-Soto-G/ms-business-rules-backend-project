# 🎯 PROMPT PARA LA IA DEL FRONTEND

Necesito que implementes un **Dashboard de Reportes** en mi aplicación Angular que consuma datos del backend AdonisJS.

## 📊 Objetivo

Crear una página de dashboard con las siguientes visualizaciones:

### 1. **Gráfica de Líneas** - Histórico de Ingresos

- Endpoint: `GET /api/reports/revenue-history`
- Mostrar evolución de ingresos a lo largo del tiempo (por mes)
- Eje X: fechas en formato YYYY-MM
- Eje Y: ingresos en pesos colombianos

### 2. **Gráfica de Barras** - Viajes por Municipio

- Endpoint: `GET /api/reports/municipality-trips`
- Mostrar cantidad de viajes que ha recibido cada municipio
- Eje X: nombres de municipios
- Eje Y: cantidad de viajes

### 3. **Gráfica Circular (Pie Chart)** - Distribución de Transporte

- Endpoint: `GET /api/reports/transport-distribution`
- Mostrar porcentaje de uso de transporte aéreo vs terrestre
- Dos segmentos: "Transporte Aéreo" y "Transporte Terrestre"

### 4. **Cards de Estadísticas (KPIs)**

- Endpoint: `GET /api/reports/statistics`
- Mostrar 4-5 cards con:
  - Total de viajes
  - Viajes activos
  - Viajes completados
  - Ingresos totales (formateados con separadores de miles)
  - Precio promedio por viaje

---

## 🔧 Requerimientos Técnicos

### 1. Variables de Entorno (IMPORTANTE ⚠️)

**NO uses URLs hardcodeadas.** Crea archivos de entorno:

**`src/environments/environment.ts`:**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333', // MS Negocio (Backend AdonisJS)
}
```

**`src/environments/environment.prod.ts`:**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio.com', // URL de producción
}
```

### 2. Servicio Angular

Crea un servicio `ReportsService` que **use la variable de entorno**:

```typescript
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/api/reports`

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`)
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`)
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
}
```

### 3. Librería de Gráficas

Usa `ng2-charts` (Chart.js):

```bash
npm install ng2-charts chart.js
```

Importa en `app.module.ts` o en standalone component:

```typescript
import { NgChartsModule } from 'ng2-charts'
```

### 4. Componente Dashboard

Crea un componente `DashboardComponent` que:

- Llame al servicio al inicializar
- Configure las gráficas con los datos recibidos
- Muestre las estadísticas en cards
- Use layout responsive (grid o flexbox)

---

## 📡 Estructura de Datos de los Endpoints

### Endpoint Principal: `GET /api/reports/dashboard`

Retorna todos los datos del dashboard en una sola llamada:

```typescript
{
  success: boolean
  message: string
  data: {
    revenueHistory: Array<{
      date: string // "2024-01", "2024-02", etc.
      revenue: number // 15000000, 18500000, etc.
    }>
    municipalityTrips: Array<{
      municipalityId: number
      municipalityName: string // "Cartagena", "Santa Marta", etc.
      tripCount: number // 25, 18, 15, etc.
    }>
    transportDistribution: Array<{
      type: 'aereo' | 'terrestre'
      count: number
      percentage: number // 65.22, 34.78, etc.
    }>
  }
}
```

### Endpoint de Estadísticas: `GET /api/reports/statistics`

```typescript
{
  success: boolean
  message: string
  data: {
    totalTrips: number // 68
    activeTrips: number // 12
    completedTrips: number // 45
    totalRevenue: number // 156000000
    averageTripPrice: number // 2294117.65
  }
}
```

### Endpoints Individuales (opcionales)

Si prefieres cargar los datos por separado:

- `GET /api/reports/revenue-history` → Solo histórico de ingresos
- `GET /api/reports/municipality-trips` → Solo viajes por municipio
- `GET /api/reports/transport-distribution` → Solo distribución de transporte
- `GET /api/reports/top-destinations?limit=5` → Top N destinos (configurable)
- `GET /api/reports/monthly-revenue` → Ingresos mensuales del año actual

---

## 🎨 Diseño y Estilo

### Paleta de Colores

- **Gráfica de líneas:** Verde (#4CAF50) con área sombreada
- **Gráfica de barras:** Colores variados (#FF6384, #36A2EB, #FFCE56, #4BC0C0, #9966FF)
- **Gráfica circular:** Azul (#2196F3) para aéreo, Naranja (#FF9800) para terrestre

### Layout Sugerido

```
┌─────────────────────────────────────────────────────┐
│          DASHBOARD DE REPORTES Y ANÁLISIS          │
├──────────┬──────────┬──────────┬──────────────────┐
│ Total    │ Viajes   │ Viajes   │ Ingresos        │
│ Viajes   │ Activos  │ Completos│ Totales         │
│   68     │   12     │   45     │ $156,000,000    │
└──────────┴──────────┴──────────┴──────────────────┘
┌───────────────────────────┬─────────────────────────┐
│   HISTÓRICO DE INGRESOS   │  TRANSPORTE AÉREO VS   │
│   (Gráfica de Líneas)     │  TERRESTRE (Pie Chart) │
│   [Chart.js Line Chart]   │  [Chart.js Pie Chart]  │
└───────────────────────────┴─────────────────────────┘
┌───────────────────────────────────────────────────┐
│      VIAJES POR MUNICIPIO (Gráfica de Barras)    │
│          [Chart.js Bar Chart]                     │
└───────────────────────────────────────────────────┘
```

### Formato de Datos

- **Moneda:** `{{ revenue | currency:'COP':'symbol-narrow':'1.0-0' }}`
- **Números:** `{{ count | number:'1.0-0' }}`
- **Fechas:** Parsea "YYYY-MM" y muestra como "Ene 2024", "Feb 2024"

---

## 💡 Ejemplo de Implementación

### Component TypeScript

```typescript
export class DashboardComponent implements OnInit {
  statistics: any
  lineChartData: any
  barChartData: any
  pieChartData: any
  loading = true
  error: string | null = null

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadDashboardData()
  }

  loadDashboardData() {
    forkJoin({
      dashboard: this.reportsService.getDashboard(),
      statistics: this.reportsService.getStatistics(),
    }).subscribe({
      next: (response) => {
        this.statistics = response.statistics.data
        this.setupCharts(response.dashboard.data)
        this.loading = false
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del dashboard'
        this.loading = false
        console.error(err)
      },
    })
  }

  setupCharts(data: any) {
    // Gráfica de líneas
    this.lineChartData = {
      labels: data.revenueHistory.map((item) => this.formatDate(item.date)),
      datasets: [
        {
          label: 'Ingresos ($)',
          data: data.revenueHistory.map((item) => item.revenue),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }

    // Gráfica de barras
    this.barChartData = {
      labels: data.municipalityTrips.map((item) => item.municipalityName),
      datasets: [
        {
          label: 'Cantidad de Viajes',
          data: data.municipalityTrips.map((item) => item.tripCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    }

    // Gráfica circular
    this.pieChartData = {
      labels: ['Transporte Aéreo', 'Transporte Terrestre'],
      datasets: [
        {
          data: data.transportDistribution.map((item) => item.percentage),
          backgroundColor: ['#2196F3', '#FF9800'],
        },
      ],
    }
  }

  formatDate(dateStr: string): string {
    const [year, month] = dateStr.split('-')
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ]
    return `${months[parseInt(month) - 1]} ${year}`
  }
}
```

### Template HTML

```html
<div class="dashboard-container">
  <h1>Dashboard de Reportes</h1>

  <!-- Loading & Error States -->
  <div *ngIf="loading" class="loading">Cargando datos...</div>
  <div *ngIf="error" class="error">{{ error }}</div>

  <div *ngIf="!loading && !error">
    <!-- KPIs Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Viajes</h3>
        <p class="stat-number">{{ statistics?.totalTrips | number }}</p>
      </div>
      <div class="stat-card">
        <h3>Viajes Activos</h3>
        <p class="stat-number">{{ statistics?.activeTrips | number }}</p>
      </div>
      <div class="stat-card">
        <h3>Ingresos Totales</h3>
        <p class="stat-number">
          {{ statistics?.totalRevenue | currency:'COP':'symbol-narrow':'1.0-0' }}
        </p>
      </div>
      <div class="stat-card">
        <h3>Precio Promedio</h3>
        <p class="stat-number">
          {{ statistics?.averageTripPrice | currency:'COP':'symbol-narrow':'1.0-0' }}
        </p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="chart-card">
        <h2>Histórico de Ingresos</h2>
        <canvas baseChart [data]="lineChartData" type="line"></canvas>
      </div>

      <div class="chart-card">
        <h2>Distribución de Transporte</h2>
        <canvas baseChart [data]="pieChartData" type="pie"></canvas>
      </div>

      <div class="chart-card full-width">
        <h2>Viajes por Municipio</h2>
        <canvas baseChart [data]="barChartData" type="bar"></canvas>
      </div>
    </div>
  </div>
</div>
```

### CSS Responsive

```css
.dashboard-container {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-card.full-width {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-card.full-width {
    grid-column: span 1;
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] Configurar `environment.ts` y `environment.prod.ts` con `apiUrl`
- [ ] Instalar `npm install ng2-charts chart.js`
- [ ] Crear servicio `ReportsService` usando `environment.apiUrl`
- [ ] Crear componente `DashboardComponent`
- [ ] Implementar 4 cards de estadísticas (KPIs)
- [ ] Configurar gráfica de líneas (histórico de ingresos)
- [ ] Configurar gráfica de barras (viajes por municipio)
- [ ] Configurar gráfica circular (distribución de transporte)
- [ ] Implementar diseño responsive con CSS Grid
- [ ] Agregar loading state
- [ ] Agregar manejo de errores
- [ ] Formatear valores monetarios y numéricos correctamente

---

## 🧪 Testing

Verifica que el backend esté corriendo:

```bash
curl http://localhost:3333/api/reports/dashboard
```

---

## 📝 Notas Importantes

- **Variables de Entorno:** Usa `environment.apiUrl` - NO hardcodees URLs
- **CORS:** El backend ya está configurado para localhost:4200
- **Autenticación:** Los endpoints actualmente NO requieren autenticación
- **Formato de Moneda:** Los valores están en pesos colombianos (COP)

---

**Por favor genera todo el código necesario: configuración de entornos, servicio, componente TypeScript, template HTML, y estilos CSS. Asegúrate de usar `environment.apiUrl` en el servicio.**
