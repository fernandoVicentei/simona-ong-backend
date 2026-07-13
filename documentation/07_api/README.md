# API REST

## Introducción

SIMONA expone su funcionalidad mediante una API REST desarrollada con **NestJS**.

Este documento define los lineamientos generales para el diseño, implementación y mantenimiento de todos los endpoints del sistema.

El objetivo principal es garantizar que todas las APIs mantengan una estructura uniforme, sean fáciles de consumir, seguras y consistentes durante toda la vida del proyecto.

Este documento representa una guía general. La documentación específica de cada módulo y sus endpoints será desarrollada posteriormente.

---

# Objetivos

La API del sistema tiene como objetivos:

* Mantener una estructura uniforme.
* Facilitar la integración con aplicaciones externas.
* Simplificar el desarrollo del frontend.
* Reducir inconsistencias entre módulos.
* Mejorar la mantenibilidad.
* Facilitar la documentación automática mediante Swagger.

---

# Arquitectura

Toda la comunicación entre clientes y el sistema se realizará mediante HTTPS utilizando el protocolo HTTP y una arquitectura REST.

```text
Cliente

↓

HTTPS

↓

NestJS

↓

Controller

↓

Service

↓

Base de Datos

↓

Respuesta JSON
```

La API será el único mecanismo autorizado para acceder a la información del sistema.

---

# Formato de Respuesta

Todas las respuestas deberán mantener una estructura uniforme.

## Respuesta Exitosa

```json
{
    "success": true,
    "message": "Operación realizada correctamente.",
    "data": {},
    "timestamp": "2026-01-01T10:00:00Z"
}
```

---

## Respuesta con Error

```json
{
    "success": false,
    "message": "El usuario no existe.",
    "errors": [
        "No se encontró el registro solicitado."
    ],
    "timestamp": "2026-01-01T10:00:00Z"
}
```

Mantener un formato uniforme facilita el consumo de la API por parte del frontend y otros sistemas.

---

# Versionado

Todas las APIs deberán versionarse desde el inicio.

Ejemplo:

```text
/api/v1
```

Ejemplos:

```text
GET    /api/v1/users

POST   /api/v1/users

PATCH  /api/v1/users/:id

DELETE /api/v1/users/:id
```

Cuando exista una nueva versión importante:

```text
/api/v2
```

La coexistencia de versiones permitirá mantener compatibilidad con clientes existentes.

---

# Convenciones de Endpoints

Los recursos deberán nombrarse utilizando sustantivos en plural.

Correcto:

```text
/users

/roles

/programs

/objectives

/results

/activities
```

Incorrecto:

```text
/getUsers

/createUser

/deleteProgram
```

Las acciones estarán determinadas por el verbo HTTP.

---

# Métodos HTTP

La API utilizará los métodos estándar.

| Método | Uso                                           |
| ------ | --------------------------------------------- |
| GET    | Consultar                                     |
| POST   | Crear                                         |
| PUT    | Reemplazar completamente                      |
| PATCH  | Actualizar parcialmente                       |
| DELETE | Eliminación lógica o física según corresponda |

---

# Ejemplo de Controller

```typescript
@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {
        return this.usersService.findOne(id);
    }

    @Post()
    create(
        @Body() dto: CreateUserDto,
    ) {
        return this.usersService.create(dto);
    }

}
```

Los Controllers únicamente deberán administrar la comunicación HTTP.

Toda la lógica de negocio pertenece al Service.

---

# Validación de Datos

Toda información recibida deberá validarse mediante DTO.

Ejemplo:

```typescript
export class CreateUserDto {

    @IsString()
    firstName: string;

    @IsEmail()
    email: string;

}
```

Nunca confiar en las validaciones realizadas por el frontend.

---

# Parámetros

## Parámetros de Ruta

```http
GET /users/15
```

```typescript
@Get(':id')
findOne(
    @Param('id') id: string,
)
```

---

## Query Parameters

```http
GET /users?page=1&limit=20
```

