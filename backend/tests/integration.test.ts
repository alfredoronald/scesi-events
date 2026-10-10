import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { env } from "../src/config/env.js";
import { createApp } from "../src/app.js";
import { prisma } from "../src/shared/database/prisma.js";

const suffix = randomUUID().slice(0, 8);
const password = "integration1234";
const users: string[] = [];
const events: string[] = [];
const files: string[] = [];
let app: ReturnType<typeof createApp>;
let organizerId: string;
let staffId: string;
let participantId: string;
let adminToken: string;
let organizerToken: string;
let staffToken: string;
let participantToken: string;
let eventId: string;
let otherEventId: string;
let inscriptionId: string;

async function login(email: string) {
  return request(app).post("/api/v1/auth/login").send({ identifier: email, password });
}

beforeAll(async () => {
  app = createApp();
  const hash = await bcrypt.hash(password, 10);
  for (const rol of ["ADMIN", "ORGANIZADOR", "STAFF", "PARTICIPANTE"] as const) {
    const user = await prisma.usuario.create({ data: { nombreCompleto: `Integration ${rol}`, email: `${rol.toLowerCase()}-${suffix}@test.invalid`, username: `${rol.toLowerCase()}-${suffix}`, passwordHash: hash, rol } });
    users.push(user.id);
    const result = await login(user.email);
    expect(result.status).toBe(200);
    const token = result.body.data.accessToken as string;
    if (rol === "ADMIN") adminToken = token;
    if (rol === "ORGANIZADOR") { organizerId = user.id; organizerToken = token; }
    if (rol === "STAFF") { staffId = user.id; staffToken = token; }
    if (rol === "PARTICIPANTE") { participantId = user.id; participantToken = token; }
  }
  for (const title of ["Primary", "Other"]) {
    const event = await prisma.evento.create({ data: { titulo: `Integration ${title} ${suffix}`, slug: `integration-${title.toLowerCase()}-${suffix}`, descripcion: "Integration test event", tipo: "TALLER", modalidad: "PRESENCIAL", fechaInicio: new Date(), fechaFin: new Date(Date.now() + 86400000), lugar: "Test location", estado: "PUBLICADO", organizadorId: organizerId } });
    events.push(event.id);
  }
  [eventId, otherEventId] = events;
  await prisma.evento.update({ where: { id: otherEventId }, data: { esPago: true, precio: 25 } });
  await prisma.eventoStaff.create({ data: { eventoId: eventId, usuarioId: staffId } });
}, 30000);

afterAll(async () => {
  await prisma.inscripcion.deleteMany({ where: { eventoId: { in: events } } });
  await prisma.evento.deleteMany({ where: { id: { in: events } } });
  await prisma.usuario.deleteMany({ where: { id: { in: users } } });
  for (const file of files) await unlink(file).catch(() => {});
  await prisma.$disconnect();
});

