
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261010);

const NOMBRES = ["Andrea","Diego","María","Luis","Valentina","Jorge","Camila","Rodrigo","Fernanda","Óscar","Gabriela","Miguel","Daniela","Iván","Paula","Héctor","Bruno","Sofía","Kevin","Nayeli"];
const APELLIDOS = ["Mendoza","Salazar","Rojas","Torrico","Vargas","Quispe","Peñaranda","Flores","Mamani","Céspedes","Aguilar","Ríos","Sejas","Villarroel","Copacati","Terceros","López","Fernández","Guzmán","Ayala"];
const CARRERAS = ["Ingeniería de Sistemas","Ingeniería Informática","Ciencias de la Computación","Telecomunicaciones","Ingeniería Electrónica"];
const UNIVERSIDADES = ["UMSS","UNIVALLE","UMSA","UTO","UCB"];
const LUGARES = ["FCyT — UMSS","Auditorio MEMI","Laboratorio 3 — FCyT","Coliseo Cobija","Aula Magna","Auditorio FCyT"];

function persona(i: number) {
  const n = NOMBRES[i % NOMBRES.length]!;
  const a1 = APELLIDOS[Math.floor(i / NOMBRES.length) % APELLIDOS.length]!;
  const a2 = APELLIDOS[(i * 7) % APELLIDOS.length]!;
  return {
    nombre: `${n} ${a1} ${a2}`,
    email: `${n.toLowerCase()}.${a1.toLowerCase()}${i}@correo.com`,
    celular: `+591 7${String(1000000 + (i * 137) % 9000000)}`,
    carrera: CARRERAS[i % CARRERAS.length]!,
    universidad: UNIVERSIDADES[i % UNIVERSIDADES.length]!,
  };
}

const password = await bcrypt.hash("demo1234", 10);
const passwordAdmin = await bcrypt.hash("admin1234", 10);

function hace(dias: number, hora = 9, minuto = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, minuto, 0, 0);
  return d;
}
function en(dias: number, hora = 9, minuto = 0): Date {
  return hace(-dias, hora, minuto);
}

