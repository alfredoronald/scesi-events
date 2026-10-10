export type UsuarioDto = {
  id: string;
  nombreCompleto: string;
  username: string;
  email: string;
  celular: string | null;
  carrera: string | null;
  universidad: string | null;
  rol: "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE";
  activo: boolean;
  ultimoAcceso: string | null;
  createdAt: string;
};

export type AuthPayload = {
  accessToken: string;
  expiresIn: string;
  usuario: UsuarioDto;
};

export type JwtPayloadAccess = { sub: string; rol: string };
