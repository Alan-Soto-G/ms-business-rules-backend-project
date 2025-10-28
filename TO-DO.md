*📋 TO-DO: Reparto de responsabilidades — CRUDs, Validadores y Migraciones![](Aspose.Words.ca80d513-ce50-4217-a675-a629fa8b9f33.001.png)**

**Proyecto:** Sistema turístico — Reparto de CRUDs entre 3 personas

**Instrucciones:**

- Cada persona realizará sus **migraciones**, **CRUDs (frontend + backend)** y **validadores** de las entidades asignadas.
- En cada tarea hay dos campos de tiempo: **Tiempo estimado** (lo que se piensa que tardará) y **Tiempo real** (para rellenar al terminar).![ref1]

**📌 Resumen rápido![](Aspose.Words.ca80d513-ce50-4217-a675-a629fa8b9f33.003.png)**

|Persona|Módulo|Entidades|Est. (h)|Real (h)|
| - | - | - | :- | :- |
|**Alan**|Transporte y logística|GPS, Itinerario, Aeronave, Aerolínea, Municipio, Guía, Actividad Turística|**33**|—|
|**Manuel**|Hospedaje y administración|Administrador, Hotel, Habitación, Carro, Plan, Cliente|**30**|—|
|**Lubier**|Viajes y pagos|Viaje, Cuota, Factura, Tarjeta Bancaria, **Clases abstractas: Usuario, Vehículo**|**28**|—|
|**Total**|||**91**|—|

👉 Estos tiempos son sugeridos para planificar. Modifícalos según la complejidad real de tu app.![](Aspose.Words.ca80d513-ce50-4217-a675-a629fa8b9f33.004.png)![](Aspose.Words.ca80d513-ce50-4217-a675-a629fa8b9f33.005.png)

---

### 🧑💻 Alan — Persona 1 (Transporte y logística)
**Responsabilidad general:** Migraciones + Backend CRUD + Validadores + Frontend CRUD para las entidades listadas.

1. **GPS** — ⏱️ 3 h
2. **Itinerario** — ⏱️ 6 h
3. **Aeronave** — ⏱️ 5 h
4. **Aerolínea** — ⏱️ 4 h
5. **Municipio** — ⏱️ 5 h
6. **Guía** — ⏱️ 4 h
7. **Actividad Turística** — ⏱️ 6 h

**Total estimado Alan: 33 h**

---

### 🧑💼 Manuel — Persona 2 (Hospedaje y administración)
**Responsabilidad general:** Migraciones + Backend CRUD + Frontend CRUDs y Validadores.

1. **Administrador** — ⏱️ 4 h
2. **Hotel** — ⏱️ 6 h
3. **Habitación** — ⏱️ 4 h
4. **Carro** — ⏱️ 5 h
5. **Plan** — ⏱️ 5 h
6. **Cliente** — ⏱️ 6 h

**Total estimado Manuel: 30 h**

---

### 🧑🔧 Lubier — Persona 3 (Viajes y pagos)
**Responsabilidad general:** Migraciones + Backend + Frontend CRUDs y Validadores.

1. **Viaje** — ⏱️ 8 h
2. **Cuota** — ⏱️ 4 h
3. **Factura** — ⏱️ 5 h
4. **Tarjeta Bancaria** — ⏱️ 5 h
5. **Clase abstracta Usuario** — ⏱️ 3 h
  - Implementar la estructura base de la jerarquía de usuarios (Administrador, Guía, Cliente).
  - Asegurar correcta herencia, propiedades comunes y compatibilidad con autenticación.
6. **Clase abstracta Vehículo** — ⏱️ 3 h
  - Diseñar estructura base para tipos de vehículos (Carro, Aeronave, etc.).
  - Definir métodos y atributos genéricos comunes a todos los vehículos.

**Total estimado Lubier: 28 h**

---

### ✅ Checkpoints y flujo recomendado
1. Cada entidad debe tener su **branch** en Git: `feature/{persona}/{entidad}`
2. Hacer PRs pequeños por entidad (1 entidad = 1 PR si es posible).
3. Incluir tests unitarios básicos para validadores y endpoints principales.
4. Revisiones cruzadas: al menos 1 compañero revisa el PR antes de merge.
5. Integrar documentación mínima en README o Swagger/OpenAPI.

---

### 🧾 Suma final
- **Total estimado (horas): 91 h**
- **Total real (horas):** — (sumar cuando se complete cada tarea)
