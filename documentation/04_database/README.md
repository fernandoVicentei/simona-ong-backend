# Base de Datos

## Introducción

Este documento define los lineamientos generales para el diseño, implementación y mantenimiento de la base de datos del proyecto **SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis)**.

El objetivo principal es mantener una estructura consistente, escalable y controlada mediante el uso de migraciones versionadas, entidades bien definidas y buenas prácticas de modelado de datos.

Este documento presenta una visión general. La documentación específica de cada entidad, relación y regla de negocio será desarrollada posteriormente en documentos especializados.

---

# Objetivos

La estrategia de persistencia del proyecto tiene como objetivos:

- Mantener una base de datos normalizada.
- Facilitar la evolución del esquema.
- Garantizar la integridad de la información.
- Evitar cambios manuales en producción.
- Mantener consistencia entre entidades y migraciones.
- Facilitar el mantenimiento a largo plazo.

---

# Motor de Base de Datos

El proyecto utilizará:

- PostgreSQL

Como ORM se utilizará:

- TypeORM

Toda la interacción con la base de datos deberá realizarse mediante TypeORM.

No se permitirá el acceso directo mediante consultas SQL, salvo casos excepcionales donde existan razones técnicas justificadas.

---

# Arquitectura de Persistencia

La persistencia seguirá la siguiente estructura:

```text
Entity

↓

Repository (TypeORM)

↓

PostgreSQL
```

Las entidades representarán el modelo de persistencia del sistema.

Los repositorios serán responsables del acceso a los datos.

La lógica de negocio nunca deberá implementarse dentro de las entidades.

---

# Organización del Proyecto

La estructura relacionada con la base de datos será la siguiente:

```text
src/

config/
│
├── database.config.ts
└── data-source.ts

database/
│
├── migrations/
├── seeders/
└── factories/ (opcional)

modules/
│
├── users/
│   └── entities/
│
├── roles/
│   └── entities/
│
└── ...
```

---

# Entidades

Cada tabla del sistema deberá estar representada mediante una entidad de TypeORM.

Ejemplo:

```text
modules/

users/

entities/

user.entity.ts
```

Las entidades deberán contener únicamente:

- Definición de columnas.
- Relaciones.
- Restricciones.
- Índices.
- Configuración del ORM.

No deberán contener lógica de negocio.

---

# Migraciones

Toda modificación estructural deberá realizarse mediante migraciones.

No se permitirá modificar la estructura de la base de datos manualmente.

Cada cambio deberá estar versionado.

Ejemplos:

- Crear tablas.
- Modificar columnas.
- Crear índices.
- Agregar claves foráneas.
- Eliminar columnas.
- Renombrar estructuras.

---

# Flujo de Trabajo

Todo cambio estructural deberá seguir el siguiente proceso:

```text
Modificar Entidad

↓

Generar Migración

↓

Revisar SQL generado

↓

Ejecutar Migración

↓

Actualizar Documentación
```

---

# Comandos Principales

## Generar migración

```bash
npm run migration:generate -- src/database/migrations/NombreMigracion
```

## Ejecutar migraciones

```bash
npm run migration:run
```

## Revertir última migración

```bash
npm run migration:revert
```

## Crear migración vacía

```bash
npm run migration:create -- src/database/migrations/NombreMigracion
```

---

# Seeders

Los seeders serán utilizados para insertar información inicial requerida por el sistema.

Ejemplos:

- Roles.
- Permisos.
- Usuario Administrador.
- Catálogos iniciales.
- Configuraciones base.

Los seeders no deberán utilizarse para modificar información de producción.

---

# Flujo de Seeders

```text
Migraciones

↓

Seeder

↓

Validación

↓

Datos disponibles
```

---

# Convenciones

Durante el desarrollo deberán respetarse las siguientes convenciones:

## Tablas

- snake_case
- nombres en plural

Ejemplo:

```text
users

roles

permissions

strategic_plans

indicator_year_targets
```

---

## Columnas

Todas las columnas deberán utilizar snake_case.

Ejemplo:

```text
first_name

created_at

updated_at

deleted_at
```

---

## Claves Primarias

Todas las tablas utilizarán una clave primaria denominada:

```text
id
```

El tipo de dato será definido según las necesidades del proyecto (UUID o entero autoincremental).

---

## Claves Foráneas

Todas las relaciones deberán mantener nombres descriptivos.

Ejemplo:

```text
user_id

role_id

program_id

objective_id
```

---

# Relaciones

El diseño de relaciones deberá respetar las reglas de negocio definidas para el proyecto.

Ejemplos:

- Un Programa pertenece a un Plan Estratégico.
- Un Programa posee múltiples Objetivos.
- Un Objetivo posee un único Resultado.
- Un Resultado posee múltiples Actividades.
- Una Actividad puede relacionarse con múltiples indicadores.

---

# Integridad de Datos

La base de datos deberá garantizar:

- Integridad referencial.
- Restricciones de unicidad.
- Claves foráneas.
- Índices adecuados.
- Validaciones mediante restricciones cuando corresponda.

---

# Eliminación de Información

Como regla general:

No se eliminarán registros físicamente.

Siempre que sea posible se utilizará:

```text
deleted_at
```

para implementar borrado lógico.

Solo se permitirá eliminación física cuando exista una razón técnica claramente documentada.

---

# Auditoría

Las operaciones críticas deberán registrar información suficiente para permitir trazabilidad.

Ejemplos:

- Usuario responsable.
- Fecha.
- Acción realizada.
- Registro afectado.

---

# Rendimiento

Durante el diseño deberán considerarse aspectos relacionados con el rendimiento:

- Índices.
- Relaciones eficientes.
- Consultas optimizadas.
- Evitar duplicidad de información.
- Mantener la base de datos normalizada.

Las optimizaciones específicas serán documentadas posteriormente.

---

# Buenas Prácticas

Durante el desarrollo deberán respetarse las siguientes prácticas:

- No utilizar synchronize=true.
- No modificar tablas manualmente.
- No editar migraciones ya ejecutadas en otros ambientes.
- Revisar siempre las migraciones generadas automáticamente.
- Mantener sincronizadas entidades y migraciones.
- Documentar cambios importantes en el modelo de datos.

---

# Evolución del Modelo

El modelo de datos evolucionará conforme avance el proyecto.

Cada nueva entidad deberá:

- Respetar las convenciones establecidas.
- Tener su correspondiente migración.
- Contar con la documentación necesaria.
- Integrarse sin afectar la arquitectura existente.

---

# Documentación Relacionada

Este documento será complementado posteriormente con documentación específica sobre:

- Modelo entidad-relación (ERD).
- Diccionario de datos.
- Documentación de cada tabla.
- Convenciones de nombres.
- Estrategias de índices.
- Transacciones.
- Consultas complejas.
- Optimización de rendimiento.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento establece los lineamientos generales para la gestión de la base de datos del proyecto SIMONA y servirá como referencia para todas las decisiones relacionadas con la persistencia de la información.