```typescript
@Get()
findAll(
    @Query() query: PaginationDto,
)
```

Los filtros deberán implementarse mediante Query Parameters.

---

# Paginación

Toda consulta que pueda devolver múltiples registros deberá soportar paginación.

Ejemplo:

```http
GET /users?page=1&limit=20
```

Respuesta:

```json
{
    "success": true,
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "pages": 8
    }
}
```

---

# Ordenamiento

Las consultas podrán admitir ordenamiento.

Ejemplo:

```http
GET /users?sort=first_name&order=ASC
```

---

# Búsquedas

Las búsquedas deberán implementarse utilizando parámetros de consulta.

Ejemplo:

```http
GET /users?search=Fernando
```

---

# Filtros

Ejemplo:

```http
GET /programs?status=ACTIVE
```

Los filtros siempre deberán implementarse mediante Query Parameters.

---

# Seguridad

Toda API será privada por defecto.

Los endpoints públicos deberán declararse explícitamente.

Ejemplo:

```typescript
@Public()
@Post('login')
login() {}
```

---

# Protección mediante Guards

Todos los endpoints privados deberán utilizar Guards.

Ejemplo:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
```

---

# Permisos

Los endpoints deberán validar permisos.

Ejemplo:

```typescript
@Permissions('users.read')
@Get()
findAll() {}
```

---

# Roles

Cuando corresponda.

```typescript
@Roles('Administrator')
```

---

# Manejo de Errores

Utilizar excepciones de NestJS.

Ejemplo.

```typescript
throw new NotFoundException(
    'Usuario no encontrado.'
);
```

Nunca devolver errores internos del servidor.

---

# Códigos HTTP

Utilizar siempre los códigos HTTP adecuados.

| Código | Descripción           |
| ------ | --------------------- |
| 200    | Consulta exitosa      |
| 201    | Recurso creado        |
| 204    | Sin contenido         |
| 400    | Solicitud inválida    |
| 401    | No autenticado        |
| 403    | Acceso denegado       |
| 404    | Recurso no encontrado |
| 409    | Conflicto             |
| 422    | Error de validación   |
| 500    | Error interno         |

---

# Auditoría

Las operaciones críticas deberán registrarse.

Ejemplos:

* Crear usuario.
* Eliminar usuario.
* Cambiar contraseña.
* Modificar permisos.
* Exportar información.

---

# Documentación Swagger

Todas las APIs deberán documentarse utilizando Swagger.

Ejemplo:

```typescript
@ApiTags('Users')
@Controller('users')
export class UsersController {}
```

Documentar:

* Endpoints.
* DTOs.
* Respuestas.
* Errores.
* Autenticación.

---

# Flujo General

Toda petición seguirá el siguiente recorrido.

```text
Cliente

↓

Controller

↓

DTO

↓

Validation Pipe

↓

Guard

↓

Service

↓

Repository

↓

PostgreSQL

↓

Respuesta
```

---

# Buenas Prácticas

Durante el desarrollo deberán respetarse las siguientes reglas:

* Utilizar nombres consistentes.
* Mantener endpoints RESTful.
* No colocar lógica de negocio en Controllers.
* Validar toda entrada.
* Proteger todos los endpoints.
* Utilizar DTO para entrada y salida cuando corresponda.
* Documentar todos los endpoints.
* Mantener respuestas consistentes.
* Utilizar códigos HTTP adecuados.

---

# Futuras Mejoras

La documentación de la API evolucionará conforme avance el proyecto.

Se documentarán posteriormente aspectos específicos como:

* Versionado avanzado.
* Subrecursos.
* Upload de archivos.
* Descarga de documentos.
* Exportaciones.
* Integraciones externas.
* Webhooks.
* APIs públicas.
* Rate Limiting.
* OpenAPI.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento establece los lineamientos generales para el diseño e implementación de todas las APIs del proyecto SIMONA y servirá como referencia para garantizar consistencia entre los distintos módulos del sistema.
