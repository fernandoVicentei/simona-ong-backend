# SIMONA Backend

> Backend del Sistema de Monitoreo para Programas y Servicios Sociales.

---

# Descripción

SIMONA es una plataforma orientada al monitoreo y seguimiento de programas sociales desarrollada para organizaciones que administran proyectos de intervención comunitaria.

El sistema permite administrar la planificación estratégica institucional, controlar el cumplimiento de objetivos, resultados, actividades e indicadores, además de proporcionar mecanismos de seguridad, auditoría y control de acceso basados en roles y permisos.

La arquitectura del proyecto ha sido diseñada para ser escalable, mantenible y preparada para futuras ampliaciones funcionales.

---

# Objetivos del proyecto

- Centralizar la información institucional.
- Gestionar planes estratégicos.
- Administrar programas sociales.
- Dar seguimiento al cumplimiento de indicadores.
- Proporcionar métricas de avance en tiempo real.
- Implementar un sistema seguro de autenticación y autorización.
- Mantener auditoría completa de las acciones realizadas por los usuarios.

---

# Tecnologías

## Backend

- NestJS
- TypeScript
- Node.js

## Base de datos

- PostgreSQL
- TypeORM

## Seguridad

- JWT Authentication
- Refresh Tokens
- Role Based Access Control (RBAC)
- Permissions
- Audit Logs
- Password Hashing (bcrypt)

## Validaciones

- class-validator
- class-transformer

---

# Arquitectura

El proyecto sigue una arquitectura modular basada en los principios recomendados por NestJS.

```
Cliente

↓

REST API

↓

Controllers

↓

DTOs

↓

Validation

↓

Services

↓

Repositories (TypeORM)

↓

PostgreSQL
```

Cada módulo es independiente y encapsula su propia lógica de negocio.

---

# Características principales

- Arquitectura modular.
- API REST.
- Migraciones versionadas.
- Seeders.
- Autenticación JWT.
- Roles y permisos.
- Auditoría.
- Arquitectura escalable.
- DTOs.
- Validaciones.
- Convenciones de desarrollo.
- Cálculo dinámico de indicadores.

---

# Estructura del proyecto

```
backend/

src/
database/
docs/
test/

.env
package.json
README.md
```

---

# Documentación

Toda la documentación técnica se encuentra dentro de la carpeta:

```
docs/
```

La documentación está organizada por dominios.

```
docs/

01-project/
02-architecture/
03-development/
04-database/
05-security/
06-modules/
07-api/
08-deployment/
09-decisions/
10-ai-context/
```

---

# Requisitos

- Node.js
- PostgreSQL
- npm

---

# Instalación

Instalar dependencias

```bash
npm install
```

Configurar variables de entorno

```bash
cp .env.example .env
```

Ejecutar migraciones

```bash
npm run migration:run
```

Ejecutar seeders

```bash
npm run seed:run
```

Iniciar proyecto

```bash
npm run start:dev
```

---

# Flujo de desarrollo

Todo cambio en la base de datos debe seguir el siguiente flujo:

```
Entidad

↓

Migración

↓

Seeder (si aplica)

↓

DTO

↓

Servicio

↓

Controlador

↓

Pruebas
```

Nunca se utilizará `synchronize=true` para modificar la estructura de la base de datos.

---

# Principios del proyecto

- Arquitectura Modular.
- SOLID.
- Clean Code.
- Separación de responsabilidades.
- Base de datos normalizada.
- Seguridad por defecto.
- Convenciones de código.
- Reutilización de componentes.
- Escalabilidad.

---

# Estado del proyecto

En construcción.

Actualmente se encuentra en fase de diseño de arquitectura y definición del modelo de negocio.

---
