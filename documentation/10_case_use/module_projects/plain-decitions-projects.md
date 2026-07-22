# Plan de Implementación — Módulo Proyectos (SIMONA)

> **Stack:** NestJS · TypeORM · PostgreSQL · DDD  
> **Basado en:** Revisión arquitectónica v1.0 + decisiones confirmadas por el usuario

---

## Decisiones confirmadas (resumen)

| # | Punto | Decisión |
|---|-------|----------|
| 1 | Activity ↔ Indicator | **Opción A** — FKs directas (`objectiveIndicatorId`, `resultIndicatorId`) igual que PE |
| 2 | Entidad `Project` | Campos sugeridos en la revisión arquitectónica |
| 3 | Cardinalidad 1:1 Objetivo↔Resultado | **Opción A** — `UNIQUE` constraint en `projectObjectiveId` de `project_results` |
| 4 | Validación tipo-relación en indicadores | Igual que PE — lógica en capa de servicio |
| 5 | Alineación estratégica | **Tabla separada** `ProjectIndicatorAlignment` (no FK directa en `ProjectIndicator`) |
| 6 | Escalabilidad futura (donantes, presupuestos) | No aplica en esta fase |
| 7 | YearTargets | Misma estructura que PE — rango de años derivado de `Project.startDate/endDate` |
| 8 | Sincronización estratégica | **Opción A** — llamada directa al servicio estratégico en método dedicado |
| 9 | Campos de `Project` | Los propuestos en la revisión |
| 10 | Relación Activity-Indicator | **Opción A** — FKs directas como en PE |

---

## Estructura de carpetas del módulo

```
src/modules/
├── projects/                          ← Entidad raíz + ProjectPrograms
│   ├── entities/
│   │   ├── project.entity.ts
│   │   └── project-program.entity.ts
│   ├── dto/
│   │   ├── create-project.dto.ts
│   │   ├── update-project.dto.ts
│   │   ├── create-project-program.dto.ts
│   │   └── update-project-program.dto.ts
│   ├── projects.module.ts
│   ├── projects.service.ts
│   └── projects.controller.ts
│
├── project-objectives/
│   ├── entities/
│   │   └── project-objective.entity.ts
│   ├── dto/
│   │   ├── create-project-objective.dto.ts
│   │   └── update-project-objective.dto.ts
│   ├── project-objectives.module.ts
│   ├── project-objectives.service.ts
│   └── project-objectives.controller.ts
│
├── project-results/
│   ├── entities/
│   │   └── project-result.entity.ts
│   ├── dto/
│   │   ├── create-project-result.dto.ts
│   │   └── update-project-result.dto.ts
│   ├── project-results.module.ts
│   ├── project-results.service.ts
│   └── project-results.controller.ts
│
├── project-activities/
│   ├── entities/
│   │   └── project-activity.entity.ts
│   ├── dto/
│   │   ├── create-project-activity.dto.ts
│   │   └── update-project-activity.dto.ts
│   ├── project-activities.module.ts
│   ├── project-activities.service.ts
│   └── project-activities.controller.ts
│
└── project-indicators/
    ├── entities/
    │   ├── project-indicator.entity.ts
    │   ├── project-indicator-year-target.entity.ts
    │   ├── project-indicator-progress.entity.ts
    │   └── project-indicator-alignment.entity.ts
    ├── dto/
    │   ├── create-project-indicator.dto.ts
    │   ├── update-project-indicator.dto.ts
    │   ├── create-project-indicator-year-target.dto.ts
    │   ├── create-project-indicator-year-targets.dto.ts
    │   ├── update-project-indicator-year-target.dto.ts
    │   ├── create-project-indicator-progress.dto.ts
    │   ├── create-project-indicator-alignment.dto.ts
    │   └── update-project-indicator-alignment.dto.ts
    ├── project-indicators.module.ts
    ├── project-indicators.service.ts
    └── project-indicators.controller.ts
```

---

## Fase 1 — Entidades

