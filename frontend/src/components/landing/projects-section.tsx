/**
 * Sección "Conoce nuestros proyectos" de la landing page.
 * Layout: lista numerada — número, nombre, descripción, estado.
 */
import type { Project } from "@/config/landing";

type Props = {
  projects: Project[];
};

export function ProjectsSection({ projects }: Props) {
  return (
    <section id="proyectos" className="bg-white py-12 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Conoce nuestros proyectos
        </h2>

        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex items-start gap-6 py-7"
            >
              {/* Número */}
              <span className="w-6 shrink-0 text-sm text-gray-400 pt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Nombre */}
              <p className="w-40 shrink-0 font-bold text-gray-900">
                {project.title}
              </p>

              {/* Descripción */}
              <p className="flex-1 text-sm text-gray-500">
                {project.description || "—"}
              </p>

              {/* Estado */}
              <span className="shrink-0 text-sm text-gray-400">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
