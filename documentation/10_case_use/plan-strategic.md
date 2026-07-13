# Contexto Funcional del Módulo de Planificación Estratégica

## Objetivo del documento

Este documento describe el dominio funcional del módulo de Planificación Estratégica del sistema SIMONA.

No describe la implementación técnica ni la estructura de la base de datos.

Su propósito es explicar el significado de cada concepto del negocio, cómo se relacionan entre sí y cuáles son las reglas que gobiernan el funcionamiento del módulo.

Este documento sirve como contexto permanente para desarrolladores, analistas y agentes de inteligencia artificial.

---

# ¿Qué es la Planificación Estratégica?

La planificación estratégica es el proceso mediante el cual una organización define el rumbo que seguirá durante un periodo determinado para cumplir su misión institucional.

No representa proyectos específicos.

No representa actividades operativas.

Representa la visión institucional de mediano o largo plazo.

Normalmente un Plan Estratégico comprende un periodo de tres a cinco años.

Ejemplo:

2025–2029

Durante ese periodo la organización define:

- qué quiere lograr;
- en qué áreas trabajará;
- cómo medirá sus avances;
- qué resultados espera obtener.

Todo el módulo gira alrededor de esta planificación.

---

# Jerarquía conceptual

La planificación estratégica tiene una estructura jerárquica.

```
Organización

↓

Plan Estratégico

↓

Programas

↓

Objetivos Específicos

↓

Resultados Esperados

↓

Actividades

↓

Indicadores

↓

Metas por Año

↓

Avances
```

Cada nivel depende completamente del nivel superior.

Si un elemento padre desaparece, todos los elementos inferiores pierden sentido.

---

# Organización

La Organización representa la institución propietaria de toda la información.

Puede ser una ONG, una Fundación, un Gobierno Autónomo Municipal o cualquier entidad que ejecute programas sociales.

Una Organización puede existir sin tener un Plan Estratégico.

Sin embargo, un Plan Estratégico nunca puede existir sin una Organización.

La Organización responde a la pregunta:

> ¿Quién ejecuta toda esta planificación?

Toda la información del módulo pertenece siempre a una Organización.

---

# Plan Estratégico

El Plan Estratégico representa la planificación institucional de varios años.

Es el documento principal sobre el cual se construye todo el módulo.

No contiene actividades.

No contiene indicadores.

No contiene beneficiarios.

No contiene resultados.

Únicamente establece el marco general bajo el cual funcionará la institución.

Su propósito es responder:

> ¿Qué dirección seguirá la organización durante este periodo?

Ejemplo

Plan Estratégico 2025–2029

↓

Fortalecer el desarrollo social del municipio.

↓

Mejorar los indicadores de salud.

↓

Incrementar el acceso a la educación.

El Plan Estratégico solamente organiza la planificación.

No mide absolutamente nada.

Toda la medición ocurre en niveles inferiores.

---

# Programa

Un Programa representa una gran línea estratégica del Plan.

Es una agrupación temática.

Un Programa no representa un proyecto.

No representa un presupuesto.

No representa una actividad.

Representa una gran área institucional.

Ejemplos

Programa Salud

Programa Educación

Programa Protección Social

Programa Seguridad Alimentaria

Programa Desarrollo Económico

Cada Programa responde a la pregunta:

> ¿En qué gran área trabajará la organización?

Todos los Objetivos Específicos deben pertenecer a un Programa.

Los Programas ayudan a dividir un Plan Estratégico en componentes manejables.

---

# Objetivo Específico

El Objetivo Específico representa un cambio concreto que la organización desea alcanzar.

Es el primer nivel que realmente puede medirse.

Un objetivo nunca describe actividades.

Nunca describe tareas.

Nunca describe reuniones.

Describe un estado que se quiere lograr.

Ejemplos

Reducir la desnutrición infantil.

Incrementar la cobertura escolar.

Fortalecer la atención médica.

Disminuir la violencia intrafamiliar.

Un objetivo responde a la pregunta:

> ¿Qué queremos lograr?

No responde:

¿Cómo?

Eso corresponde a las Actividades.

No responde:

¿Qué obtuvimos?

Eso corresponde a los Resultados.

---

# Resultado

El Resultado representa la evidencia de que el Objetivo está produciendo efectos.

Mientras el Objetivo representa una intención, el Resultado representa un efecto esperado.

Ejemplo

Objetivo

Reducir la desnutrición infantil.

↓

Resultado esperado

Niños con controles nutricionales permanentes.

Los Resultados sirven para dividir un Objetivo en componentes medibles.

Cada Resultado tendrá posteriormente sus propios Indicadores.

---

# Actividad

La Actividad representa el trabajo operativo que realiza la organización.

Es la única entidad que describe acciones.

Ejemplos

Capacitación.

Visita domiciliaria.

Taller.

Campaña médica.

Entrega de alimentos.

Evaluación nutricional.

Las Actividades responden a la pregunta:

> ¿Cómo lograremos el Resultado?

Las Actividades no representan logros.

Representan trabajo realizado.

---

# Indicador

El Indicador representa la unidad oficial de medición del sistema.

Todo porcentaje del sistema nace aquí.

Nunca se calcula directamente sobre Actividades.

Nunca se calcula directamente sobre Programas.

Todo se calcula a partir de Indicadores.

Un Indicador responde a la pregunta:

> ¿Cómo sabremos que realmente estamos avanzando?

Ejemplos

Número de niños atendidos.

Cantidad de talleres ejecutados.

Familias beneficiadas.

Escuelas fortalecidas.

Productores capacitados.

Cada Indicador posee una meta cuantitativa.

Ejemplo

Meta

500 Personas

A medida que la organización registra avances, el sistema compara automáticamente el valor actual contra la meta.

---

# Meta Anual

Una Meta Anual representa cómo se distribuye una meta general durante los años del Plan Estratégico.

Ejemplo

Meta general

1000 familias

Periodo

2025–2029

Distribución

2025 → 200

2026 → 200

2027 → 180

2028 → 220

2029 → 200

Esto permite generar reportes anuales sin modificar la meta principal del Indicador.

---

# Avances

Los Avances representan registros históricos del progreso.

Nunca modifican la meta.

Nunca reemplazan la planificación.

Simplemente registran lo ocurrido.

Ejemplo

15 Enero

50 personas

15 Marzo

120 personas

15 Junio

180 personas

El sistema utiliza estos registros para calcular automáticamente el porcentaje de cumplimiento del Indicador.

---

# Dependencia conceptual

La dependencia funcional del dominio es la siguiente:

Organización
└── posee Planes Estratégicos

Plan Estratégico
└── organiza Programas

Programa
└── agrupa Objetivos

Objetivo
└── define Resultados esperados

Resultado
└── requiere Actividades

Actividad
└── produce Indicadores medibles

Indicador
└── define Metas

Meta
└── recibe Avances

Avances
└── generan Porcentajes

Esta jerarquía nunca debe romperse.

Si un nivel superior no existe, el inferior pierde completamente su significado dentro del negocio.