### 1.1 `Project` → tabla `projects`

```
id                  PK serial
organizationId      FK → organizations (NOT NULL, onDelete: RESTRICT)
code                VARCHAR(30) UNIQUE NOT NULL
name                VARCHAR(200) NOT NULL
description         TEXT nullable
startDate           DATE NOT NULL
endDate             DATE NOT NULL
status              ENUM('DRAFT','ACTIVE','SUSPENDED','CLOSED') default DRAFT
active              BOOLEAN default true
createdAt           TIMESTAMP
updatedAt           TIMESTAMP
deletedAt           TIMESTAMP (soft delete)
```

**Índices:**
- `UQ_PROJECT_CODE` UNIQUE en `code`
- `UQ_PROJECT_ORG_PERIOD` UNIQUE en `(organizationId, code)`

---

### 1.2 `ProjectProgram` → tabla `project_programs`

Tabla intermedia M:N entre `Project` y `Program`.

```
projectId           FK → projects (NOT NULL, onDelete: CASCADE)
programId           FK → programs (NOT NULL, onDelete: CASCADE)
createdAt           TIMESTAMP
```

**Restricciones:**
- PK compuesto `(projectId, programId)`
- Esto naturalmente previene duplicados

> No tiene PK surrogate. El PK compuesto es suficiente para esta relación pura.

---

### 1.3 `ProjectObjective` → tabla `project_objectives`

```
id                  PK serial
projectId           FK → projects (NOT NULL, onDelete: CASCADE)
code                VARCHAR(30) NOT NULL
name                VARCHAR(250) NOT NULL
description         TEXT nullable
completionPercentage DECIMAL(5,2) default 0
active              BOOLEAN default true
createdAt           TIMESTAMP
updatedAt           TIMESTAMP
deletedAt           TIMESTAMP
```

**Índices:**
- `UQ_PROJ_OBJECTIVE_CODE` UNIQUE en `(projectId, code)`

---

### 1.4 `ProjectResult` → tabla `project_results`

**Cardinalidad 1:1 con `ProjectObjective` garantizada a nivel de BD.**

```
id                      PK serial
projectObjectiveId      FK → project_objectives (NOT NULL, onDelete: CASCADE)
                        ← UNIQUE constraint aquí garantiza el 1:1
code                    VARCHAR(30) NOT NULL
name                    VARCHAR(250) NOT NULL
description             TEXT nullable
completionPercentage    DECIMAL(5,2) default 0
active                  BOOLEAN default true
createdAt               TIMESTAMP
updatedAt               TIMESTAMP
deletedAt               TIMESTAMP
```

**Restricciones críticas:**
- `UQ_PROJ_RESULT_OBJECTIVE` UNIQUE en `projectObjectiveId` ← garantiza 1:1
- `UQ_PROJ_RESULT_CODE` UNIQUE en `(projectObjectiveId, code)`

---

### 1.5 `ProjectActivity` → tabla `project_activities`

Mismo patrón que `Activity` del PE con FKs directas (Opción A).

```
id                      PK serial
projectResultId         FK → project_results (NOT NULL, onDelete: CASCADE)
objectiveIndicatorId    FK → project_indicators (nullable, onDelete: SET NULL)
resultIndicatorId       FK → project_indicators (nullable, onDelete: SET NULL)
code                    VARCHAR(30) NOT NULL
name                    VARCHAR(250) NOT NULL
description             TEXT nullable
completionPercentage    DECIMAL(5,2) default 0
startDate               DATE nullable
endDate                 DATE nullable
active                  BOOLEAN default true
createdAt               TIMESTAMP
updatedAt               TIMESTAMP
deletedAt               TIMESTAMP
```

**Índices:**
- `UQ_PROJ_ACTIVITY_CODE` UNIQUE en `(projectResultId, code)`

---

### 1.6 `ProjectIndicator` → tabla `project_indicators`

Misma filosofía de tabla unificada con campo `type` del PE.  
**Sin** `strategicIndicatorId` — la alineación se gestiona en tabla separada.

