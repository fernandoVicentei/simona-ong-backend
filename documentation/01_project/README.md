# Project Charter

# SIMONA

## Sistema Integrado de Monitoreo Organizacional y Análisis

Versión: 1.0

Estado: En construcción

---

# 1. Introducción

SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis) es una plataforma institucional diseñada para centralizar, organizar, monitorear y analizar la información generada por programas, proyectos, actividades, indicadores, población participante, medios de verificación y reportes institucionales.

El sistema surge como respuesta a la necesidad de consolidar información que actualmente se encuentra distribuida en múltiples archivos, hojas de cálculo, documentos y repositorios utilizados por diferentes equipos de trabajo.

SIMONA permitirá fortalecer los procesos de planificación, monitoreo, evaluación y generación de reportes, facilitando la toma de decisiones basada en información estructurada, actualizada y verificable.

---

# 2. Propósito del sistema

El propósito principal de SIMONA es proporcionar una herramienta institucional para:

* Gestionar la planificación estratégica institucional.
* Gestionar programas y proyectos.
* Registrar objetivos, resultados, actividades e indicadores.
* Realizar seguimiento de avances.
* Consolidar información de población participante.
* Gestionar medios de verificación.
* Generar reportes institucionales.
* Facilitar auditorías y trazabilidad.
* Fortalecer la gestión del conocimiento institucional.
* Apoyar la toma de decisiones estratégicas y operativas.

---

# 3. Visión

Convertirse en la plataforma institucional central para la gestión de información programática, monitoreo y evaluación, garantizando la disponibilidad de información confiable, trazable y oportuna para la organización.

---

# 4. Objetivos estratégicos del sistema

## Objetivos generales

* Centralizar la información institucional.
* Mejorar la calidad y consistencia de los datos.
* Reducir la dependencia de archivos dispersos.
* Fortalecer el seguimiento de indicadores.
* Facilitar la generación de reportes.
* Incrementar la trazabilidad de la información.
* Mejorar la gestión del conocimiento institucional.

## Objetivos específicos

* Registrar información estructurada de programas y proyectos.
* Gestionar metas e indicadores.
* Controlar actividades y cronogramas.
* Gestionar población participante.
* Organizar medios de verificación.
* Proporcionar tableros de monitoreo.
* Implementar mecanismos de seguridad y control de acceso.
* Mantener historial de cambios y auditoría.

---

# 5. Alcance del sistema

SIMONA cubrirá los procesos institucionales relacionados con:

* Planificación estratégica.
* Programas institucionales.
* Proyectos.
* Objetivos.
* Resultados.
* Actividades.
* Indicadores.
* Población participante.
* Medios de verificación.
* Reportes.
* Tableros de monitoreo.
* Alertas.
* Usuarios, roles y permisos.
* Auditoría y trazabilidad.

---

# 6. Procesos fuera de alcance

La primera fase del sistema NO incluirá:

* Sistema contable.
* Gestión financiera completa.
* Recursos humanos.
* Nóminas.
* Inventarios.
* Compras.
* Logística institucional.
* Gestión documental administrativa general.
* Gestión de redes sociales.
* Plataformas educativas completas.
* Integraciones masivas con sistemas externos.
* Publicación pública de información sensible.

---

# 7. Principios de negocio

## 7.1 Seguridad por defecto

Toda información será accesible únicamente mediante autenticación y autorización.

## 7.2 Trazabilidad

Toda modificación relevante deberá registrar:

* Usuario.
* Fecha.
* Acción.
* Registro afectado.

## 7.3 Información verificable

Todo avance registrado deberá poder relacionarse con evidencia o medios de verificación.

## 7.4 Conservación histórica

La información histórica nunca deberá eliminarse físicamente.

Se utilizará borrado lógico cuando corresponda.

## 7.5 Calidad de datos

El sistema deberá minimizar:

* Duplicidades.
* Registros inconsistentes.
* Información incompleta.

---

# 8. Actores principales

## Dirección Ejecutiva

Responsable de:

* Consultar información consolidada.
* Analizar avances institucionales.
* Tomar decisiones estratégicas.

## Dirección de Planificación, Monitoreo y Evaluación (DPME)

Responsable de:

* Administración funcional del sistema.
* Definición de indicadores.
* Validación de información.
* Consolidación de reportes.
* Administración de catálogos.

## Coordinaciones Regionales

Responsables de:

* Supervisión territorial.
* Revisión de información.
* Validación operativa.

## Equipos Técnicos

Responsables de:

* Registro operativo.
* Actividades.
* Indicadores.
* Población participante.
* Evidencias.

---

# 9. Modelo conceptual del negocio

La estructura principal del sistema será:

Plan Estratégico

↓

Programa

↓

Objetivo Específico

↓

Resultado

↓

Actividad

↓

Indicadores

---

Reglas aprobadas para esta implementación:

* El Plan Estratégico es opcional.
* Un Programa pertenece a un Plan Estratégico.
* Un Programa posee un Objetivo General informativo.
* Un Programa posee múltiples Objetivos Específicos.
* Un Objetivo Específico tiene exactamente un Resultado.
* Un Resultado posee múltiples Actividades.
* Una Actividad puede relacionarse con indicadores.
* Los indicadores representan la unidad principal de medición.

---

# 10. Principios de medición

SIMONA utilizará un modelo orientado a indicadores.

Cada indicador tendrá:

* Meta planificada.
* Valor alcanzado.
* Unidad de medida.
* Responsable.
* Periodicidad.

Regla arquitectónica aprobada:

Los porcentajes de cumplimiento NO serán almacenados en la base de datos.

Todos los porcentajes serán calculados dinámicamente por la lógica del sistema.

---

# 11. Principios tecnológicos

La arquitectura del sistema deberá:

* Ser modular.
* Permitir crecimiento progresivo.
* Facilitar nuevas integraciones.
* Minimizar dependencias externas.
* Permitir mantenimiento institucional a largo plazo.

---

# 12. Arquitectura tecnológica aprobada

Backend:

* NestJS
* TypeScript
* TypeORM
* PostgreSQL

Seguridad:

* JWT
* Refresh Tokens
* RBAC (Roles y Permisos)

Persistencia:

* Migraciones
* Seeders
* Auditoría

Infraestructura:

* Aplicación Web
* Arquitectura modular
* API REST

---

# 13. Restricciones

* La plataforma debe ser accesible desde navegadores web.
* Debe soportar exportaciones a Excel, Word y PDF.
* Debe funcionar con al menos 50 usuarios concurrentes.
* Debe mantener compatibilidad con futuras integraciones.
* Debe respetar criterios de protección de datos sensibles.

---

# 14. Factores críticos de éxito

El éxito del proyecto dependerá de:

* Calidad de la información registrada.
* Participación activa de las áreas responsables.
* Correcta definición de indicadores.
* Adecuada gestión de permisos.
* Documentación técnica actualizada.
* Diseño modular sostenible.
* Capacitación institucional.

---

# 15. Estado actual del proyecto

Fase actual:

Diseño de arquitectura y modelado de negocio.

Próxima fase:

Diseño de base de datos y definición de módulos funcionales.

---

# 16. Documento rector

Este documento constituye la referencia principal para todas las decisiones funcionales y técnicas relacionadas con el proyecto SIMONA.

Toda decisión arquitectónica, funcional o tecnológica deberá alinearse con los principios y objetivos definidos en este Project Charter.
