export type CertificadoDto = {
  id: string;
  inscripcionId: string;
  evento: { id: string; titulo: string; fechaInicio: string; tipo: string };
  participante: string;
  codigoVerificacion: string;
  emitidoEn: string;
  descargarUrl: string;
};

export type ElegibilidadDto = {
  inscripcionId: string;
  eventoId: string;
  eventoTitulo: string;
  participante: string;
  elegible: boolean;
  yaEmitido: boolean;
  motivo?: string;
};

export type VerificacionDto = {
  valido: boolean;
  certificado?: {
    participante: string;
    evento: string;
    fecha: string;
    emitidoEn: string;
  };
};
