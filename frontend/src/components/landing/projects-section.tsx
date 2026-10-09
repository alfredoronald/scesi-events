/**
 * Sección "Conoce nuestros proyectos" de la landing page.
 * Mismo layout que Próximos eventos: card destacada + cards pequeñas.
 *
 * Imágenes esperadas en /public/projects/:
 *   proyecto-feria-libro.jpg   → Imagen del proyecto Feria del Libro
 *   proyecto-scesi-noel.jpg    → Imagen del proyecto SCESI Noel
 *   proyecto-semana-tec.jpg    → Imagen del proyecto Semana Tecnológica
 */
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import type { Project } from "@/config/landing";

type Props = {
  projects: Project[];
};

function FeaturedProject({ project }: { project: Project }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[16/9] md:aspect-auto md:h-full min-h-[280px]">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
        {project.category}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
        <p className="text-sm text-white/80 line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-white/70 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {project.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {project.location}
          </span>
        </div>
        <a
          href={project.href}
          className="inline-flex items-center gap-2 rounded-lg bg-scesi-red-normal px-4 py-2 text-xs font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
        >
          Ver proyecto <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function SmallProject({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-gray-100 flex-shrink-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <span className="absolute top-2 left-2 rounded-full bg-scesi-red-normal px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {project.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">
          {project.description}
        </p>
        <a
          href={project.href}
          className="mt-3 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-scesi-red-normal hover:underline"
        >
          Ver más <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function ProjectsSection({ projects }: Props) {
  const [featured, ...rest] = projects;

  return (
    <section id="proyectos" className="bg-white py-12 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Conoce nuestros proyectos
          </h2>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-scesi-red-normal hover:underline font-medium"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featured && (
            <div className="md:row-span-2">
              <FeaturedProject project={featured} />
            </div>
          )}
          {rest.map((p) => (
            <SmallProject key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
