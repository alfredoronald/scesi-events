import { EventEmitter } from "node:events";
import { logger } from "../utils/logger.js";


export type DomainEvents = {
  InscripcionConfirmada: { inscripcionId: string; email: string; codigo: string; eventoTitulo: string; qrToken: string | null };
  PagoConfirmado: { inscripcionId: string; email: string; codigo: string; eventoTitulo: string };
  AsistenciaRegistrada: { inscripcionId: string; eventoId: string };
  EventoCerrado: { eventoId: string };
};

export type EventNames = keyof DomainEvents;

class TypedEventBus {
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(50);
  }

  emit<K extends EventNames>(event: K, payload: DomainEvents[K]): void {
    logger.debug({ event }, "Evento de dominio emitido");
    this.emitter.emit(event, payload);
  }

  on<K extends EventNames>(event: K, listener: (payload: DomainEvents[K]) => void): void {
    this.emitter.on(event, listener);
  }
}

export const eventBus = new TypedEventBus();
