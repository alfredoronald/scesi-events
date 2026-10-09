# Backend de SCESI Events

API inicial para la vista pública de eventos. Usa Express, TypeScript y PostgreSQL. Por ahora solo publica eventos; no implementa cuentas, inscripciones ni asistencia.

## Estructura

```text
backend/
├── src/
│   ├── config/env.ts              # Variables de entorno
│   ├── db/                        # Conexión y comandos de migración/seed
│   ├── modules/events/            # Rutas, consultas y tipos de eventos
│   ├── app.ts                     # Configuración HTTP
│   └── server.ts                  # Arranque del servidor
├── sql/                           # Esquema y datos de demostración
├── compose.yaml                   # PostgreSQL local opcional
└── .env.example
```

Esta estructura separa HTTP, acceso a datos y configuración sin crear capas innecesarias para una API pequeña. Al añadir inscripciones o asistencia, cada función puede tener su propio módulo junto a `events`.

## Arranque local

Desde la raíz del repositorio:

1. Instala dependencias con `pnpm install`.
2. Copia `backend/.env.example` a `backend/.env`. Los valores de ejemplo son **solo para desarrollo local**; no uses esa contraseña en un servidor público.
3. Inicia PostgreSQL con `docker compose -f backend/compose.yaml up -d db`, o usa tu propia instancia y ajusta `DATABASE_URL`.
4. Ejecuta `pnpm db:migrate`.
5. Opcionalmente, ejecuta `pnpm db:seed` para insertar cinco eventos **ficticios** inspirados en el diseño. No ejecutes el seed en producción.
6. Inicia la API con `pnpm dev:backend`. El frontend puede seguir en `http://localhost:3000`; la API usa `http://localhost:3001`.

Para comprobarla: `curl http://localhost:3001/api/health` y `curl 'http://localhost:3001/api/events?period=upcoming'`.

## Contrato para frontend

| Ruta | Uso |
| --- | --- |
| `GET /api/events?period=upcoming` | Eventos publicados que aún no terminaron, ordenados por inicio ascendente. |
| `GET /api/events?period=past` | Eventos publicados ya terminados, ordenados por fin descendente. |
| `GET /api/events/:id` | Detalle público de un evento por UUID. |
| `GET /api/health` | Comprueba que la API puede consultar la base de datos. |

El listado acepta `limit` (1–50, predeterminado 12) y `offset` (predeterminado 0). La respuesta tiene esta forma:

```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000000",
      "slug": "ejemplo",
      "title": "Título",
      "summary": "Descripción breve",
      "startsAt": "2026-11-01T14:00:00.000Z",
      "endsAt": "2026-11-01T17:00:00.000Z",
      "location": "SCESI UMSS",
      "coverImageUrl": null,
      "participationKind": "organized",
      "registrationUrl": null
    }
  ],
  "pagination": { "period": "upcoming", "limit": 12, "offset": 0, "total": 1 }
}
```

Las fechas son UTC en formato ISO 8601; frontend debe mostrarlas en la zona horaria deseada. `participationKind` puede ser `organized`, `invited` o `staff`. `coverImageUrl` y `registrationUrl` son opcionales. Solo los eventos con `status='published'` aparecen en la API; los borradores quedan ocultos.

La portada de Next.js consulta esta API desde el servidor en cada solicitud. Para desarrollo local usa `http://localhost:3001`; en despliegue se configura `API_BASE_URL` con la dirección interna de la API. Si la API no responde, la portada muestra un aviso y no inventa eventos. Las fotografías usadas por la vista son recursos locales obtenidos del Figma del equipo, no imágenes generadas; las fechas del seed son solo de demostración.

El navegador puede consultar la API directamente desde `http://localhost:3000` porque CORS permite ese origen mediante `FRONTEND_ORIGIN`. Como aún no existe un panel de administración, la creación de eventos se hará temporalmente en PostgreSQL; el endpoint de creación se acordará en una fase posterior.
