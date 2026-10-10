import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.js";
import { requireAuth } from "../../shared/middlewares/auth.js";
import { apiRateLimit } from "../../shared/middlewares/rate-limit.js";
import type { AuthController } from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas.js";

const authLimiter = apiRateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: "Demasiados intentos. Espera unos minutos." });

export function buildAuthRouter(controller: AuthController): Router {
  const router = Router();
  router.post("/login", authLimiter, validate({ body: loginSchema }), (req, res) => controller.login(req, res));
  router.post("/register", authLimiter, validate({ body: registerSchema }), (req, res) => controller.register(req, res));
  router.post("/refresh", validate({ body: refreshSchema }), (req, res) => controller.refresh(req, res));
  router.post("/logout", requireAuth, (req, res) => controller.logout(req, res));
  router.get("/me", requireAuth, (req, res) => controller.me(req, res));
  return router;
}
