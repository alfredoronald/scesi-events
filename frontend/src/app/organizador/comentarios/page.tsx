import type { Metadata } from "next";
import { CommentsView } from "@/components/organizer/comments-view";

export const metadata: Metadata = {
  title: "Comentarios",
  description: "Revisa calificaciones y opiniones para mejorar los próximos eventos.",
};

export default function OrganizerCommentsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <CommentsView />
    </div>
  );
}
