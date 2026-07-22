# Módulo: Proyectos

> **Versión:** 1.0
>
> **Proyecto:** SIMONA
>
> **Propósito:** Documento conceptual (Fuente de la verdad) del funcionamiento del módulo **Proyectos** y su relación con el módulo **Plan Estratégico**.

---

# 1. Objetivo del módulo

El módulo **Proyectos** representa la **ejecución operativa** de las iniciativas desarrolladas por la organización.

A diferencia del módulo **Plan Estratégico**, cuyo propósito es definir la planificación institucional de mediano o largo plazo, el módulo **Proyectos** administra la ejecución real de proyectos específicos.

Ambos módulos comparten una estructura similar, sin embargo representan conceptos diferentes dentro del negocio.

---

# 2. Diferencia entre Plan Estratégico y Proyectos

## Plan Estratégico

Representa la planificación institucional.

Responde a preguntas como:

- ¿Qué quiere lograr la organización?
- ¿Cuáles son sus programas institucionales?
- ¿Qué objetivos institucionales existen?
- ¿Qué resultados se esperan?
- ¿Qué actividades conforman dichos resultados?
- ¿Cómo se medirán?

Su función principal es definir la estrategia institucional.

---

## Proyectos

Representan la ejecución de una intervención específica.

Responden a preguntas como:

- ¿Qué proyecto se ejecutará?
- ¿Cuáles son sus objetivos?
- ¿Qué resultados producirá?
- ¿Qué actividades realizará?
- ¿Cómo será medido?

Su función principal es ejecutar acciones concretas.

---

# 3. Relación entre ambos módulos

Los módulos son independientes.

Un Proyecto puede existir sin formar parte del Plan Estratégico.

Sin embargo, cuando un Proyecto pertenece a uno o varios Programas del Plan Estratégico, puede aportar información para medir el cumplimiento de la planificación institucional.

Por esta razón, la relación entre ambos módulos es completamente opcional.

---

# 4. Principio arquitectónico

El módulo Proyectos **no reutiliza** las entidades del módulo Plan Estratégico.

Cada módulo mantiene su propia estructura de datos.

Esto evita:

- acoplamiento entre módulos;
- dependencia de estructuras internas;
- problemas de evolución futura;
- limitaciones funcionales.

Cada módulo evoluciona de forma independiente.

---

# 5. Estructura conceptual

## Plan Estratégico

```
Strategic Plan

↓

Program

↓

Objective

↓

Result

↓

Activity

↓

Indicators
```

---

## Proyectos

```
Project

↓

Project Objective

↓

Project Result

↓

Project Activity

↓

Project Indicators
```

La estructura es equivalente, pero representa una planificación diferente.

---

# 6. Relación Proyecto → Programa

Un Proyecto puede:

- no pertenecer a ningún Programa;
- pertenecer a un Programa;
- pertenecer a varios Programas.

Por esta razón, la relación debe modelarse mediante una tabla intermedia.

Conceptualmente:

```
Project

↓

ProjectProgram

↑

Program
```

Esta relación es opcional.

---

# 7. Jerarquía del módulo Proyectos

La estructura interna del módulo es la siguiente.

```
Proyecto

↓

Objetivos

↓

Resultado

↓

Actividades

↓

Indicadores
```

Las reglas de negocio son prácticamente las mismas que existen en el módulo Plan Estratégico.

---

# 8. Objetivos del Proyecto

Un Proyecto puede contener múltiples Objetivos.

Cada Objetivo pertenece únicamente a un Proyecto.

Cada Objetivo posee uno o más indicadores propios para medir su avance.

Estos indicadores son completamente independientes de los indicadores del Plan Estratégico.

Sin embargo, pueden alinearse con indicadores estratégicos cuando exista relación con un Programa.

---

# 9. Resultados del Proyecto

Cada Objetivo posee un único Resultado.

Cada Resultado pertenece únicamente a un Objetivo.

Cada Resultado posee uno o más indicadores para medir su cumplimiento.

Estos indicadores pueden relacionarse opcionalmente con indicadores de Resultado del Plan Estratégico.

---

# 10. Actividades del Proyecto

Cada Resultado puede contener múltiples Actividades.

Cada Actividad pertenece únicamente a un Resultado.

Cada Actividad posee uno o más indicadores propios.

Además mantiene exactamente la misma regla de negocio existente en el módulo Plan Estratégico.

Una Actividad puede relacionarse con:

