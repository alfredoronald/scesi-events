import type { Response } from "express";


export function ok<T>(res: Response, data: T, meta?: Record<string, unknown>): void {
  res.status(200).json({ data, ...(meta !== undefined ? { meta } : {}) });
}

export function created<T>(res: Response, data: T, meta?: Record<string, unknown>): void {
  res.status(201).json({ data, ...(meta !== undefined ? { meta } : {}) });
}

export function noContent(res: Response): void {
  res.status(204).send();
}

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function pageMeta(page: number, pageSize: number, total: number): PageMeta {
  return { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
