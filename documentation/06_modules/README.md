# Módulos del Sistema

## Introducción

SIMONA adopta una arquitectura modular basada en **NestJS**, donde cada módulo representa un dominio funcional del negocio.

El objetivo de esta arquitectura es garantizar una clara separación de responsabilidades, facilitar el mantenimiento del sistema y permitir el crecimiento progresivo de la plataforma sin afectar módulos existentes.

Cada módulo deberá ser completamente independiente y contener toda la lógica relacionada con su dominio.

---

# Objetivos

La arquitectura modular busca:

* Organizar el proyecto por dominios funcionales.
* Reducir el acoplamiento entre componentes.
* Facilitar el mantenimiento.
* Permitir el trabajo paralelo entre desarrolladores.
* Favorecer la reutilización de componentes.
* Mantener una estructura uniforme en todo el proyecto.

---

# Estructura General

Todos los módulos deberán ubicarse dentro de:

```text
src/modules/
```

Ejemplo:

```text
src/

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

beneficiaries/

projects/
```

Cada carpeta representa un módulo independiente.

---

# Responsabilidad de un Módulo

Un módulo es responsable de administrar un único dominio del sistema.

Ejemplos:

| Módulo          | Responsabilidad                |
| --------------- | ------------------------------ |
| Auth            | Autenticación                  |
| Users           | Administración de usuarios     |
| Roles           | Administración de roles        |
| Permissions     | Administración de permisos     |
| Strategic Plans | Gestión de planes estratégicos |
| Programs        | Gestión de programas           |
| Objectives      | Gestión de objetivos           |
| Results         | Gestión de resultados          |
| Activities      | Gestión de actividades         |
| Indicators      | Gestión de indicadores         |

Un módulo nunca deberá asumir responsabilidades pertenecientes a otro dominio.

---

# Estructura Recomendada

Cada módulo deberá seguir la siguiente estructura.

```text
users/

controllers/

dto/

entities/

interfaces/

repositories/

services/

types/

users.controller.ts

users.service.ts

users.module.ts
```

Dependiendo de la complejidad del módulo podrán agregarse carpetas adicionales como:

```text
guards/

decorators/

events/

listeners/

validators/

constants/

enums/

mappers/
```

Siempre respetando la organización modular.

---

# Generación del Módulo

NestJS proporciona un comando para generar un módulo.

```bash
nest g module modules/users
```

Generar un controlador.

```bash
nest g controller modules/users
```

Generar un servicio.

```bash
nest g service modules/users
```

La generación deberá realizarse dentro de la carpeta `modules` para mantener una estructura consistente.

---

# Componentes de un Módulo

## Module

El archivo `.module.ts` registra todos los componentes del módulo.

Ejemplo:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## Entity

Representa la estructura persistente de la información.

Ejemplo.

```typescript
@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

}
```

Las entidades no deberán contener lógica de negocio.

---

## DTO

Los DTO serán utilizados para validar la información recibida.

Ejemplo.

```typescript
export class CreateUserDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

}
```

Los DTO representan el contrato entre el cliente y la API.

---

## Controller

Los Controllers únicamente administran solicitudes HTTP.

Ejemplo.

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

}
```

Los Controllers nunca deberán contener lógica de negocio.

---

## Service

Los Services contienen la lógica del negocio.

Ejemplo.

```typescript
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll() {
    return this.repository.find();
  }

}
```

Toda regla de negocio deberá implementarse aquí.

---

# Flujo General

Toda solicitud seguirá el siguiente recorrido.

```text
Cliente

↓

Controller

↓

DTO

↓

Validation

↓

Service

↓

Repository

↓

PostgreSQL

↓

Respuesta
```

Este flujo deberá mantenerse en todos los módulos.

---

# Comunicación entre Módulos

Los módulos deberán comunicarse mediante servicios exportados.

Ejemplo.

```typescript
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Otro módulo podrá importar dicho servicio.

```typescript
@Module({
  imports: [UsersModule],
})
export class AuthModule {}
```

