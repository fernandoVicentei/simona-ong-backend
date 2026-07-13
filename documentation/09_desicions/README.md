# Decisiones Arquitectónicas

## Introducción

Durante la fase de planificación y construcción del proyecto **SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis)** se han definido una serie de decisiones arquitectónicas que establecen las bases sobre las cuales se desarrollará todo el sistema.

Estas decisiones representan acuerdos técnicos adoptados para garantizar una arquitectura consistente, mantenible, escalable y segura. Su propósito es proporcionar una dirección clara al equipo de desarrollo y evitar cambios que puedan comprometer la estabilidad del proyecto.

La carpeta **09-decisions** reúne la documentación relacionada con estas decisiones, permitiendo conocer el contexto en el que fueron tomadas y facilitando la incorporación de nuevos desarrolladores al proyecto.

---

# Objetivos

Esta sección tiene como finalidad:

* Documentar las principales decisiones arquitectónicas adoptadas durante el diseño del sistema.
* Mantener un registro histórico de la evolución técnica del proyecto.
* Justificar la selección de tecnologías, herramientas y patrones utilizados.
* Facilitar el mantenimiento y la evolución de la plataforma.
* Servir como referencia para futuras decisiones de arquitectura.

---

# Alcance

Las decisiones documentadas abarcan aspectos fundamentales relacionados con:

* Arquitectura general del sistema.
* Organización del código fuente.
* Persistencia de datos.
* Seguridad.
* Autenticación y autorización.
* Desarrollo modular.
* Diseño de APIs.
* Estrategia de despliegue.
* Buenas prácticas de desarrollo.

Cada decisión importante será documentada mediante un **Architecture Decision Record (ADR)** independiente.

---

# Principales Decisiones Adoptadas

Como resultado de la fase inicial de análisis y planificación del proyecto, se establecieron las siguientes decisiones arquitectónicas.

## Arquitectura del Backend

* Uso de NestJS como framework principal para el desarrollo del backend.
* Implementación de una arquitectura modular organizada por dominios funcionales.
* Separación clara entre Controllers, Services, DTOs, Entities y configuración.

---

## Persistencia de Datos

* PostgreSQL como motor oficial de base de datos.
* TypeORM como ORM principal del proyecto.
* Uso obligatorio de migraciones para todos los cambios estructurales.
* Uso de Seeders para la carga de datos iniciales.
* Evolución controlada del esquema mediante versionado.

---

## Seguridad

* Autenticación basada en JWT.
* Access Token con una duración máxima de 2 horas.
* Implementación de Refresh Tokens para la renovación de sesiones.
* Control de acceso basado en Roles y Permisos (RBAC).
* Protección de todos los endpoints mediante Guards.
* Registro de auditoría para operaciones críticas.

---

## Organización del Proyecto

* Organización del código mediante módulos independientes.
* Separación entre configuración, módulos, base de datos y documentación.
* Documentación técnica integrada dentro del propio proyecto.
* Estandarización de la estructura de carpetas y convenciones de desarrollo.

---

## Desarrollo

* Uso de DTOs para validación de datos.
* Validaciones centralizadas mediante ValidationPipe.
* Lógica de negocio implementada exclusivamente en Services.
* Controllers dedicados únicamente al manejo de solicitudes HTTP.
* Uso de TypeORM Repository para el acceso a los datos.

---

## API REST

* Diseño basado en principios REST.
* Versionado desde la primera versión de la API.
* Formato estándar para todas las respuestas.
* Uso consistente de códigos HTTP.
* Documentación mediante Swagger/OpenAPI.

---

## Base de Datos

* Modelo relacional normalizado.
* Integridad referencial mediante claves foráneas.
* Uso de índices para optimización.
* Implementación de Soft Delete cuando sea aplicable.
* Auditoría de operaciones críticas.

---

## Despliegue

* Configuración mediante variables de entorno.
* Separación de ambientes de desarrollo, pruebas y producción.
* Ejecución controlada de migraciones durante el despliegue.
* Preparación para futuras estrategias de integración y despliegue continuo (CI/CD).

---

# Evolución de las Decisiones

La arquitectura del proyecto evolucionará conforme aumenten los requerimientos funcionales y técnicos.

Cuando sea necesario modificar una decisión existente o incorporar una nueva estrategia arquitectónica, deberá generarse un nuevo documento ADR que registre el contexto, la decisión tomada y sus implicaciones.

Esto permitirá mantener un historial técnico claro y garantizar la trazabilidad de la evolución del sistema.

---

# Relación con la Documentación

Las decisiones arquitectónicas complementan el resto de la documentación técnica del proyecto y sirven como fundamento para los documentos ubicados en:

```text
docs/

01-project/
02-architecture/
03-development/
04-database/
05-security/
06-modules/
07-api/
08-deployment/
```

Mientras estos documentos describen **cómo está construido el sistema y cómo debe desarrollarse**, esta sección explica **por qué se adoptaron las decisiones arquitectónicas que sustentan dicha estructura**.

---

# Próximos Documentos

Cada decisión relevante será desarrollada en un documento independiente mediante un **Architecture Decision Record (ADR)**.

Entre las primeras decisiones documentadas se encuentran:

* ADR-001 - Uso de NestJS como framework backend.
* ADR-002 - PostgreSQL como motor de base de datos.
* ADR-003 - TypeORM como ORM principal.
* ADR-004 - Arquitectura modular por dominios.
* ADR-005 - Uso de migraciones para el control del esquema.
* ADR-006 - Estrategia de autenticación basada en JWT.
* ADR-007 - Implementación de RBAC para autorización.
* ADR-008 - Estrategia de auditoría del sistema.
* ADR-009 - Estándar de respuestas para la API.
* ADR-010 - Estrategia de despliegue y configuración por ambientes.

---

# Estado del Documento

**Versión:** 1.0

**Estado:** Documento base.

Este documento presenta una visión general de las decisiones arquitectónicas adoptadas durante la planificación inicial de SIMONA y sirve como punto de partida para la documentación detallada de cada Architecture Decision Record (ADR) que forme parte del proyecto.