describe("Frontend API contracts", () => {
  it("rejects invalid credentials, renews an httpOnly session and revokes logout", async () => {
    const bad = await request(app).post("/api/v1/auth/login").send({ identifier: `participante-${suffix}@test.invalid`, password: "wrong" });
    expect(bad.status).toBe(401);
    const result = await login(`participante-${suffix}@test.invalid`);
    expect(result.status).toBe(200);
    const cookies = result.headers["set-cookie"] as unknown as string[];
    expect(cookies[0]).toContain("HttpOnly");
    expect(cookies[0]).toContain("Path=/api/v1/auth");
    const refreshed = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookies).send({});
    expect(refreshed.status).toBe(200);
    const nextCookies = refreshed.headers["set-cookie"] as unknown as string[];
    expect(nextCookies[0].split(";")[0]).not.toBe(cookies[0].split(";")[0]);
    expect((await request(app).post("/api/v1/auth/logout").set("Cookie", nextCookies).send({})).status).toBe(204);
    expect((await request(app).post("/api/v1/auth/refresh").set("Cookie", nextCookies).send({})).status).toBe(401);
  });

  it("enforces current account status and prevents participants from reading private panels", async () => {
    expect((await request(app).get("/api/v1/usuarios").auth(participantToken, { type: "bearer" })).status).toBe(403);
    expect((await request(app).get("/api/v1/eventos?mios=true").auth(participantToken, { type: "bearer" })).status).toBe(403);
    await prisma.usuario.update({ where: { id: participantId }, data: { activo: false } });
    try { expect((await request(app).get("/api/v1/auth/me").auth(participantToken, { type: "bearer" })).status).toBe(401); }
    finally { await prisma.usuario.update({ where: { id: participantId }, data: { activo: true } }); }
  });

  it("registers a participant and serves their real ticket and QR", async () => {
    const registered = await request(app).post(`/api/v1/eventos/${eventId}/inscripciones`).auth(participantToken, { type: "bearer" }).send({ nombreCompleto: "Integration Participant", email: `participante-${suffix}@test.invalid`, celular: "77777777", consentimientoDatos: true });
    expect(registered.status).toBe(201);
    inscriptionId = registered.body.data.id;
    const mine = await request(app).get("/api/v1/inscripciones/me").auth(participantToken, { type: "bearer" });
    expect(mine.status).toBe(200);
    expect(mine.body.data.some((row: { id: string }) => row.id === inscriptionId)).toBe(true);
    const qr = await request(app).get(`/api/v1/inscripciones/${inscriptionId}/qr`).auth(participantToken, { type: "bearer" });
    expect(qr.status).toBe(200);
    expect(qr.body.data.qrDataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it("persists ingress, checkout and reentry and scopes attendance by event", async () => {
    const endpoint = "/api/v1/asistencia";
    const body = { eventoId: eventId, inscripcionId: inscriptionId, puntoControl: "Puerta norte" };
    expect((await request(app).post(`${endpoint}/checkin-manual`).auth(staffToken, { type: "bearer" }).send({ ...body, eventoId: otherEventId })).status).toBe(404);
    expect((await request(app).post(`${endpoint}/checkin-manual`).auth(staffToken, { type: "bearer" }).send(body)).status).toBe(201);
    const duplicate = await request(app).post(`${endpoint}/checkin-manual`).auth(staffToken, { type: "bearer" }).send(body);
    expect(duplicate.body.data.yaRegistrado).toBe(true);
    const checkout = await request(app).post(`${endpoint}/checkout`).auth(staffToken, { type: "bearer" }).send({ ...body, puntoControl: "Salida principal" });
    expect(checkout.status).toBe(200);
    expect(checkout.body.data.horaCheckout).toBeTruthy();
    const outside = await request(app).get(`/api/v1/eventos/${eventId}/asistencia?estado=salieron`).auth(staffToken, { type: "bearer" });
    expect(outside.body.data[0].checkedOutAt).toBeTruthy();
    expect((await request(app).post(`${endpoint}/checkin-manual`).auth(staffToken, { type: "bearer" }).send(body)).body.data.yaRegistrado).toBe(false);
    const inside = await request(app).get(`/api/v1/eventos/${eventId}/asistencia?estado=dentro`).auth(organizerToken, { type: "bearer" });
    expect(inside.body.data[0].checkedOutAt).toBeNull();
    expect(inside.body.data[0].lastRecord).toBe("Puerta norte");
    expect(await prisma.movimientoAsistencia.count({ where: { asistencia: { inscripcionId: inscriptionId } } })).toBe(3);
  });

  it("stores ratings and organizer replies and rejects duplicate ratings", async () => {
    const rating = await request(app).post(`/api/v1/eventos/${eventId}/calificaciones`).auth(participantToken, { type: "bearer" }).send({ score: 5, comentario: "Excellent integration" });
    expect(rating.status).toBe(201);
    expect((await request(app).post(`/api/v1/eventos/${eventId}/calificaciones`).auth(participantToken, { type: "bearer" }).send({ score: 4 })).status).toBe(409);
    const reply = await request(app).put(`/api/v1/calificaciones/${rating.body.data.id}/respuesta`).auth(organizerToken, { type: "bearer" }).send({ respuesta: "Thank you" });
    expect(reply.status).toBe(200);
    const summary = await request(app).get(`/api/v1/eventos/${eventId}/calificaciones/resumen`).auth(organizerToken, { type: "bearer" });
    expect(summary.body.data.comentarios[0].respuesta).toBe("Thank you");
    expect((await request(app).get("/api/v1/calificaciones/mias").auth(participantToken, { type: "bearer" })).body.data[0].eventoId).toBe(eventId);
  });

  it("returns admin metrics and persists staff shifts", async () => {
    const shift = await request(app).post("/api/v1/staff/turnos").auth(organizerToken, { type: "bearer" }).send({ eventoId: eventId, usuarioId: staffId, titulo: "Entry control", lugar: "Main entrance", inicio: new Date().toISOString(), fin: new Date(Date.now() + 3600000).toISOString() });
    expect(shift.status).toBe(200);
    expect((await request(app).get("/api/v1/staff/turnos").auth(staffToken, { type: "bearer" })).body.data.some((row: { id: string }) => row.id === shift.body.data.id)).toBe(true);
    for (const path of ["/metricas/eventos", "/metricas/asistencias-mensuales", "/reportes/staff", "/configuracion", "/usuarios/conteos"]) {
      expect((await request(app).get(`/api/v1${path}`).auth(adminToken, { type: "bearer" })).status, path).toBe(200);
    }
  });

  it("uploads an authorized receipt and enables the QR only after payment confirmation", async () => {
    const entry = await request(app).post(`/api/v1/eventos/${otherEventId}/inscripciones`).auth(participantToken, { type: "bearer" }).send({ nombreCompleto: "Integration Participant", email: `participante-${suffix}@test.invalid`, celular: "77777777", consentimientoDatos: true });
    expect(entry.status).toBe(201);
    const id = entry.body.data.id as string;
    expect((await request(app).get(`/api/v1/inscripciones/${id}/qr`).auth(participantToken, { type: "bearer" })).status).toBe(422);
    const receipt = await request(app).post(`/api/v1/inscripciones/${id}/comprobante`).auth(participantToken, { type: "bearer" }).set("Content-Type", "application/pdf").send(Buffer.from("%PDF-1.4\nIntegration receipt\n%%EOF"));
    expect(receipt.status).toBe(200);
    files.push(resolve(env.storage.localDir, "comprobantes", basename(receipt.body.data.comprobanteUrl)));
    const download = await request(app).get(`/api/v1/inscripciones/${id}/comprobante`).auth(organizerToken, { type: "bearer" });
    expect(download.status).toBe(200);
    expect(download.headers["content-type"]).toContain("application/pdf");
    expect((await request(app).get(`/api/v1/inscripciones/${id}/comprobante`).auth(staffToken, { type: "bearer" })).status).toBe(403);
    expect((await request(app).patch(`/api/v1/inscripciones/${id}/pago`).auth(organizerToken, { type: "bearer" }).send({ estado: "confirmado" })).status).toBe(200);
    expect((await request(app).get(`/api/v1/inscripciones/${id}/qr`).auth(participantToken, { type: "bearer" })).status).toBe(200);
  });

  it("persists organization settings and restricts editing to administrators", async () => {
    const previous = await prisma.configuracionOrganizacion.findUnique({ where: { id: 1 } });
    const input = { name: `Integration ${suffix}`, email: "organization@test.invalid", location: "Integration office", description: "Integration settings" };
    try {
      expect((await request(app).put("/api/v1/configuracion").auth(organizerToken, { type: "bearer" }).send(input)).status).toBe(403);
      expect((await request(app).put("/api/v1/configuracion").auth(adminToken, { type: "bearer" }).send(input)).status).toBe(200);
      expect((await request(app).get("/api/v1/configuracion").auth(adminToken, { type: "bearer" })).body.data.name).toBe(input.name);
    } finally {
      if (previous) await prisma.configuracionOrganizacion.update({ where: { id: 1 }, data: previous });
      else await prisma.configuracionOrganizacion.deleteMany({ where: { id: 1 } });
    }
  });
});
