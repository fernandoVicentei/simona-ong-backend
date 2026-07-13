# Seguridad

## Introducción

La seguridad constituye uno de los pilares fundamentales del proyecto **SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis)**.

El sistema administrará información institucional de carácter estratégico y datos relacionados con programas sociales, beneficiarios, indicadores, planificación y procesos internos, por lo que deberá garantizar la confidencialidad, integridad y disponibilidad de la información.

Este documento establece los lineamientos generales de seguridad que deberán respetarse durante todo el ciclo de vida del proyecto.

Las implementaciones específicas serán documentadas posteriormente en documentos especializados.

---

# Objetivos

La estrategia de seguridad del sistema tiene como objetivos principales:

- Garantizar la confidencialidad de la información.
- Proteger los datos sensibles almacenados.
- Controlar el acceso a cada funcionalidad del sistema.
- Garantizar la trazabilidad de las acciones realizadas por los usuarios.
- Reducir el riesgo de accesos no autorizados.
- Mantener la integridad de la información.
- Facilitar auditorías internas y externas.
- Cumplir con buenas prácticas de desarrollo seguro.

---

# Principios de Seguridad

SIMONA implementará el principio de **Seguridad por Defecto (Security by Default)**.

Esto significa que toda funcionalidad será considerada privada hasta que se autorice explícitamente su acceso.

Todo nuevo módulo, endpoint o recurso deberá estar protegido desde su creación.

---

# Arquitectura de Seguridad

La seguridad estará presente en todas las capas del sistema.

```text
Usuario

↓

Autenticación

↓

Autorización

↓

Validación de Permisos

↓

Lógica de Negocio

↓

Persistencia

↓

Auditoría
```

La seguridad no dependerá únicamente del frontend.

Toda validación crítica deberá realizarse en el backend.

---

# Autenticación

El acceso al sistema requerirá autenticación mediante credenciales válidas.

Inicialmente se implementará autenticación basada en:

- Usuario
- Contraseña

La autenticación generará un JWT firmado que permitirá acceder a los recursos autorizados.

El tiempo máximo de vigencia del Access Token será de **2 horas**, conforme a los lineamientos definidos para el proyecto.

---

# Gestión de Sesiones

Cada inicio de sesión generará una sesión independiente.

Será posible controlar:

- Fecha de inicio.
- Última actividad.
- Dispositivo.
- Dirección IP (cuando sea posible).
- Estado de la sesión.

Esto permitirá futuras funcionalidades como:

- Cierre remoto de sesiones.
- Consulta de sesiones activas.
- Detección de accesos sospechosos.

---

# Autorización

SIMONA utilizará un modelo de autorización basado en **RBAC (Role-Based Access Control)**.

Los permisos nunca se asignarán directamente a los usuarios como regla general.

La estructura será:

```text
Usuario

↓

Rol

↓

Permisos
```

En casos excepcionales podrán implementarse permisos específicos por usuario sin romper el modelo general.

---

# Roles

Los roles representan grupos de responsabilidades dentro de la organización.

Ejemplos:

- Administrador General
- Dirección Ejecutiva
- Dirección de Planificación
- Coordinador Regional
- Técnico
- Consultor
- Auditor

Cada rol agrupará un conjunto de permisos relacionados con sus funciones.

---

# Permisos

Cada acción del sistema deberá estar protegida mediante permisos específicos.

Ejemplos:

```text
users.read

users.create

users.update

users.delete

roles.manage

programs.read

programs.create

strategic-plans.update

reports.export
```

Los permisos serán utilizados por los Guards del sistema para determinar el acceso a los recursos.

---

# Principio de Mínimo Privilegio

Cada usuario deberá poseer únicamente los permisos estrictamente necesarios para desempeñar sus funciones.

No se asignarán permisos administrativos por defecto.

---

# Protección de Contraseñas

Las contraseñas nunca serán almacenadas en texto plano.

Todas deberán almacenarse utilizando algoritmos de hash seguros.

Inicialmente se utilizará:

- bcrypt

Nunca se almacenarán:

- Contraseñas.
- Tokens.
- Credenciales sensibles.

en texto plano.

---

# Políticas de Contraseñas

Las contraseñas deberán cumplir requisitos mínimos de complejidad.

Ejemplos:

- Longitud mínima.
- Combinación de letras.
- Números.
- Caracteres especiales.

Las reglas específicas podrán evolucionar conforme a las necesidades institucionales.

---

# Recuperación de Contraseña

La recuperación de contraseña deberá realizarse mediante mecanismos seguros.

Nunca se enviará la contraseña actual al usuario.

La recuperación deberá realizarse mediante enlaces temporales o códigos de verificación.

---

# Protección de Endpoints

Todos los endpoints estarán protegidos por defecto.

Únicamente los recursos públicos serán marcados explícitamente como accesibles sin autenticación.

Ejemplos:

- Login.
- Recuperación de contraseña.
- Verificación de cuenta (si aplica).

---

# Validación de Datos

Toda información recibida desde el cliente deberá ser validada antes de ser procesada.

No se confiará en las validaciones realizadas por el frontend.

Todas las validaciones críticas serán implementadas en el backend.

---

# Auditoría

Toda acción importante deberá registrarse.

Ejemplos:

- Inicio de sesión.
- Cierre de sesión.
- Creación de usuarios.
- Cambios de permisos.
- Eliminaciones.
- Actualizaciones.
- Exportaciones de información.
- Cambios de configuración.

La auditoría permitirá reconstruir cualquier acción realizada dentro del sistema.

---

# Protección de Información Sensible

La información considerada sensible deberá recibir un tratamiento especial.

Ejemplos:

- Datos personales.
- Información institucional.
- Indicadores internos.
- Reportes estratégicos.
- Información de beneficiarios.

El acceso a esta información estará restringido mediante permisos específicos.

---

# Seguridad en la Base de Datos

Toda modificación estructural deberá realizarse mediante migraciones.

No se permitirá modificar la base de datos manualmente en ambientes de producción.

La integridad de la información será protegida mediante:

- Claves foráneas.
- Restricciones.
- Índices.
- Validaciones.

---

# Manejo de Errores

Los mensajes de error no deberán revelar información sensible.

Ejemplos de información que nunca deberá exponerse:

- Consultas SQL.
- Stack Trace.
- Credenciales.
- Tokens.
- Información interna del servidor.

---

# Variables de Entorno

Toda información sensible deberá almacenarse mediante variables de entorno.

Ejemplos:

- JWT Secret
- Credenciales de Base de Datos
- Llaves privadas
- Configuración SMTP
- Tokens de integración

Ninguna credencial deberá almacenarse dentro del código fuente.

---

# Protección frente a Amenazas

La arquitectura deberá considerar protección frente a amenazas comunes como:

- SQL Injection
- Cross Site Scripting (XSS)
- Cross Site Request Forgery (CSRF) cuando aplique
- Fuerza Bruta
- Robo de Tokens
- Escalamiento de Privilegios
- Enumeración de Usuarios
- Exposición de Información Sensible

---

# Registro de Eventos

El sistema mantendrá registros relacionados con eventos de seguridad.

Ejemplos:

- Intentos fallidos de autenticación.
- Bloqueo de cuentas.
- Cambios de contraseña.
- Cambios de permisos.
- Revocación de sesiones.
- Accesos administrativos.

Estos registros facilitarán futuras auditorías de seguridad.

---

# Buenas Prácticas

Durante el desarrollo deberán respetarse las siguientes prácticas:

- Nunca almacenar secretos en el repositorio.
- Nunca exponer información sensible mediante la API.
- Validar siempre la información recibida.
- Proteger todos los endpoints.
- Mantener el principio de mínimo privilegio.
- Registrar acciones críticas.
- Revisar periódicamente los permisos asignados.
- Mantener actualizadas las dependencias del proyecto.

---

# Evolución

La estrategia de seguridad evolucionará conforme crezca el sistema.

En fases posteriores se documentarán aspectos específicos como:

- JWT.
- Refresh Tokens.
- Guards.
- Decoradores personalizados.
- RBAC.
- Auditoría.
- Gestión de sesiones.
- Rate Limiting.
- Helmet.
- CORS.
- Cifrado de información.
- Integraciones externas.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento establece los principios generales de seguridad del proyecto SIMONA y servirá como referencia para todas las decisiones relacionadas con autenticación, autorización, protección de datos y control de acceso dentro del sistema.