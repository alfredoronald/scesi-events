export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png",
};
export interface StorageProvider {
  save(folder: string, buffer: Buffer, extension: string): Promise<{ url: string }>;
}