Nunca deberá accederse directamente a entidades o repositorios pertenecientes a otro módulo.

---

# Dependencias

Las dependencias deberán mantenerse al mínimo.

Cada módulo únicamente importará lo estrictamente necesario.

Evitar dependencias circulares.

Cuando exista una dependencia inevitable deberá evaluarse el uso de `forwardRef()`.

---

# Repositorios

El acceso a la base de datos deberá realizarse mediante TypeORM.

Ejemplo.

```typescript
constructor(
  @InjectRepository(User)
  private readonly repository: Repository<User>,
) {}
```

No realizar consultas SQL directamente salvo casos excepcionales.

---

# Validaciones

Toda información recibida deberá validarse mediante DTO.

Ejemplo.

```typescript
@IsEmail()
email: string;

@Length(8,50)
password: string;
```

Nunca confiar en la validación realizada por el frontend.

---

# Manejo de Errores

Los Services deberán lanzar excepciones controladas.

Ejemplo.

```typescript
throw new NotFoundException(
  'Usuario no encontrado'
);
```

Nunca devolver errores internos del servidor al cliente.

---

# Seguridad

Todos los módulos deberán implementar los mecanismos de seguridad definidos para el proyecto.

Ejemplo.

```typescript
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
```

Cuando corresponda:

```typescript
@Permissions('users.read')
```

o

```typescript
@Roles('Administrator')
```

La protección de endpoints será obligatoria.

---

# Auditoría

Las operaciones críticas deberán registrar auditoría.

Ejemplos:

* Crear usuarios.
* Modificar permisos.
* Eliminar información.
* Exportar reportes.
* Cambios de configuración.

La implementación será transparente para el módulo cuando sea posible.

---

# Convenciones

Todos los módulos deberán respetar las siguientes convenciones.

## Controllers

```text
users.controller.ts
```

## Services

```text
users.service.ts
```

## Modules

```text
users.module.ts
```

## DTOs

```text
create-user.dto.ts

update-user.dto.ts

login.dto.ts
```

## Entities

```text
user.entity.ts

role.entity.ts
```

Mantener una nomenclatura consistente facilita el mantenimiento del proyecto.

---

# Buenas Prácticas

Durante el desarrollo de nuevos módulos deberán respetarse las siguientes prácticas:

* Un módulo representa un único dominio.
* No duplicar lógica.
* No colocar lógica de negocio en Controllers.
* No acceder directamente a la base de datos desde Controllers.
* Validar toda entrada mediante DTO.
* Mantener desacoplamiento entre módulos.
* Reutilizar servicios cuando sea posible.
* Mantener la documentación actualizada.

---

# Flujo para Crear un Nuevo Módulo

Todo nuevo módulo deberá seguir el siguiente proceso.

```text
Análisis del requerimiento

↓

Definición de reglas de negocio

↓

Diseño de tablas

↓

Migración

↓

Entidad

↓

DTOs

↓

Service

↓

Controller

↓

Seguridad

↓

Pruebas

↓

Documentación
```

Este flujo garantiza consistencia con la arquitectura del proyecto.

---

# Módulos Iniciales del Proyecto

La primera versión de SIMONA incluirá los siguientes módulos:

* Auth
* Users
* Roles
* Permissions
* Strategic Plans
* Programs
* Objectives
* Results
* Activities
* Indicators
* Audit Logs

Posteriormente podrán incorporarse nuevos módulos conforme evolucionen los requerimientos institucionales.

---

# Evolución

La arquitectura modular permitirá incorporar nuevos dominios sin afectar la estructura existente.

Todo nuevo módulo deberá respetar las convenciones establecidas en este documento y alinearse con los principios definidos en la arquitectura general del proyecto.

---

# Estado del Documento

Versión: 1.0

Estado: Documento base.

Este documento establece la estructura general para el desarrollo de módulos dentro de SIMONA. Los detalles específicos de cada módulo, sus casos de uso, endpoints, DTOs, entidades y reglas de negocio serán documentados de forma independiente conforme avance el desarrollo del sistema.