```
id                    PK serial
projectObjectiveId    FK → project_objectives (nullable, onDelete: CASCADE)
projectResultId       FK → project_results (nullable, onDelete: CASCADE)
projectActivityId     FK → project_activities (nullable, onDelete: CASCADE)
type                  ENUM('OBJECTIVE','RESULT','ACTIVITY') NOT NULL
code                  VARCHAR(30) UNIQUE NOT NULL
name                  VARCHAR(250) NOT NULL
description           TEXT nullable
targetValue           DECIMAL(15,2) NOT NULL
measurementUnit       VARCHAR(100) nullable
active                BOOLEAN default true
createdAt             TIMESTAMP
updatedAt             TIMESTAMP
deletedAt             TIMESTAMP
```

**Restricciones:**
- `UQ_PROJ_INDICATOR_CODE` UNIQUE en `code`
- CHECK constraint en migración:
  ```sql
  CONSTRAINT chk_proj_indicator_type_rel CHECK (
    (type='OBJECTIVE' AND project_objective_id IS NOT NULL
      AND project_result_id IS NULL AND project_activity_id IS NULL) OR
    (type='RESULT' AND project_result_id IS NOT NULL
      AND project_objective_id IS NULL AND project_activity_id IS NULL) OR
    (type='ACTIVITY' AND project_activity_id IS NOT NULL
      AND project_objective_id IS NULL AND project_result_id IS NULL)
  )
  ```

---

### 1.7 `ProjectIndicatorYearTarget` → tabla `project_indicator_year_targets`

Misma estructura que `IndicatorYearTarget` del PE.

```
id              PK serial
indicatorId     FK → project_indicators (NOT NULL, onDelete: CASCADE)
year            SMALLINT NOT NULL
targetValue     DECIMAL(15,2) NOT NULL
achievedValue   INT nullable
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

**Restricciones:**
- `UQ_PROJ_INDICATOR_YEAR` UNIQUE en `(indicatorId, year)`

---

### 1.8 `ProjectIndicatorProgress` → tabla `project_indicator_progress`

Misma estructura que `IndicatorProgress` del PE.

```
id              PK serial
indicatorId     FK → project_indicators (NOT NULL, onDelete: CASCADE)
progressDate    DATE NOT NULL
currentValue    DECIMAL(15,2) NOT NULL
observations    TEXT nullable
registeredBy    FK → users (nullable, onDelete: SET NULL)
createdAt       TIMESTAMP
```

**Índices:**
- `IDX_PROJ_INDICATOR_PROGRESS` en `(indicatorId, progressDate)`

---

### 1.9 `ProjectIndicatorAlignment` → tabla `project_indicator_alignments`

Nueva tabla — reemplaza la FK directa. Desacopla el módulo Proyectos del módulo PE.

```
id                    PK serial
projectIndicatorId    FK → project_indicators (NOT NULL, onDelete: CASCADE)
strategicIndicatorId  FK → indicators (NOT NULL, onDelete: CASCADE)
                      ← onDelete CASCADE porque si desaparece el estratégico,
                         la alineación pierde sentido y debe eliminarse.
                         El ProjectIndicator en sí permanece sin alineación.
createdAt             TIMESTAMP
```

**Restricciones:**
- `UQ_PROJ_INDICATOR_ALIGNMENT` UNIQUE en `projectIndicatorId`  
  ← Un indicador de proyecto se alinea con máximo UN indicador estratégico.

> **Nota sobre `onDelete`:** Se usa `CASCADE` en `strategicIndicatorId` para que si el indicador estratégico se elimina, el registro de alineación desaparezca automáticamente (no el `ProjectIndicator` en sí). El proyecto sigue funcionando de manera independiente.

---

## Fase 2 — Módulos NestJS

### 2.1 `ProjectsModule`

**Responsabilidades:**
- CRUD de `Project`
- Gestión de `ProjectProgram` (agregar/quitar programas)
- Exporta `ProjectsService`

**Imports:**
- `TypeOrmModule.forFeature([Project, ProjectProgram])`
- `OrganizationsModule` (validar que la organización exista)
- `ProgramsModule` (validar que el programa exista al relacionar)

**Endpoints:**
```
GET    /projects
GET    /projects/:id
POST   /projects
PATCH  /projects/:id
DELETE /projects/:id

