# Despliegue (Deployment)

## Introducción

Este documento establece los lineamientos generales para el despliegue del backend de **SIMONA (Sistema Integrado de Monitoreo Organizacional y Análisis)**.

El objetivo es garantizar que el sistema pueda ser desplegado de forma consistente, segura y reproducible en los diferentes ambientes definidos para el proyecto.

El despliegue deberá minimizar riesgos, preservar la integridad de la información y facilitar futuras actualizaciones.

Este documento presenta una visión general. La configuración específica de cada ambiente será documentada posteriormente.

---

# Objetivos

El proceso de despliegue tiene como objetivos:

* Garantizar estabilidad.
* Facilitar la instalación.
* Mantener la seguridad del sistema.
* Reducir tiempos de inactividad.
* Estandarizar el proceso de publicación.
* Permitir futuras automatizaciones mediante CI/CD.

---

# Ambientes

El proyecto contemplará, como mínimo, los siguientes ambientes.

```text
Local

↓

Development

↓

Testing

↓

Staging

↓

Production
```

Cada ambiente deberá contar con configuraciones independientes.

---

# Configuración por Ambiente

Toda configuración deberá realizarse mediante variables de entorno.

No deberán existir configuraciones específicas dentro del código fuente.

Ejemplo:

```text
.env.development

.env.test

.env.staging

.env.production
```

Cada ambiente podrá utilizar:

* Base de datos diferente.
* Secretos diferentes.
* Tokens diferentes.
* Servicios externos diferentes.

---

# Variables de Entorno

Toda información sensible deberá almacenarse mediante variables de entorno.

Ejemplo.

```env
APP_NAME=SIMONA

APP_PORT=3000

NODE_ENV=development

DB_HOST=

DB_PORT=

DB_USERNAME=

DB_PASSWORD=

DB_DATABASE=

JWT_SECRET=

JWT_EXPIRES_IN=2h

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRES_IN=7d
```

Nunca almacenar información sensible dentro del repositorio.

---

# Instalación

Instalar dependencias.

```bash
npm install
```

Compilar el proyecto.

```bash
npm run build
```

Ejecutar migraciones.

```bash
npm run migration:run
```

Ejecutar seeders.

```bash
npm run seed:run
```

Iniciar la aplicación.

```bash
npm run start:prod
```

---

# Flujo General de Despliegue

Todo despliegue deberá seguir el siguiente proceso.

```text
Actualizar Código

↓

Instalar Dependencias

↓

Compilar Proyecto

↓

Ejecutar Migraciones

↓

Ejecutar Seeders (si aplica)

↓

Validar Configuración

↓

Iniciar Aplicación

↓

Verificar Estado
```

No deberán omitirse pasos.

---

# Migraciones

Antes de iniciar una nueva versión deberán ejecutarse todas las migraciones pendientes.

Ejemplo.

```bash
npm run migration:run
```

Nunca modificar tablas manualmente en producción.

---

# Seeders

Los seeders únicamente deberán ejecutarse cuando sea necesario incorporar datos base.

Ejemplo:

* Roles.
* Permisos.
* Usuario administrador.
* Catálogos.

No utilizar seeders para modificar información existente.

---

# Compilación

El proyecto deberá ejecutarse en producción utilizando la versión compilada.

Ejemplo.

```bash
npm run build
```

Posteriormente.

```bash
npm run start:prod
```

No ejecutar TypeScript directamente en producción.

---

# Gestión del Proceso

La aplicación deberá ejecutarse mediante un administrador de procesos.

Ejemplo.

* PM2
* Docker
* Kubernetes
* Systemd

La elección dependerá de la infraestructura disponible.

---

# Servidor Web

La aplicación deberá ubicarse detrás de un servidor web inverso.

Ejemplos.

* Nginx
* Apache

El servidor será responsable de:

* HTTPS.
* Compresión.
* Balanceo (si aplica).
* Redirecciones.
* Seguridad básica.

---

# HTTPS

Toda comunicación deberá realizarse mediante HTTPS.

No deberá exponerse la API mediante HTTP en ambientes productivos.

El certificado SSL deberá mantenerse actualizado.

---

# Base de Datos

La base de datos deberá encontrarse separada de la aplicación.

No se recomienda instalar PostgreSQL dentro del mismo servidor de la aplicación, salvo ambientes de desarrollo.

Las copias de seguridad deberán realizarse periódicamente.

---

# Backups

Se deberán realizar copias de seguridad de forma programada.

Las copias deberán contemplar:

* Base de datos.
* Archivos cargados por usuarios.
* Configuración crítica.

Los procedimientos de restauración deberán ser probados periódicamente.

---

# Logs

La aplicación deberá registrar información suficiente para facilitar el monitoreo.

Ejemplos:

* Inicio del servidor.
* Errores.
* Excepciones.
* Accesos.
* Auditoría.
* Eventos importantes.

Los logs deberán almacenarse fuera del código fuente.

---

# Monitoreo

El ambiente de producción deberá contar con mecanismos de monitoreo.

Ejemplos:

* Uso de CPU.
* Memoria.
* Espacio en disco.
* Estado del servidor.
* Disponibilidad de la API.
* Tiempo de respuesta.

Esto permitirá detectar problemas antes de que afecten a los usuarios.

---

# Actualizaciones

Las actualizaciones deberán seguir el siguiente proceso.

```text
Respaldo

↓

Despliegue

↓

Migraciones

↓

Validación

↓

Monitoreo

↓

Liberación
```

Nunca desplegar cambios directamente sobre producción sin validaciones previas.

---

# Seguridad

Antes de publicar una nueva versión deberán verificarse, como mínimo:

* Variables de entorno.
* Credenciales.
* Certificados SSL.
* Permisos del servidor.
* Accesos a la base de datos.
* Dependencias actualizadas.

---

# Recuperación

El proyecto deberá contar con un procedimiento de recuperación ante fallos.

Este procedimiento deberá contemplar:

* Restauración de la base de datos.
* Restauración de archivos.
* Reversión de versiones cuando sea necesario.
* Recuperación de servicios.

---

# Integración Continua

La arquitectura del proyecto deberá permitir la incorporación futura de procesos de Integración Continua y Despliegue Continuo (CI/CD).

Ejemplos:

* GitHub Actions.
* GitLab CI.
* Azure DevOps.
* Jenkins.

La automatización no forma parte del alcance inicial, pero la estructura del proyecto deberá facilitar su incorporación.

---

# Buenas Prácticas

Durante el despliegue deberán respetarse las siguientes prácticas:

* No ejecutar `synchronize=true`.
* No modificar la base de datos manualmente.
* No almacenar secretos en el repositorio.
* Mantener copias de seguridad.
* Utilizar HTTPS.
* Ejecutar migraciones antes de iniciar la aplicación.
* Validar el funcionamiento posterior al despliegue.
* Documentar cambios importantes.

---

# Evolución

La estrategia de despliegue evolucionará conforme crezca el proyecto.

Se documentarán posteriormente aspectos específicos como:

* Docker.
* Docker Compose.
* PM2.
* Nginx.
* GitHub Actions.
* Kubernetes.
* Balanceo de carga.
* Escalabilidad horizontal.
* Monitoreo avanzado.
* Observabilidad.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento establece los lineamientos generales para el despliegue del backend de SIMONA y servirá como referencia para todos los ambientes del proyecto.
