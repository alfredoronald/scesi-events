import { Router } from "express";
import { resolve, basename } from "node:path";
import { env } from "../../config/env.js";
import { z } from "zod";
import { prisma } from "../../shared/database/prisma.js";
import { requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import { ok } from "../../shared/http/responses.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";

const settingsSchema = z.object({ name: z.string().trim().min(1).max(160), email: z.string().trim().email().max(255), location: z.string().trim().min(1).max(200), description: z.string().trim().min(1).max(5000) });
const defaultSettings = { name: "SCESI", email: "contacto@scesi.org", location: "FCyT — UMSS, Cochabamba", description: "Sociedad Científica de Estudiantes de Sistemas" };

export function buildIntegracionRouter() {
  const router = Router();
  router.get("/inscripciones/:id/comprobante", requireAuth, validate({ params: z.object({ id: z.string().uuid() }) }), async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const row = await prisma.inscripcion.findUnique({ where: { id }, include: { evento: true } });
    if (!row?.comprobanteUrl) throw new NotFoundError("Comprobante");
    if (req.user!.rol !== "ADMIN" && row.usuarioId !== req.user!.id && row.evento.organizadorId !== req.user!.id) throw new ForbiddenError();
    res.type("application/pdf").sendFile(resolve(env.storage.localDir, "comprobantes", basename(row.comprobanteUrl)));
  });
  router.get("/staff/turnos", requireAuth, requireRole("STAFF"), async (req, res) => {
    ok(res, await prisma.turnoStaff.findMany({ where: { usuarioId: req.user!.id }, orderBy: { inicio: "asc" } }));
  });
  const shiftSchema = z.object({ eventoId: z.string().uuid(), usuarioId: z.string().uuid(), titulo: z.string().min(3).max(160), lugar: z.string().min(1).max(200), inicio: z.coerce.date(), fin: z.coerce.date() }).refine((shift) => shift.fin > shift.inicio, { message: "Fin debe ser posterior a inicio", path: ["fin"] });
  router.post("/staff/turnos", requireAuth, requireRole("ADMIN", "ORGANIZADOR"), validate({ body: shiftSchema }), async (req, res) => {
    const data = req.validated.body as z.infer<typeof shiftSchema>;
    const event = await prisma.evento.findUnique({ where: { id: data.eventoId } });
    if (!event) throw new NotFoundError("Evento");
    if (req.user!.rol !== "ADMIN" && event.organizadorId !== req.user!.id) throw new ForbiddenError();
    const assignment = await prisma.eventoStaff.findUnique({ where: { eventoId_usuarioId: { eventoId: data.eventoId, usuarioId: data.usuarioId } } });
    if (!assignment) throw new NotFoundError("Asignación de staff");
    ok(res, await prisma.turnoStaff.create({ data }));
  });
  router.get("/reportes/staff", requireAuth, requireRole("ADMIN"), async (_req, res) => {
    const staff = await prisma.usuario.findMany({ where: { rol: "STAFF" }, select: { id: true, nombreCompleto: true, _count: { select: { eventosAsignado: true, asistenciasRegistradas: true } } } });
    ok(res, staff.map((user) => ({ nombre: user.nombreCompleto, eventos: user._count.eventosAsignado, ingresos: user._count.asistenciasRegistradas })));
  });
  router.get("/actividades/:id", requireAuth, validate({ params: z.object({ id: z.string().uuid() }) }), async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const row = await prisma.actividad.findUnique({ where: { id }, include: { evento: true } });
    if (!row) throw new NotFoundError("Actividad");
    if (row.evento.estado === "BORRADOR" && req.user!.rol !== "ADMIN" && row.evento.organizadorId !== req.user!.id) throw new NotFoundError("Actividad");
    const { evento: _evento, ...activity } = row;
    ok(res, activity);
  });
  router.get("/configuracion", requireAuth, requireRole("ADMIN"), async (_req, res) => {
    ok(res, await prisma.configuracionOrganizacion.findUnique({ where: { id: 1 } }) ?? defaultSettings);
  });
  router.put("/configuracion", requireAuth, requireRole("ADMIN"), validate({ body: settingsSchema }), async (req, res) => {
    const data = req.validated.body as z.infer<typeof settingsSchema>;
    ok(res, await prisma.configuracionOrganizacion.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data }));
  });
  router.get("/calificaciones/mias", requireAuth, async (req, res) => {
    const rows = await prisma.calificacionEvento.findMany({ where: { inscripcion: { usuarioId: req.user!.id } }, include: { inscripcion: { include: { evento: true } } }, orderBy: { createdAt: "desc" } });
    ok(res, rows.map((row) => ({ id: row.id, eventoId: row.inscripcion.eventoId, titulo: row.inscripcion.evento.titulo, score: row.general, comentario: row.comentario, fecha: row.createdAt.toISOString() })));
  });
  router.put("/calificaciones/:id/respuesta", requireAuth, requireRole("ADMIN", "ORGANIZADOR"), validate({ params: z.object({ id: z.string().uuid() }), body: z.object({ respuesta: z.string().trim().min(1).max(2000) }) }), async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const row = await prisma.calificacionEvento.findUnique({ where: { id }, include: { inscripcion: { include: { evento: true } } } });
    if (!row) throw new NotFoundError("Calificación");
    if (req.user!.rol !== "ADMIN" && row.inscripcion.evento.organizadorId !== req.user!.id) throw new ForbiddenError();
    ok(res, await prisma.calificacionEvento.update({ where: { id }, data: req.validated.body as { respuesta: string } }));
  });
  return router;
}