- uno o varios Indicadores de Objetivo;
- uno o varios Indicadores de Resultado;
- ambos;
- ninguno.

Estas relaciones son completamente válidas.

---

# 11. Indicadores

Los indicadores representan el único punto de integración entre ambos módulos.

No existen relaciones directas entre Objetivos, Resultados o Actividades del Proyecto con los del Plan Estratégico.

La alineación institucional ocurre únicamente mediante los indicadores.

---

# 12. Alineación de indicadores

Cada indicador del Proyecto puede:

- no estar relacionado con ningún indicador estratégico;
- relacionarse con un indicador del Plan Estratégico.

Esta relación es completamente opcional.

---

## Indicadores de Objetivo

```
Project Objective Indicator

↓

Strategic Objective Indicator
```

---

## Indicadores de Resultado

```
Project Result Indicator

↓

Strategic Result Indicator
```

---

## Indicadores de Actividad

```
Project Activity Indicator

↓

Strategic Activity Indicator
```

---

# 13. Condición para permitir la alineación

Un indicador solamente puede relacionarse con un indicador estratégico cuando:

- el Proyecto pertenece al menos a un Programa;
- dicho Programa pertenece al Plan Estratégico.

Si el Proyecto no posee Programa asociado, la funcionalidad de alineación no debe estar disponible.

---

# 14. Flujo funcional

## Proyecto independiente

```
Proyecto

↓

Objetivos

↓

Resultados

↓

Actividades

↓

Indicadores
```

No existe ninguna relación con el Plan Estratégico.

Todo el funcionamiento es independiente.

---

## Proyecto alineado

```
Proyecto

↓

Programa

↓

Objetivos

↓

Resultados

↓

Actividades

↓

Indicadores

↓

Indicadores Estratégicos
```

Los indicadores pueden alinearse con los indicadores del Programa.

---

# 15. Selector de indicadores estratégicos

Cuando un Proyecto posee Programas asociados, al crear un indicador debe habilitarse una sección adicional.

Esta sección permitirá seleccionar un indicador estratégico existente.

Las listas deberán filtrarse utilizando exclusivamente los Programas asociados al Proyecto.

Nunca deberán mostrarse indicadores pertenecientes a otros Programas.

---

Ejemplo

```
Proyecto

↓

Programa Salud

↓

Indicadores Objetivo

○ Familias atendidas

○ Niños vacunados

○ Mujeres capacitadas
```

No deberán aparecer indicadores pertenecientes al Programa Educación.

---

# 16. Actualización del avance

Cuando un indicador del Proyecto registre un avance:

```
Registrar avance

↓

¿Existe indicador estratégico relacionado?

↓

No

↓

Finaliza
```

---

Si existe relación:

```
Registrar avance

↓

Actualizar indicador estratégico asociado
```

Esto permitirá consolidar automáticamente el cumplimiento del Plan Estratégico.

---

# 17. Independencia funcional

La modificación de Objetivos, Resultados o Actividades del Proyecto nunca deberá afectar directamente al Plan Estratégico.

Únicamente los indicadores podrán actualizar información estratégica.

---

# 18. Principios de implementación

Durante el desarrollo deberán respetarse los siguientes principios.

- Mantener desacoplados ambos módulos.
- No reutilizar entidades entre módulos.
- Reutilizar únicamente componentes de interfaz cuando sea posible.
- Mantener la misma experiencia de usuario utilizada en Plan Estratégico.
- Mantener la misma arquitectura de NestJS.
- Mantener la misma estructura de carpetas.
- Mantener la misma filosofía de desarrollo.

---

# 19. Arquitectura conceptual

```
PLANIFICACIÓN

Strategic Plan
        │
        ▼
Program
        │
        ▼
Objective
        │
        ▼
Result
        │
        ▼
Activity
        │
        ▼
Indicator
```

```
EJECUCIÓN

Project
        │
        ▼
Project Objective
        │
        ▼
Project Result
        │
        ▼
Project Activity
        │
        ▼
Project Indicator
```

```
ALINEACIÓN

Project Indicator

↓

Strategic Indicator
```

La alineación institucional ocurre exclusivamente mediante los indicadores.

---

# 20. Fuente de la verdad

Este documento constituye la referencia conceptual para el diseño e implementación del módulo **Proyectos**.

Toda decisión técnica, funcional o de modelado deberá respetar los principios aquí definidos, garantizando la independencia entre los módulos **Plan Estratégico** y **Proyectos**, así como la correcta integración mediante la alineación opcional de indicadores.