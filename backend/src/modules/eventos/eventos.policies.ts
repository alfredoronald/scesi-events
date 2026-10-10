import type { AuthUser } from "../../shared/middlewares/auth.js";
import { ForbiddenError } from "../../shared/errors/index.js";

type RecursoEvento = {
  organizadorId: string;
  staff?: Array<{ usuarioId: string }>;
};


export class EventosPolicies {
  puedeModificar(user: AuthUser, evento: RecursoEvento): void {
    if (user.rol === "ADMIN") return;
    if (user.rol === "ORGANIZADOR" && evento.organizadorId === user.id) return;
    throw new ForbiddenError("Solo el organizador dueño o un administrador pueden modificar este evento.");
  }

  puedeVerInscritos(user: AuthUser, evento: RecursoEvento): void {
    if (user.rol === "ADMIN") return;
    if (user.rol === "ORGANIZADOR" && evento.organizadorId === user.id) return;
    if (user.rol === "STAFF" && evento.staff?.some((s) => s.usuarioId === user.id)) return;
    throw new ForbiddenError("No tienes acceso a los inscritos de este evento.");
  }

  puedeGestionarPagos(user: AuthUser, evento: RecursoEvento): void {
    if (user.rol === "ADMIN") return;
    if (user.rol === "ORGANIZADOR" && evento.organizadorId === user.id) return;
    throw new ForbiddenError("Solo el organizador dueño o un administrador pueden gestionar pagos.");
  }

  puedeHacerCheckin(user: AuthUser, evento: RecursoEvento): void {
    if (user.rol === "ADMIN") return;
    if (user.rol === "ORGANIZADOR" && evento.organizadorId === user.id) return;
    if (user.rol === "STAFF" && evento.staff?.some((s) => s.usuarioId === user.id)) return;
    throw new ForbiddenError("No estás asignado a este evento.");
  }

  esOrganizadorOLectura(user: AuthUser | undefined, evento: RecursoEvento): boolean {
    if (!user) return false;
    if (user.rol === "ADMIN") return true;
    if (user.rol === "ORGANIZADOR" && evento.organizadorId === user.id) return true;
    if (user.rol === "STAFF" && evento.staff?.some((s) => s.usuarioId === user.id)) return true;
    return false;
  }
}
