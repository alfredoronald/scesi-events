# Backend de SCESI Events

API Express 5 + TypeScript + Prisma 6 + PostgreSQL. Las rutas están bajo `/api/v1`; el chequeo de salud está en `/api/health`.

## Desarrollo local

Desde la raíz:

```powershell
pnpm install
Copy-Item backend/.env.example backend/.env
docker compose -f backend/compose.yaml up -d db
pnpm --filter scesi-events-backend prisma:generate
pnpm --filter scesi-events-backend db:deploy
pnpm db:seed
pnpm dev:backend
```

`db:deploy` aplica las migraciones existentes. `db:migrate` crea migraciones durante desarrollo. **`db:seed` recrea los datos de demostración y elimina los datos actuales.** Se debe usar en una base de desarrollo.

La API escucha en `http://localhost:4000`. PostgreSQL local usa el puerto `5434`. El frontend usa `http://localhost:3000` y reenvía `/api/v1/*` al backend mediante un rewrite de Next.js. Configura `API_BASE_URL` en el frontend para otro origen; no incluyas `/api/v1` en esa variable.

## Cuentas del seed

| Rol | Correo | Contraseña local |
| --- | --- | --- |
| Administrador | marco@scesi.org | admin1234 |
| Organizador | elena@scesi.org | demo1234 |
| Staff | carlos@scesi.org | demo1234 |
| Participante | andrea@correo.com | demo1234 |

El registro público crea participantes. Los administradores crean las cuentas de otros roles.

## Contratos usados por el frontend

| Ruta | Uso |
| --- | --- |
| `POST /api/v1/auth/login` | `{ identifier, password }`; devuelve access token y usuario. |
| `POST /api/v1/auth/register` | Nombre, usuario, correo y contraseña. |
| `POST /api/v1/auth/refresh` | Rota la cookie HttpOnly de sesión. |
| `POST /api/v1/auth/logout` | Revoca el refresh token y elimina la cookie. |
| `GET /api/v1/auth/me` | Usuario autenticado. |
| `GET /api/v1/eventos` | Listado paginado; filtros `periodo`, `mios`, `staff`, `buscar`, `estado`. |
| `POST /api/v1/eventos` | Crea un borrador. |
| `PATCH /api/v1/eventos/:id/estado` | Publicación y cambios de estado. |
| `POST /api/v1/eventos/:id/inscripciones` | Inscripción con consentimiento; vincula al usuario si envía Bearer. |
| `GET /api/v1/inscripciones/me` | Entradas del usuario actual. |
| `GET /api/v1/inscripciones/:id/qr` | Código, token y QR PNG como data URL. |
| `POST /api/v1/inscripciones/:id/comprobante` | PDF binario, máximo 5 MB. |
| `GET /api/v1/inscripciones/:id/comprobante` | Descarga autorizada del PDF. |
| `PATCH /api/v1/inscripciones/:id/pago` | Confirmación o rechazo por dueño del evento/admin. |
| `GET /api/v1/eventos/:id/asistencia` | Inscripciones, ingresos, salidas y último punto de control. |
| `POST /api/v1/asistencia/checkin-manual` | Ingreso/reingreso con `eventoId`, `inscripcionId`, `puntoControl`. |
| `POST /api/v1/asistencia/checkout` | Salida con los mismos campos. |
| `GET /api/v1/asistencia/buscar` | Búsqueda de una entrada confirmada dentro del evento. |
| `GET /api/v1/eventos/:id/actividades` | Cronograma. |
| `GET /api/v1/actividades/:id` | Detalle de actividad. |
| `GET /api/v1/calificaciones/mias` | Valoraciones enviadas. |
| `GET /api/v1/eventos/:id/calificaciones/resumen` | Promedios, distribución y opiniones. |
| `PUT /api/v1/calificaciones/:id/respuesta` | Respuesta del organizador/admin. |
| `GET /api/v1/staff/turnos` | Turnos del staff autenticado. |
| `POST /api/v1/staff/turnos` | Asignación de un turno por organizador/admin. |
| `GET /api/v1/usuarios` | Usuarios paginados (admin). |
| `GET /api/v1/usuarios/conteos` | Totales por rol. |
| `GET/PUT /api/v1/configuracion` | Información institucional persistida (admin). |
| `GET /api/v1/metricas/*` | Métricas de la base de datos. |
| `GET /api/v1/reportes/staff` | Eventos asignados e ingresos registrados por staff. |

Las respuestas JSON exitosas usan `{ data, meta? }`; los errores usan `{ error: { code, message, details? } }`. Los listados paginados incluyen `meta.totalPages`. Las fechas se transmiten como ISO 8601 y las vistas las muestran en `America/La_Paz`.

Los access tokens se envían como `Authorization: Bearer ...` y se mantienen en memoria en el frontend. La cookie de refresh usa la ruta `/api/v1/auth`, HttpOnly, SameSite=Lax y Secure en producción. Los permisos protegidos consultan el rol y estado actuales de la cuenta.

## Verificación

```powershell
pnpm --filter scesi-events-backend typecheck
pnpm --filter scesi-events-backend lint
pnpm build:backend
pnpm --filter scesi-events-backend test
pnpm build
pnpm lint
```

Las pruebas de integración requieren PostgreSQL configurado y migrado. Crean sus propios usuarios/eventos con identificadores únicos y los eliminan al finalizar; no usan el seed para las aserciones.