POST   /projects/:id/programs          ← agregar programa al proyecto
DELETE /projects/:id/programs/:programId ← quitar programa del proyecto
GET    /projects/:id/programs          ← listar programas del proyecto
```

---

### 2.2 `ProjectObjectivesModule`

**Responsabilidades:** CRUD de `ProjectObjective`

**Imports:**
- `TypeOrmModule.forFeature([ProjectObjective])`
- `ProjectsModule`

**Endpoints:**
```
GET    /project-objectives
GET    /project-objectives/:id
POST   /project-objectives
PATCH  /project-objectives/:id
DELETE /project-objectives/:id
```

---

### 2.3 `ProjectResultsModule`

**Responsabilidades:** CRUD de `ProjectResult`

**Validación crítica en `create`:**
- Verificar que el `projectObjectiveId` no tenga ya un resultado asociado.
  → Lanza `ConflictException` si el objetivo ya tiene resultado (garantía adicional a la BD).

**Imports:**
- `TypeOrmModule.forFeature([ProjectResult])`
- `ProjectObjectivesModule`

**Endpoints:**
```
GET    /project-results
GET    /project-results/:id
POST   /project-results
PATCH  /project-results/:id
DELETE /project-results/:id
```

---

### 2.4 `ProjectActivitiesModule`

**Responsabilidades:** CRUD de `ProjectActivity`

**Validaciones en servicio:**
- Verificar que `projectResultId` exista.
- Si `objectiveIndicatorId` viene en el DTO → verificar que sea tipo `OBJECTIVE`.
- Si `resultIndicatorId` viene en el DTO → verificar que sea tipo `RESULT`.
- Verificar que los indicadores pertenezcan al mismo proyecto que la actividad.

**Imports:**
- `TypeOrmModule.forFeature([ProjectActivity])`
- `ProjectResultsModule`
- `forwardRef(() => ProjectIndicatorsModule)`

**Endpoints:**
```
GET    /project-activities
GET    /project-activities/:id
POST   /project-activities
PATCH  /project-activities/:id
DELETE /project-activities/:id
```

---

### 2.5 `ProjectIndicatorsModule`

**Responsabilidades:**
- CRUD de `ProjectIndicator`
- Gestión de `ProjectIndicatorYearTarget`
- Gestión de `ProjectIndicatorProgress` + sincronización estratégica
- Gestión de `ProjectIndicatorAlignment`

**Imports:**
- `TypeOrmModule.forFeature([ProjectIndicator, ProjectIndicatorYearTarget, ProjectIndicatorProgress, ProjectIndicatorAlignment])`
- `ProjectObjectivesModule`
- `ProjectResultsModule`
- `forwardRef(() => ProjectActivitiesModule)`
- `ProjectsModule` ← para obtener `startDate/endDate` del proyecto y generar year targets
- `IndicatorsModule` ← para validar y actualizar el indicador estratégico en la sincronización

**Endpoints:**
```
GET    /project-indicators
GET    /project-indicators/:id
POST   /project-indicators
PATCH  /project-indicators/:id
DELETE /project-indicators/:id

POST   /project-indicators/:id/year-targets/generate
POST   /project-indicators/:id/year-targets
GET    /project-indicators/:id/year-targets
PATCH  /project-indicators/year-targets/:yearTargetId
DELETE /project-indicators/year-targets/:yearTargetId

POST   /project-indicators/:id/progress
GET    /project-indicators/:id/progress

