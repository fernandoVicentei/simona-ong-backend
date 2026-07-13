# Política de Uso de Git – GitFlow del Proyecto

## 1. Propósito

Este documento define el estándar oficial para el uso de Git dentro del proyecto.

Su objetivo es establecer un flujo de trabajo uniforme que permita:

- Mantener un historial de cambios limpio y trazable.
- Facilitar el trabajo colaborativo entre desarrolladores.
- Reducir conflictos durante la integración de código.
- Garantizar la estabilidad de los ambientes.
- Asegurar que todo cambio pase por un proceso de revisión antes de llegar a producción.
- Mantener un proceso alineado con buenas prácticas de desarrollo y CI/CD.

Este estándar aplica para todos los módulos del proyecto, independientemente de la tecnología utilizada.

---

# 2. Estrategia adoptada

El proyecto utiliza una variante simplificada de GitFlow.

Las ramas permanentes son:

```
main
develop
```

Las ramas temporales son:

```
feature/*
bugfix/*
hotfix/*
release/*
```

Todas las ramas temporales nacen de una rama principal y son eliminadas una vez integradas.

---

# 3. Arquitectura de ramas

```
                     feature/*
                   /
develop ----------o-----------------------------

                   \
                    bugfix/*


main -------------------------------------------

                     \
                      hotfix/*


develop ---------------------- release/* --------
```

---

# 4. Ramas permanentes

## 4.1 main

La rama **main** representa el estado oficial del sistema en producción.

Características:

- Siempre debe contener código estable.
- Nunca debe contener desarrollos incompletos.
- Todo commit debe poder desplegarse.
- Debe corresponder con una versión funcional del sistema.
- Se encuentra protegida contra pushes directos.

Origen de cambios:

- release/*
- hotfix/*

No se permite desarrollar directamente sobre esta rama.

---

## 4.2 develop

Es la rama principal de desarrollo.

Todo nuevo trabajo termina integrándose aquí.

Características:

- Centraliza el desarrollo del proyecto.
- Es la rama utilizada por el equipo durante el desarrollo diario.
- Contiene funcionalidades ya integradas.
- Puede desplegarse al ambiente de desarrollo o staging.

Toda nueva funcionalidad comienza desde esta rama.

---

# 5. Ramas temporales

## 5.1 feature

Las ramas **feature** se utilizan para desarrollar nuevas funcionalidades.

Se crean desde:

```
develop
```

Ejemplos:

```
feature/AUTH-101-login
feature/USR-205-user-module
feature/PLAN-010-strategic-plan
```

Una vez finalizada la implementación:

```
feature/*
      ↓
Merge Request
      ↓
develop
```

Posteriormente la rama debe eliminarse.

---

## 5.2 bugfix

Las ramas bugfix corrigen errores encontrados durante el desarrollo o pruebas.

Se crean desde:

```
develop
```

Ejemplos

```
bugfix/USR-302-null-pointer
bugfix/AUTH-404-invalid-token
```

Flujo

```
bugfix/*
      ↓
develop
```

---

## 5.3 release

Las ramas release preparan una nueva versión del sistema antes de producción.

Su uso es opcional y depende del proceso de despliegue.

Se crean desde:

```
develop
```

Durante esta etapa únicamente se permiten:

- Corrección de errores.
- Ajustes menores.
- Actualización de versiones.
- Validaciones funcionales.
- Pruebas finales.

No deben desarrollarse nuevas funcionalidades.

Al finalizar:

```
release/*
        ↓
main

release/*
        ↓
develop
```

Finalmente la rama se elimina.

---

## 5.4 hotfix

Las ramas hotfix corrigen errores críticos detectados directamente en producción.

Se crean desde:

```
main
```

Proceso:

```
main
   ↓

hotfix/*
   ↓

main
   ↓

develop
```

De esta forma la corrección también queda registrada en la rama de desarrollo.

---

# 6. Flujo general del proyecto

Nueva funcionalidad

```
develop
      │
      ▼
feature/*
      │
      ▼
Merge Request
      │
      ▼
develop
```

Liberación

```
develop
      │
      ▼
release/*
      │
      ├────────► main
      │
      └────────► develop
```

Corrección crítica

```
main
      │
      ▼
hotfix/*
      │
      ├────────► main
      │
      └────────► develop
```

---

# 7. Convención de nombres

Formato general

```
<tipo>/<ticket>-<descripcion>
```

Tipos permitidos

```
feature/
bugfix/
release/
hotfix/
```

Ejemplos

```
feature/PLAN-101-create-objectives
feature/AUTH-220-refresh-token

bugfix/USR-115-invalid-role

release/1.0.0
release/2.1.0

hotfix/INC-210-login-error
```

Reglas

- Utilizar guiones (-) como separador.
- Descripciones en minúsculas.
- No utilizar espacios.
- El ticket debe corresponder al sistema de gestión de proyectos.

---

# 8. Estrategia de Merge

Todo cambio debe realizarse mediante Pull Request o Merge Request.

No está permitido:

- Push directo a main.
- Push directo a develop.

Cada Merge Request debe cumplir:

- Código compilando correctamente.
- Pipeline exitoso.
- Revisión de código.
- Resolución de conflictos.
- Aprobación del revisor asignado.

---

# 9. Protección de ramas

Las ramas permanentes deben permanecer protegidas.

## main

- Sin pushes directos.
- Requiere aprobación.
- Requiere pipeline exitoso.
- Solo administradores pueden realizar merges de emergencia.

## develop

- Sin pushes directos.
- Requiere Pull Request.
- Pipeline obligatorio.

---

# 10. Convención de commits

Formato recomendado

```
<tipo>(<scope>): <mensaje>
```

Tipos

```
feat
fix
refactor
docs
style
test
perf
build
ci
chore
```

Ejemplos

```
feat(auth): implement jwt authentication

fix(users): validate duplicated email

refactor(database): simplify repository pattern

docs(git): add gitflow documentation

test(auth): add login integration tests
```

---

# 11. Eliminación de ramas

Después del merge:

- Eliminar feature/*
- Eliminar bugfix/*
- Eliminar release/*
- Eliminar hotfix/*

Únicamente permanecen:

```
main
develop
```

---

# 12. Buenas prácticas

- Realizar commits pequeños y frecuentes.
- Un commit debe representar un único cambio lógico.
- Mantener las ramas actualizadas con develop.
- Evitar ramas de larga duración.
- Resolver conflictos antes de crear el Merge Request.
- Documentar cambios importantes.
- Mantener nombres descriptivos.
- Referenciar el identificador del ticket cuando corresponda.

---

# 13. Beneficios del flujo

La adopción de este flujo permite:

- Historial de cambios claro.
- Integración continua organizada.
- Mejor colaboración entre desarrolladores.
- Menor riesgo en despliegues.
- Mayor trazabilidad.
- Facilidad para auditorías.
- Mejor control de versiones.
- Separación clara entre desarrollo, validación y producción.

---

# 14. Resumen del flujo

```
                    feature/*
                  /
develop ---------o-------------------------------

                   \
                    bugfix/*

                      │
                      │
                      ▼

                 release/*

                      │
             ┌────────┴────────┐
             ▼                 ▼
         develop             main

                               ▲
                               │
                          hotfix/*
                               │
                               └──────────────► develop
```