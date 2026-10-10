import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import type { StorageProvider } from "./types.js";

export function createStorageProvider(): StorageProvider {
  if (env.storage.provider !== "local") throw new Error("Configura STORAGE_PROVIDER=local; Cloudinary aún no está implementado.");
  return {
    async save(folder, buffer, extension) {
      if (!/^[a-z-]+$/.test(folder) || !/^[a-z0-9]+$/.test(extension)) throw new Error("Ruta de almacenamiento inválida.");
      const directory = resolve(env.storage.localDir, folder);
      await mkdir(directory, { recursive: true });
      const filename = `${randomUUID()}.${extension}`;
      await writeFile(resolve(directory, filename), buffer, { flag: "wx" });
      return { url: `/storage/${folder}/${filename}` };
    },
  };
}