POST   /project-indicators/:id/alignment
GET    /project-indicators/:id/alignment
DELETE /project-indicators/:id/alignment
```

---

## Fase 3 — Servicios: lógica de negocio crítica

### 3.1 `ProjectsService` — método auxiliar `getProjectYears(projectId)`

```
getProjectYears(projectId):
  1. findOne(projectId) → obtiene startDate y endDate
  2. Extrae año de startDate y año de endDate
  3. Retorna { startYear: number, endYear: number }
```

Este método reemplaza el rol que cumplía `StrategicPlansService.findOne()` en el PE.

---

### 3.2 `ProjectIndicatorsService` — `generateYearTargets(indicatorId)`

```
generateYearTargets(indicatorId):
  1. findOne(indicatorId)
  2. Según type:
     - OBJECTIVE → getObjective → getProject → getProjectYears
     - RESULT    → getResult → getObjective → getProject → getProjectYears
     - ACTIVITY  → getActivity → getResult → getObjective → getProject → getProjectYears
  3. Para cada año en [startYear..endYear]:
     - Si no existe YearTarget para ese año → crear con targetValue: 0
  4. Retornar lista de YearTargets
```

---

### 3.3 `ProjectIndicatorsService` — `validateTypeRelation()`

Réplica exacta de `IndicatorsService.validateTypeRelation()` del PE:
```
validateTypeRelation(type, objectiveId, resultId, activityId):
  - Exactamente uno de los tres IDs debe estar presente
  - El ID presente debe coincidir con el type
  - Lanza BadRequestException si no se cumple
```

---

### 3.4 `ProjectIndicatorsService` — `registerProgress()` + `syncStrategicProgress()`

```
registerProgress(indicatorId, dto):
  1. Crear registro en ProjectIndicatorProgress
  2. Llamar syncStrategicProgress(indicatorId, dto.currentValue)

syncStrategicProgress(indicatorId, currentValue):
  1. Buscar ProjectIndicatorAlignment donde projectIndicatorId = indicatorId
  2. Si NO existe → return (el proyecto es independiente)
  3. Si existe:
     a. Obtener strategicIndicatorId del alignment
     b. Llamar IndicatorsService para registrar progreso en el indicador estratégico
        (mismo currentValue, misma progressDate)
```

> La lógica de sincronización está **aislada en su propio método** para facilitar migración futura a eventos de dominio.

---

### 3.5 `ProjectIndicatorsService` — gestión de `ProjectIndicatorAlignment`

```
createAlignment(indicatorId, dto):
  1. Verificar que el ProjectIndicator exista
  2. Verificar que no exista ya un alignment para ese indicatorId
     → Si existe: lanzar ConflictException
  3. Verificar que el Proyecto tenga al menos un Programa asociado
     → Si no tiene programas: lanzar BadRequestException
       ("El indicador no puede alinearse sin que el proyecto tenga programas asociados")
  4. Verificar que el StrategicIndicator exista (llamar IndicatorsService.findOne)
  5. Crear y guardar el alignment

getAlignment(indicatorId):
  → Buscar alignment por projectIndicatorId, incluir relación strategicIndicator

deleteAlignment(indicatorId):
  → Buscar y eliminar el alignment
