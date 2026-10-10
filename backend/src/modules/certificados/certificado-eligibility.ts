import type { InscripcionParaCertificado } from "./certificados.repository.js";


export interface CertificateEligibilityPolicy {
  evaluar(inscripcion: InscripcionParaCertificado): { elegible: boolean; motivo?: string };
}

export class AsistenciaRequeridaPolicy implements CertificateEligibilityPolicy {
  evaluar(inscripcion: InscripcionParaCertificado): { elegible: boolean; motivo?: string } {
    if (!inscripcion.asistencia) {
      return { elegible: false, motivo: "Sin check-in registrado en el evento." };
    }
    return { elegible: true };
  }
}

export class SoloPonentesPolicy implements CertificateEligibilityPolicy {
  evaluar(inscripcion: InscripcionParaCertificado): { elegible: boolean; motivo?: string } {
    const esPonente = inscripcion.participaciones.some((p) => p.rol === "PONENTE");
    if (!esPonente) {
      return { elegible: false, motivo: "El evento solo certifica a ponentes." };
    }
    return { elegible: true };
  }
}

/** Compone políticas: todas deben aprobar (O-Closed: se agregan, no se modifican). */
export class CompositeEligibilityPolicy implements CertificateEligibilityPolicy {
  constructor(private readonly policies: CertificateEligibilityPolicy[]) {}

  evaluar(inscripcion: InscripcionParaCertificado): { elegible: boolean; motivo?: string } {
    for (const policy of this.policies) {
      const resultado = policy.evaluar(inscripcion);
      if (!resultado.elegible) return resultado;
    }
    return { elegible: true };
  }
}

export function politicasPara(certificadoA: "TODOS" | "SOLO_PONENTES"): CertificateEligibilityPolicy {
  if (certificadoA === "SOLO_PONENTES") {
    return new CompositeEligibilityPolicy([new SoloPonentesPolicy()]);
  }
  return new CompositeEligibilityPolicy([new AsistenciaRequeridaPolicy()]);
}
