# Arquitectura del Proyecto

## Introducción

Este documento describe la arquitectura general del backend de **SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis)**.

Su objetivo es establecer los lineamientos técnicos que deberán seguirse durante el desarrollo del sistema, garantizando una arquitectura consistente, escalable y fácil de mantener.

Este documento presenta una visión general de la arquitectura. Los detalles técnicos de cada componente serán documentados posteriormente en documentos especializados.

---

# Objetivos de la Arquitectura

La arquitectura del proyecto ha sido diseñada para cumplir los siguientes objetivos:

- Mantener una estructura modular.
- Facilitar el crecimiento progresivo del sistema.
- Reducir el acoplamiento entre módulos.
- Favorecer la reutilización de componentes.
- Mantener una clara separación de responsabilidades.
- Facilitar el mantenimiento a largo plazo.
- Permitir la incorporación de nuevos módulos sin afectar los existentes.
- Mantener una arquitectura preparada para futuras integraciones.

---

# Arquitectura General

SIMONA implementará una arquitectura basada en módulos utilizando **NestJS**, siguiendo los principios recomendados por el framework y adaptándolos a las necesidades del proyecto.

Cada módulo será responsable de un dominio específico del negocio y encapsulará toda su lógica funcional.

La comunicación entre módulos deberá realizarse únicamente mediante servicios públicos y nunca mediante acceso directo a entidades o repositorios de otros módulos.

---

# Tecnologías Principales

## Backend

- NestJS
- TypeScript
- Node.js

## Persistencia

- PostgreSQL
- TypeORM

## Seguridad

- JWT
- Refresh Tokens
- RBAC (Roles y Permisos)

## Validaciones

- class-validator
- class-transformer

---

# Arquitectura por Capas

La aplicación seguirá una arquitectura por capas claramente definida.

```text
Cliente

↓

API REST

↓

Controllers

↓

DTOs

↓

Validaciones

↓

Services

↓

Repositories (TypeORM)

↓

PostgreSQL
```

Cada capa tendrá responsabilidades específicas y no deberá contener lógica perteneciente a otras capas.

---

# Arquitectura Modular

Cada dominio funcional será desarrollado como un módulo independiente.

Ejemplo:

```text
modules/

auth/

users/

roles/

permissions/

strategic-plans/

programs/

objectives/

results/

activities/

indicators/
```

Cada módulo deberá contener únicamente los componentes necesarios para administrar su propio dominio.

---

# Organización del Proyecto

La estructura general del proyecto será similar a la siguiente:

```text
src/

config/

common/

database/

modules/

shared/

main.ts

app.module.ts
```

La estructura interna de cada módulo será documentada en documentos específicos.

---

# Flujo General de una Solicitud

Toda solicitud seguirá el siguiente flujo general:

```text
Cliente

↓

HTTP Request

↓

Controller

↓

DTO

↓

Validación

↓

Service

↓

Persistencia

↓

Base de Datos

↓

Respuesta
```

Este flujo deberá mantenerse consistente en todos los módulos del sistema.

---

# Convenciones Arquitectónicas

Durante el desarrollo deberán respetarse los siguientes principios:

- Cada módulo tendrá una única responsabilidad.
- La lógica de negocio residirá en los Services.
- Los Controllers únicamente gestionarán solicitudes HTTP.
- Los DTOs serán utilizados para validar y transportar información.
- Las Entidades representarán exclusivamente el modelo de persistencia.
- Todo cambio estructural de la base de datos será realizado mediante migraciones.
- Los datos iniciales serán gestionados mediante seeders.
- No se utilizará `synchronize=true` en ambientes de desarrollo colaborativo ni producción.

---

# Escalabilidad

La arquitectura ha sido diseñada para permitir la incorporación de nuevos módulos sin modificar la estructura existente.

El crecimiento del sistema deberá realizarse respetando la organización modular establecida y reutilizando los componentes comunes siempre que sea posible.

---

# Principios de Desarrollo

El desarrollo del proyecto estará basado en los siguientes principios:

- Arquitectura Modular.
- Separación de Responsabilidades.
- SOLID.
- Clean Code.
- DRY (Don't Repeat Yourself).
- KISS (Keep It Simple).
- Código reutilizable.
- Componentes desacoplados.

---

# Comunicación entre Módulos

Los módulos deberán comunicarse mediante servicios públicos.

No se permitirá el acceso directo a repositorios o entidades pertenecientes a otros módulos.

Esto permitirá mantener un bajo acoplamiento y facilitar la evolución del sistema.

---

# Gestión de la Base de Datos

Toda modificación de la estructura de la base de datos deberá seguir el siguiente flujo:

```text
Entidad

↓

Migración

↓

Revisión

↓

Ejecución

↓

Seeder (si aplica)
```

Las migraciones serán el único mecanismo autorizado para modificar la estructura de la base de datos.

---

# Seguridad

La seguridad será un componente transversal de toda la arquitectura.

Todos los módulos deberán respetar las políticas definidas para:

- Autenticación.
- Autorización.
- Roles.
- Permisos.
- Auditoría.
- Registro de eventos.

La documentación específica será desarrollada en la sección correspondiente a Seguridad.

---

# Evolución de la Arquitectura

Este documento representa una visión general de la arquitectura del proyecto.

A medida que el desarrollo avance, cada uno de los temas aquí presentados será ampliado mediante documentación especializada, incluyendo:

- Arquitectura de módulos.
- Convenciones de desarrollo.
- Manejo de errores.
- Validaciones.
- Seguridad.
- Base de datos.
- API.
- Despliegue.
- Decisiones arquitectónicas.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento será actualizado conforme evolucione la arquitectura del proyecto y se incorporen nuevos componentes o decisiones técnicas.