```

---

## Fase 4 — DTOs relevantes

### `CreateProjectDto`
```typescript
projectId?        // no aplica en create, pero sí organizationId
organizationId    IsInt, IsNotEmpty
code              IsString, MaxLength(30), IsNotEmpty
name              IsString, MaxLength(200), IsNotEmpty
description?      IsString, IsOptional
startDate         IsDateString, IsNotEmpty
endDate           IsDateString, IsNotEmpty
status?           IsEnum(ProjectStatus), IsOptional
active?           IsBoolean, IsOptional
```

### `CreateProjectIndicatorDto`
Igual que `CreateIndicatorDto` del PE pero con los campos renombrados:
```typescript
type              IsEnum(ProjectIndicatorType)
projectObjectiveId?  IsInt, IsOptional
projectResultId?     IsInt, IsOptional
projectActivityId?   IsInt, IsOptional
code              IsString, MaxLength(30)
name              IsString, MaxLength(250)
description?      IsString, IsOptional
targetValue       IsNumber
measurementUnit?  IsString, MaxLength(100)
active?           IsBoolean
```

### `CreateProjectIndicatorAlignmentDto`
```typescript
strategicIndicatorId  IsInt, IsNotEmpty
```

### `CreateProjectIndicatorProgressDto`
```typescript
progressDate   IsDateString, IsNotEmpty
currentValue   IsNumber
observations?  IsString, IsOptional
```

---

## Fase 5 — Registro en `app.module.ts`

Orden de registro (respeta dependencias):

```typescript
ProjectsModule,
ProjectObjectivesModule,
ProjectResultsModule,
ProjectActivitiesModule,
ProjectIndicatorsModule,
```

---

## Fase 6 — Migración TypeORM

Una sola migración con el nombre:
```
CreateProjectsModule_[timestamp]
```

Orden de creación de tablas en la migración:
1. `projects`
2. `project_programs`
3. `project_objectives`
4. `project_results` (incluye UNIQUE en `project_objective_id`)
5. `project_activities`
6. `project_indicators` (incluye CHECK constraint)
7. `project_indicator_year_targets`
8. `project_indicator_progress`
9. `project_indicator_alignments`

---

## Fase 7 — Orden de implementación

```
[ ] Fase 1 — Entidades
    [ ] project.entity.ts
    [ ] project-program.entity.ts
    [ ] project-objective.entity.ts
    [ ] project-result.entity.ts
    [ ] project-activity.entity.ts
    [ ] project-indicator.entity.ts
    [ ] project-indicator-year-target.entity.ts
    [ ] project-indicator-progress.entity.ts
    [ ] project-indicator-alignment.entity.ts

[ ] Fase 2 — Módulos base (sin lógica de negocio compleja aún)
    [ ] projects.module.ts + service + controller + DTOs
    [ ] project-objectives.module.ts + service + controller + DTOs
    [ ] project-results.module.ts + service + controller + DTOs
    [ ] project-activities.module.ts + service + controller + DTOs
    [ ] project-indicators.module.ts + service + controller + DTOs

[ ] Fase 3 — Migración
    [ ] Generar migración TypeORM
    [ ] Revisar SQL generado
    [ ] Agregar CHECK constraint manualmente en la migración
    [ ] Ejecutar migración

[ ] Fase 4 — Registro en app.module.ts
    [ ] Agregar los 5 nuevos módulos

[ ] Fase 5 — Verificación
    [ ] Compilación TypeScript sin errores
    [ ] Pruebas manuales de cada endpoint vía REST client
```

---

## Diagrama de dependencias entre módulos

```
ProjectIndicatorsModule
    ├── ProjectObjectivesModule
    ├── ProjectResultsModule
    ├── ProjectActivitiesModule (forwardRef)
    ├── ProjectsModule          ← para getProjectYears()
    └── IndicatorsModule        ← para sincronización estratégica

ProjectActivitiesModule
    ├── ProjectResultsModule
    └── ProjectIndicatorsModule (forwardRef)

ProjectResultsModule
    └── ProjectObjectivesModule

ProjectObjectivesModule
    └── ProjectsModule

ProjectsModule
    ├── OrganizationsModule
    └── ProgramsModule
```

---

## Resumen del modelo de datos

```
organizations
    └── projects (organizationId)
            ├── project_programs (projectId + programId → programs)
            └── project_objectives (projectId)
                    └── project_results (projectObjectiveId UNIQUE)
                            └── project_activities (projectResultId)
                                    ├── objectiveIndicatorId → project_indicators
                                    └── resultIndicatorId   → project_indicators

project_indicators (projectObjectiveId | projectResultId | projectActivityId)
    ├── project_indicator_year_targets (indicatorId)
    ├── project_indicator_progress     (indicatorId)
    └── project_indicator_alignments   (projectIndicatorId → strategicIndicatorId → indicators)
```
