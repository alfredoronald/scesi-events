import { Suspense } from "react";
import { ProjectDetailView } from "@/components/landing/project-detail-view";

export default function ProjectPage() { return <Suspense fallback={<p className="p-8">Cargando proyecto…</p>}><ProjectDetailView /></Suspense>; }