async function main(): Promise<void> {
  console.log("Limpiando base de datos…");
  await prisma.$transaction([
    prisma.publicacionComentario.deleteMany(),
    prisma.publicacionLike.deleteMany(),
    prisma.publicacionCategoria.deleteMany(),
    prisma.categoria.deleteMany(),
    prisma.publicacion.deleteMany(),
    prisma.proyectoColaborador.deleteMany(),
    prisma.proyecto.deleteMany(),
    prisma.certificado.deleteMany(),
    prisma.calificacionActividad.deleteMany(),
    prisma.calificacionEvento.deleteMany(),
    prisma.participacion.deleteMany(),
    prisma.asistencia.deleteMany(),
    prisma.inscripcion.deleteMany(),
    prisma.actividad.deleteMany(),
    prisma.eventoStaff.deleteMany(),
    prisma.evento.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);

  console.log("Creando usuarios…");
  const admin = await prisma.usuario.create({
    data: { nombreCompleto: "Marco Rivero", username: "marco", email: "marco@scesi.org", passwordHash: passwordAdmin, rol: "ADMIN", carrera: "Ingeniería de Sistemas", universidad: "UMSS" },
  });
  const organizadora = await prisma.usuario.create({
    data: { nombreCompleto: "Elena Salinas", username: "elena", email: "elena@scesi.org", passwordHash: password, rol: "ORGANIZADOR", carrera: "Ingeniería de Sistemas", universidad: "UMSS" },
  });
  const organizador2 = await prisma.usuario.create({
    data: { nombreCompleto: "Ronald Flores", username: "ronald", email: "ronald@scesi.org", passwordHash: password, rol: "ORGANIZADOR", carrera: "Ingeniería Informática", universidad: "UMSS" },
  });
  const staff1 = await prisma.usuario.create({
    data: { nombreCompleto: "Carlos Vargas", username: "carlos", email: "carlos@scesi.org", passwordHash: password, rol: "STAFF", carrera: "Ingeniería de Sistemas", universidad: "UMSS" },
  });
  const staff2 = await prisma.usuario.create({
    data: { nombreCompleto: "Daniela Sejas", username: "daniela", email: "daniela@scesi.org", passwordHash: password, rol: "STAFF" },
  });
  const andrea = await prisma.usuario.create({
    data: { nombreCompleto: "Andrea Mendoza", username: "andrea", email: "andrea@correo.com", passwordHash: password, rol: "PARTICIPANTE", celular: "+591 70000001", carrera: "Ingeniería de Sistemas", universidad: "UMSS" },
  });
  await prisma.usuario.create({ data: { nombreCompleto: "Diego Salazar", username: "diego", email: "diego@correo.com", passwordHash: password, rol: "PARTICIPANTE", universidad: "UMSS" } });
  await prisma.usuario.create({ data: { nombreCompleto: "María Rojas", username: "maria", email: "maria@correo.com", passwordHash: password, rol: "PARTICIPANTE", universidad: "UNIVALLE" } });
  await prisma.usuario.create({ data: { nombreCompleto: "Luis Torrico", username: "luis", email: "luis@correo.com", passwordHash: password, rol: "PARTICIPANTE", universidad: "UMSS" } });
  await prisma.usuario.create({ data: { nombreCompleto: "Camila Peñaranda", username: "camila", email: "camila@correo.com", passwordHash: password, rol: "PARTICIPANTE", universidad: "UMSA", activo: false } });

  console.log("Creando eventos…");
  const hackathon = await prisma.evento.create({ data: {
    slug: "hackathon-scesi-2026", titulo: "Hackathon SCESI 2026",
    descripcion: "24 horas para convertir ideas en soluciones. Forma tu equipo, elige un reto y construye algo que importe.",
    tipo: "HACKATHON", modalidad: "PRESENCIAL", fechaInicio: en(0, 8), fechaFin: en(1, 18),
    lugar: "FCyT — UMSS", cupoMaximo: 300, estado: "EN_CURSO",
    participacionScesi: "ORGANIZED", entregaCertificado: true, certificadoA: "TODOS",
    imagenUrl: "/events/hackathon-scesi.jpg", organizadorId: organizadora.id,
  } });
  const devtalks = await prisma.evento.create({ data: {
    slug: "devtalks-ia-sin-humo", titulo: "DevTalks: IA sin humo",
    descripcion: "Una conversación directa sobre inteligencia artificial, sus posibilidades reales y cómo empezar a crear con ella.",
    tipo: "CHARLA", modalidad: "MIXTO", fechaInicio: en(7, 18, 30), fechaFin: en(7, 21),
    lugar: "Auditorio MEMI", enlaceVirtual: "https://meet.scesi.org/devtalks", cupoMaximo: 180, estado: "PUBLICADO",
    imagenUrl: "/events/devtalks-ia-sin-humo.jpg", organizadorId: organizadora.id,
  } });
  const feria = await prisma.evento.create({ data: {
    slug: "feria-internacional-del-libro", titulo: "Feria Internacional del Libro",
    descripcion: "Stand abierto para conversar sobre tecnología, comunidad y las oportunidades que construimos desde SCESI.",
    tipo: "CONGRESO", modalidad: "PRESENCIAL", fechaInicio: en(2), fechaFin: en(12),
    lugar: "FECO, Cochabamba", cupoMaximo: 150, estado: "PUBLICADO", participacionScesi: "INVITED", organizadorId: organizador2.id,
  } });
  await prisma.evento.create({ data: {
    slug: "scesi-noel", titulo: "SCESI Noel",
    descripcion: "El tradicional festejo navideño de la comunidad con intercambio de regalos y cierre de año.",
    tipo: "TALLER", modalidad: "PRESENCIAL", fechaInicio: en(70), fechaFin: en(70, 22),
    lugar: "FCyT — UMSS", estado: "PUBLICADO", imagenUrl: "/events/scesi-noel.jpg", organizadorId: organizadora.id,
  } });
  const tallerGit = await prisma.evento.create({ data: {
    slug: "taller-git-github", titulo: "Taller de Git & GitHub",
    descripcion: "Controla tus proyectos sin miedo: flujo de trabajo, ramas, pull requests y colaboración en equipo.",
    tipo: "TALLER", modalidad: "VIRTUAL", fechaInicio: en(16, 19), fechaFin: en(16, 21),
    lugar: "En línea", enlaceVirtual: "https://meet.scesi.org/git", cupoMaximo: 40, estado: "PUBLICADO",
    organizadorId: organizadora.id,
  } });
  await prisma.evento.create({ data: {
    slug: "ctf-scesi", titulo: "CTF SCESI",
    descripcion: "Competencia capture the flag de seguridad informática: web, cripto, forense y reversing.",
    tipo: "CTF", modalidad: "VIRTUAL", fechaInicio: en(30, 9), fechaFin: en(31, 18),
    lugar: "En línea", enlaceVirtual: "https://ctf.scesi.org", estado: "PUBLICADO", entregaCertificado: true, certificadoA: "TODOS",
    organizadorId: organizador2.id,
  } });
  const pythonPago = await prisma.evento.create({ data: {
    slug: "taller-python-datos", titulo: "Taller de Python para Datos",
    descripcion: "De cero a tus primeros análisis con pandas y visualización. Incluye material y certificado.",
    tipo: "TALLER", modalidad: "MIXTO", fechaInicio: en(21, 9), fechaFin: en(21, 13),
    lugar: "Laboratorio 3 — FCyT", esPago: true, precio: 50, cupoMaximo: 60, estado: "PUBLICADO",
    entregaCertificado: true, organizadorId: organizadora.id,
  } });
  await prisma.evento.create({ data: {
    slug: "linux-week-2026", titulo: "Linux Week 2026",
    descripcion: "Una semana de charlas y talleres sobre software libre.",
    tipo: "CONGRESO", modalidad: "PRESENCIAL", fechaInicio: en(40), fechaFin: en(44),
    lugar: "Auditorio FCyT", cupoMaximo: 250, estado: "BORRADOR", organizadorId: organizadora.id,
  } });

  // Eventos pasados (CERRADO) con historial completo
  const pasados = [
    { slug: "programming-day-2026", titulo: "Programming Day 2026", tipo: "CONGRESO" as const, dias: 200, inscritos: 300, offset: 0, cert: true, organizador: organizadora.id },
    { slug: "game-jam-scesi", titulo: "Game Jam SCESI", tipo: "HACKATHON" as const, dias: 120, inscritos: 96, offset: 0, cert: true, organizador: organizadora.id },
    { slug: "techzone-2025", titulo: "TechZone 2025", tipo: "CONGRESO" as const, dias: 320, inscritos: 210, offset: 50, cert: false, organizador: organizador2.id },
    { slug: "scesi-open-day", titulo: "SCESI Open Day", tipo: "CHARLA" as const, dias: 160, inscritos: 145, offset: 100, cert: false, organizador: organizadora.id },
    { slug: "hackathon-invierno", titulo: "Hackathon de Invierno", tipo: "HACKATHON" as const, dias: 60, inscritos: 72, offset: 150, cert: true, organizador: organizadora.id },
    { slug: "flisol-2026", titulo: "FLISoL 2026", tipo: "CONGRESO" as const, dias: 190, inscritos: 180, offset: 200, cert: false, organizador: organizador2.id },
  ];
  const eventosPasados: Array<{ id: string; titulo: string; fechaInicio: Date; cert: boolean; inscritos: number; offset: number }> = [];
  for (const p of pasados) {
    const inicio = hace(p.dias, 8);
    const ev = await prisma.evento.create({ data: {
      slug: p.slug, titulo: p.titulo,
      descripcion: `${p.titulo}: una actividad de la comunidad SCESI.`,
      tipo: p.tipo, modalidad: p.offset % 3 === 0 ? "PRESENCIAL" : p.offset % 3 === 1 ? "MIXTO" : "VIRTUAL",
      fechaInicio: inicio, fechaFin: new Date(inicio.getTime() + 8 * 3600 * 1000),
      lugar: LUGARES[p.offset % LUGARES.length]!, cupoMaximo: p.inscritos + 40, estado: "CERRADO",
      participacionScesi: p.slug.startsWith("flisol") ? "INVITED" : "ORGANIZED",
      entregaCertificado: p.cert, certificadoA: "TODOS", organizadorId: p.organizador,
    } });
    eventosPasados.push({ id: ev.id, titulo: ev.titulo, fechaInicio: inicio, cert: p.cert, inscritos: p.inscritos, offset: p.offset });
  }

  console.log("Asignando staff…");
  await prisma.eventoStaff.createMany({ data: [
    { eventoId: hackathon.id, usuarioId: staff1.id },
    { eventoId: hackathon.id, usuarioId: staff2.id },
    { eventoId: devtalks.id, usuarioId: staff1.id },
    { eventoId: tallerGit.id, usuarioId: staff2.id },
    { eventoId: pythonPago.id, usuarioId: staff1.id },
    { eventoId: eventosPasados[0]!.id, usuarioId: staff1.id },
    { eventoId: eventosPasados[1]!.id, usuarioId: staff2.id },
  ] });

  console.log("Creando actividades del hackathon…");
  const charlaIa = await prisma.actividad.create({ data: {
    eventoId: hackathon.id, titulo: "IA aplicada: de la idea al prototipo",
    descripcion: "Cómo pasar de una idea a un prototipo funcional con IA.",
    ponente: "Valeria Pinto", lugar: "Auditorio A",
    horaInicio: en(0, 10, 15), horaFin: en(0, 11, 15), tipo: "charla",
  } });
  const cronograma = [
    { titulo: "Registro y acreditación", ponente: "Staff de registro", lugar: "Acceso principal", h: 0, tipo: "logística" },
    { titulo: "Ceremonia de apertura", ponente: "Directiva SCESI", lugar: "Auditorio A", h: 1, tipo: "ceremonia" },
    { titulo: "Almuerzo y networking", ponente: "Staff logístico", lugar: "Patio central", h: 4, tipo: "networking" },
    { titulo: "Inicio de retos", ponente: "Mentores", lugar: "Laboratorios 1-4", h: 6, tipo: "competencia" },
  ];
  await prisma.actividad.createMany({
    data: cronograma.map((a) => ({
      eventoId: hackathon.id, titulo: a.titulo, descripcion: a.titulo, ponente: a.ponente, lugar: a.lugar,
      horaInicio: en(0, 8 + a.h), horaFin: en(0, 8 + a.h + 1), tipo: a.tipo,
    })),
  });
  // Actividades de eventos pasados (para el ranking de métricas)
  for (const pasado of eventosPasados.slice(0, 3)) {
    await prisma.actividad.createMany({
      data: [0, 1, 2].map((j) => ({
        eventoId: pasado.id, titulo: `Charla ${j + 1} de ${pasado.titulo}`,
        descripcion: `Charla ${j + 1}`, ponente: `${NOMBRES[j]!} ${APELLIDOS[j + 3]!}`,
        lugar: "Auditorio A",
        horaInicio: new Date(pasado.fechaInicio.getTime() + (j + 1) * 3600000),
        horaFin: new Date(pasado.fechaInicio.getTime() + (j + 2) * 3600000),
        tipo: "charla",
      })),
    });
  }

  console.log("Creando inscripciones…");
  let codigoSeq = 1;
  const codigo = (): string => `SC-${String(codigoSeq++).padStart(4, "0")}`;
  const token = (): string => randomBytes(24).toString("base64url");

  let personaSeq = 0;
  const siguientePersona = () => persona(personaSeq++);

  async function inscribir(data: {
    eventoId: string; usuarioId?: string; nombre: string; email: string; celular?: string;
    carrera?: string; universidad?: string; estadoPago?: "NO_APLICA" | "PENDIENTE" | "CONFIRMADO" | "RECHAZADO";
    qr?: boolean; comprobante?: string; createdAt?: Date;
  }): Promise<string> {
    const inscripcion = await prisma.inscripcion.create({ data: {
      eventoId: data.eventoId, ...(data.usuarioId ? { usuarioId: data.usuarioId } : {}),
      nombreCompleto: data.nombre, email: data.email.toLowerCase(),
      celular: data.celular ?? "+591 70000000",
      ...(data.carrera ? { carrera: data.carrera } : {}), ...(data.universidad ? { universidad: data.universidad } : {}),
      consentimientoDatos: true, aceptaComunicaciones: rand() < 0.6,
      estadoPago: data.estadoPago ?? "NO_APLICA", codigo: codigo(),
      ...(data.qr === false ? {} : { qrToken: token() }),
      ...(data.comprobante ? { comprobanteUrl: data.comprobante } : {}),
      ...(data.createdAt ? { createdAt: data.createdAt } : {}),
    } });
    return inscripcion.id;
  }

  // ── Eventos pasados: rangos solapados de personas → recurrencia natural ──
  const idsPorEventoPasado = new Map<string, string[]>();
  for (const pasado of eventosPasados) {
    const ids: string[] = [];
    // El 60 % del aforo sale del "banco recurrente" (primeras 300 personas ya
    // usadas en otros eventos), el resto son personas nuevas.
    const recurrentes = Math.floor(pasado.inscritos * 0.6);
    for (let i = 0; i < pasado.inscritos; i += 1) {
      const p = i < recurrentes && pasado.offset > 0 ? persona(i % Math.min(personaSeq, 300)) : siguientePersona();
      const id = await inscribir({
        eventoId: pasado.id, nombre: p.nombre, email: p.email, celular: p.celular,
        carrera: p.carrera, universidad: p.universidad,
        createdAt: new Date(pasado.fechaInicio.getTime() - ((i % 20) + 1) * 86400000),
      });
      ids.push(id);
    }
    idsPorEventoPasado.set(pasado.id, ids);
  }
  // Historial de Andrea (para sus calificaciones y certificados)
  for (const pasado of [eventosPasados[1]!, eventosPasados[3]!]) {
    const id = await inscribir({
      eventoId: pasado.id, usuarioId: andrea.id, nombre: "Andrea Mendoza", email: "andrea@correo.com",
      celular: "+591 70000001", carrera: "Ingeniería de Sistemas", universidad: "UMSS",
      createdAt: new Date(pasado.fechaInicio.getTime() - 10 * 86400000),
    });
    const ids = idsPorEventoPasado.get(pasado.id) ?? [];
    ids.push(id);
    idsPorEventoPasado.set(pasado.id, ids);
  }

  // ── Hackathon en curso: 248 inscritos ──
  const hackathonIds: string[] = [];
  hackathonIds.push(await inscribir({
    eventoId: hackathon.id, usuarioId: andrea.id, nombre: "Andrea Mendoza", email: "andrea@correo.com",
    celular: "+591 70000001", carrera: "Ingeniería de Sistemas", universidad: "UMSS",
    createdAt: hace(18, 14, 32),
  }));
  await inscribir({ eventoId: hackathon.id, nombre: "Diego Salazar", email: "diego@correo.com", celular: "+591 70000002", universidad: "UMSS", createdAt: hace(20, 9, 15) });
  await inscribir({ eventoId: hackathon.id, nombre: "María Rojas", email: "maria@correo.com", celular: "+591 70000003", universidad: "UNIVALLE", createdAt: hace(16, 18, 8) });
  await inscribir({ eventoId: hackathon.id, nombre: "Luis Torrico", email: "luis@correo.com", celular: "+591 70000004", universidad: "UMSS", estadoPago: "RECHAZADO", qr: false, createdAt: hace(30, 11, 40) });
  const emailsHackathon = new Set(["andrea@correo.com", "diego@correo.com", "maria@correo.com", "luis@correo.com"]);
  for (let i = 0; i < 244; i += 1) {
    let recurrente = i % 3 === 0 && personaSeq > 0 ? persona((i * 5) % Math.min(personaSeq, 300)) : siguientePersona();
    if (emailsHackathon.has(recurrente.email)) recurrente = siguientePersona();
    emailsHackathon.add(recurrente.email);
    hackathonIds.push(await inscribir({
      eventoId: hackathon.id, nombre: recurrente.nombre, email: recurrente.email, celular: recurrente.celular,
      carrera: recurrente.carrera, universidad: recurrente.universidad,
      createdAt: hace((i % 20) + 1, 9 + (i % 10), (i * 7) % 60),
    }));
  }

  // ── Taller pago: 12 confirmados con comprobante + 6 pendientes ──
  for (let i = 0; i < 18; i += 1) {
    const p = siguientePersona();
    await inscribir({
      eventoId: pythonPago.id, nombre: p.nombre, email: p.email, celular: p.celular,
      carrera: p.carrera, universidad: p.universidad,
      estadoPago: i < 12 ? "CONFIRMADO" : "PENDIENTE", qr: i < 12,
      ...(i < 12 ? { comprobante: "/files/comprobantes/demo.pdf" } : {}),
      createdAt: hace((i % 10) + 1),
    });
  }
  // ── Otros eventos activos ──
  for (let i = 0; i < 40; i += 1) { const p = siguientePersona(); await inscribir({ eventoId: tallerGit.id, nombre: p.nombre, email: p.email, carrera: p.carrera, universidad: p.universidad, createdAt: hace((i % 12) + 1) }); }
  for (let i = 0; i < 25; i += 1) { const p = siguientePersona(); await inscribir({ eventoId: devtalks.id, nombre: p.nombre, email: p.email, carrera: p.carrera, universidad: p.universidad, createdAt: hace((i % 8) + 1) }); }
  for (let i = 0; i < 45; i += 1) { const p = siguientePersona(); await inscribir({ eventoId: feria.id, nombre: p.nombre, email: p.email, carrera: p.carrera, universidad: p.universidad, createdAt: hace((i % 6) + 1) }); }

  console.log("Registrando asistencias y calificaciones…");
  const comentarios = [
    "Excelente organización y muy buenas mentorías.",
    "Muy buenas charlas y excelente ambiente.",
    "Contenido práctico y buenos expositores.",
    "Fue mi primer evento y el staff siempre estuvo disponible.",
    "Los retos estuvieron muy bien planteados. Mejoraría los tiempos.",
    "Gran nivel de los ponentes, felicidades.",
  ];
  let totalAsistencias = 0;
  let totalCalificaciones = 0;
  for (const pasado of eventosPasados) {
    for (const inscripcionId of idsPorEventoPasado.get(pasado.id) ?? []) {
      if (rand() > 0.75) continue;
      const hora = new Date(pasado.fechaInicio.getTime() + Math.floor(rand() * 3) * 3600000 + Math.floor(rand() * 60) * 60000);
      await prisma.asistencia.create({ data: { inscripcionId, horaCheckin: hora, registradoPorId: rand() < 0.5 ? staff1.id : staff2.id } });
      totalAsistencias += 1;
      if (rand() < 0.6) {
        const score = rand() < 0.72 ? 5 : rand() < 0.6 ? 4 : 3;
        await prisma.calificacionEvento.create({ data: {
          inscripcionId, organizacion: score, contenido: score, general: score,
          nps: score === 5 ? 10 : score === 4 ? 8 : 6,
          ...(rand() < 0.35 ? { comentario: comentarios[Math.floor(rand() * comentarios.length)] } : {}),
        } });
        totalCalificaciones += 1;
      }
    }
  }

  // Hackathon (en curso): ingresan casi todos (Andrea sí, María no)
  const hackathonInscritas = await prisma.inscripcion.findMany({
    where: { eventoId: hackathon.id, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
    include: { asistencia: true },
  });
  let hackathonAsistencias = 0;
  for (const ins of hackathonInscritas) {
    if (ins.email === "maria@correo.com") continue;
    if (rand() < 0.1) continue;
    const hora = new Date();
    hora.setHours(8 + (hackathonAsistencias % 5), (hackathonAsistencias * 13) % 60, 0, 0);
    await prisma.asistencia.create({ data: { inscripcionId: ins.id, horaCheckin: hora, registradoPorId: hackathonAsistencias % 2 === 0 ? staff1.id : staff2.id } });
    hackathonAsistencias += 1;
  }
  console.log(`  Hackathon: ${hackathonAsistencias} asistencias.`);

  // Participaciones en la charla de IA (todas con asistencia)
  const conAsistencia = await prisma.inscripcion.findMany({
    where: { eventoId: hackathon.id }, include: { asistencia: true }, take: 60,
  });
  let participantes = 0;
  for (const ins of conAsistencia) {
    if (!ins.asistencia) continue;
    if (participantes >= 40) break;
    await prisma.participacion.create({ data: { actividadId: charlaIa.id, inscripcionId: ins.id, rol: participantes % 9 === 0 ? "PONENTE" : "ASISTENTE" } });
    participantes += 1;
  }
  // Participaciones en actividades de eventos pasados
  for (const pasado of eventosPasados.slice(0, 3)) {
    const acts = await prisma.actividad.findMany({ where: { eventoId: pasado.id } });
    const ids = idsPorEventoPasado.get(pasado.id) ?? [];
    for (const [i, inscripcionId] of ids.slice(0, 30).entries()) {
      const act = acts[i % acts.length];
      if (!act) continue;
      await prisma.participacion.create({ data: { actividadId: act.id, inscripcionId, rol: i % 10 === 0 ? "PONENTE" : "ASISTENTE" } });
    }
  }

  console.log("Emitiendo certificados históricos…");
  let certificados = 0;
  for (const pasado of eventosPasados.filter((p) => p.cert)) {
    const elegibles = await prisma.inscripcion.findMany({
      where: { eventoId: pasado.id, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
      include: { asistencia: true, certificado: true },
    });
    for (const ins of elegibles) {
      if (!ins.asistencia || ins.certificado) continue;
      if (rand() < 0.8) {
        await prisma.certificado.create({ data: {
          inscripcionId: ins.id,
          codigoVerificacion: `SCESI-${String(1000 + (certificados % 9000))}-${String(1000 + ((certificados * 7) % 9000))}`,
        } });
        certificados += 1;
      }
    }
  }

  console.log("Creando proyectos…");
  await prisma.proyecto.createMany({ data: [
    { titulo: "Feria Internacional del Libro", descripcion: "Stand interactivo de SCESI con demos de proyectos estudiantiles y distribución de materiales.", imagenUrl: "/projects/proyecto-feria-libro.jpg", categoria: "Proyecto activo", publicado: true, creadoPorId: organizadora.id },
    { titulo: "SCESI Noel", descripcion: "Organización del festejo navideño anual de la comunidad: actividades, decoración e intercambio.", imagenUrl: "/projects/proyecto-scesi-noel.jpg", categoria: "Proyecto activo", publicado: true, creadoPorId: organizadora.id },
    { titulo: "Semana Tecnológica", descripcion: "Coordinación integral de la semana tecnológica: speakers, patrocinadores y transmisión en vivo.", imagenUrl: "/projects/proyecto-semana-tec.jpg", categoria: "Proyecto activo", publicado: true, creadoPorId: admin.id },
    { titulo: "Sistema de acceso con QR", descripcion: "Herramienta interna de control de acceso para eventos (en curso, no publicado).", publicado: false, creadoPorId: admin.id },
  ] });

  console.log("Creando publicaciones…");
  const slugify = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const blogs = [
    { titulo: "Cómo organizamos el Hackathon SCESI", resumen: "Lecciones de logística, mentorías y trabajo en equipo detrás del mayor evento de la comunidad.", categorias: ["Eventos", "Comunidad"] },
    { titulo: "Introducción a Linux para estudiantes", resumen: "Primeros pasos con Ubuntu: terminal, paquetes y entornos de desarrollo.", categorias: ["Tutoriales", "Software Libre"] },
    { titulo: "Retrospectiva del FLISoL 2026", resumen: "Lo que funcionó, lo que aprendimos y los números del festival.", categorias: ["Eventos"] },
  ];
  const papers = [
    { titulo: "Detección de placas con visión por computadora", resumen: "Paper del equipo SCESI sobre procesamiento de imágenes aplicado al transporte local.", categorias: ["Investigación", "IA"] },
    { titulo: "Analítica de asistencia en eventos académicos", resumen: "Métricas de recurrencia y embudo de participación en eventos universitarios.", categorias: ["Investigación", "Datos"] },
  ];
  for (const [i, b] of blogs.entries()) {
    await prisma.publicacion.create({ data: {
      tipo: "BLOG", titulo: b.titulo, slug: slugify(b.titulo), resumen: b.resumen,
      contenido: `<p>${b.resumen}</p><p>Contenido completo del artículo…</p>`,
      autorId: admin.id, estado: "PUBLICADO", publicadoEn: hace(30 - i * 7), vistas: 320 - i * 60,
      categorias: { create: b.categorias.map((nombre) => ({ categoria: { connectOrCreate: { where: { nombre }, create: { nombre } } } })) },
    } });
  }
  for (const [i, p] of papers.entries()) {
    await prisma.publicacion.create({ data: {
      tipo: "PAPER", titulo: p.titulo, slug: slugify(p.titulo), resumen: p.resumen,
      pdfUrl: "/files/papers/demo-paper.pdf", autorId: admin.id, autoresTexto: "Equipo de investigación SCESI",
      doi: `10.0000/scesi.${2026 - i}`, estado: "PUBLICADO", publicadoEn: hace(45 - i * 10),
      vistas: 150 - i * 40, descargas: 60 - i * 20,
      categorias: { create: p.categorias.map((nombre) => ({ categoria: { connectOrCreate: { where: { nombre }, create: { nombre } } } })) },
    } });
  }
  await prisma.publicacion.create({ data: {
    tipo: "BLOG", titulo: "Borrador: guía de patrocinio 2027", slug: "borrador-guia-patrocinio-2027",
    resumen: "Documento de trabajo para el equipo de patrocinios.", autorId: admin.id, estado: "BORRADOR",
  } });

  const publicadas = await prisma.publicacion.findMany({ where: { estado: "PUBLICADO" }, take: 4 });
  await prisma.publicacionLike.createMany({
    data: publicadas.flatMap((p, i) => [andrea.id, staff1.id, organizadora.id].slice(i % 2).map((usuarioId) => ({ publicacionId: p.id, usuarioId }))),
  });
  await prisma.publicacionComentario.createMany({
    data: publicadas.slice(0, 2).flatMap((p) => [
      { publicacionId: p.id, usuarioId: andrea.id, texto: "¡Gran artículo! Me ayudó mucho para organizar mi equipo." },
      { publicacionId: p.id, usuarioId: staff1.id, texto: "Gracias por compartir la experiencia de SCESI." },
    ]),
  });

  console.log(
    `Seed listo → ${codigoSeq - 1} inscripciones, ${totalAsistencias + hackathonAsistencias} asistencias, ${totalCalificaciones} calificaciones, ${certificados} certificados.`,
  );
  console.log("Usuarios demo → admin: marco@scesi.org/admin1234 · organizadora: elena@scesi.org/demo1234 · staff: carlos@scesi.org/demo1234 · participante: andrea@correo.com/demo1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
