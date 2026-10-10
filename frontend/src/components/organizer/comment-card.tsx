"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import type { OrganizerComment } from "@/config/organizer-comments";

export function CommentCard({ comment }: { comment: OrganizerComment }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      setError("Escribe una respuesta antes de enviarla.");
      return;
    }
    setReply(text);
    setEditing(false);
    setDraft("");
    setError("");
  }

  return (
    <article className="flex flex-col rounded-xl border border-scesi-grey-light-active/50 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-scesi-grey-normal text-xs text-white">
            {comment.initials}
          </span>
          <div>
            <h2 className="text-sm font-semibold text-scesi-grey-normal">{comment.author}</h2>
            <p className="mt-1 text-xs text-scesi-grey-normal/60">{comment.dateLabel}</p>
          </div>
        </div>
        <span aria-label={`${comment.score} de 5 estrellas`} className="inline-flex items-center gap-1 text-sm font-medium text-scesi-red-normal">
          {comment.score}
          <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-scesi-grey-normal/70">{comment.text}</p>
      {reply && (
        <div role="status" className="mt-5 border-l-2 border-scesi-red-normal bg-scesi-grey-light/30 p-3">
          <p className="text-xs font-semibold text-scesi-grey-normal">Equipo SCESI</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-scesi-grey-normal/70">{reply}</p>
        </div>
      )}
      {editing ? (
        <form onSubmit={submit} className="mt-5">
          <label htmlFor={`reply-${comment.id}`} className="text-sm font-medium text-scesi-grey-normal">Respuesta a {comment.author}</label>
          <textarea
            autoFocus
            id={`reply-${comment.id}`}
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setError(""); }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `error-${comment.id}` : undefined}
            rows={3}
            className="mt-2 block w-full resize-y rounded-lg border border-scesi-grey-light-active bg-white p-3 text-sm text-scesi-grey-normal outline-none focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/30"
          />
          {error && <p id={`error-${comment.id}`} role="alert" className="mt-2 text-sm text-scesi-red-normal">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="submit" className="rounded-lg bg-scesi-red-normal px-4 py-2 text-sm font-medium text-white hover:bg-scesi-red-normal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal">Enviar respuesta</button>
            <button type="button" onClick={() => { setEditing(false); setDraft(""); setError(""); }} className="rounded-lg px-4 py-2 text-sm text-scesi-grey-normal focus-visible:outline-2 focus-visible:outline-scesi-red-normal">Cancelar</button>
          </div>
        </form>
      ) : !reply && (
        <button type="button" onClick={() => setEditing(true)} aria-label={`Responder a ${comment.author}`} className="mt-7 self-start text-xs text-scesi-grey-normal underline decoration-scesi-grey-light-active underline-offset-4 hover:text-scesi-red-normal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-scesi-red-normal">Responder</button>
      )}
    </article>
  );
}
