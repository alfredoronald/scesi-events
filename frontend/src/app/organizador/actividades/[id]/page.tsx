import { Suspense } from "react";
import { ActivityDetailForm } from "@/components/organizer/activity-form";
export default function ActivityPage() { return <Suspense fallback={<p className="p-8">Cargando actividad…</p>}><ActivityDetailForm /></Suspense>; }
