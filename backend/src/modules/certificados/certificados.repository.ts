import type { Prisma, PrismaClient } from "@prisma/client";

export type InscripcionParaCertificado = Prisma.InscripcionGetPayload<{
  include: {
    evento: true;
    asistencia: true;
    certificado: true;
    participaciones: true;
  };
}>;

export class CertificadosRepository {
  constructor(private readonly db: PrismaClient) {}

  findInscripcionesDeUsuario(usuarioId: string): Promise<InscripcionParaCertificado[]> {
    return this.db.inscripcion.findMany({
      where: { usuarioId },
      include: { evento: true, asistencia: true, certificado: true, participaciones: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findInscripcion(id: string): Promise<InscripcionParaCertificado | null> {
    return this.db.inscripcion.findFirst({
      where: { id },
      include: { evento: true, asistencia: true, certificado: true, participaciones: true },
    });
  }

  findCertificado(id: string) {
    return this.db.certificado.findFirst({
      where: { id },
      include: { inscripcion: { include: { evento: true } } },
    });
  }

  findByCodigoVerificacion(codigo: string) {
    return this.db.certificado.findUnique({
      where: { codigoVerificacion: codigo.trim().toUpperCase() },
      include: { inscripcion: { include: { evento: true } } },
    });
  }

  certificadoPorInscripcion(inscripcionId: string) {
    return this.db.certificado.findUnique({ where: { inscripcionId } });
  }

  createCertificado(data: Prisma.CertificadoUncheckedCreateInput) {
    return this.db.certificado.create({ data });
  }

  /** Inscritos confirmados de un evento (para emisión masiva). */
  inscripcionesConfirmadas(eventoId: string): Promise<InscripcionParaCertificado[]> {
    return this.db.inscripcion.findMany({
      where: { eventoId, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
      include: { evento: true, asistencia: true, certificado: true, participaciones: true },
    });
  }
}
