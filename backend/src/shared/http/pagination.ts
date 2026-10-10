import type { Request } from "express";
import { ValidationError } from "../errors/index.js";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

export type Pagination = { page: number; pageSize: number; skip: number; take: number };

export function parsePagination(req: Request): Pagination {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? DEFAULT_PAGE_SIZE);
  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError("page debe ser un entero mayor o igual a 1.");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new ValidationError(`pageSize debe estar entre 1 y ${MAX_PAGE_SIZE}.`);
  }
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
