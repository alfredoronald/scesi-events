"use client";

import { useState, type FormEvent } from "react";
import {
  defaultOrganizationSettings,
  settingsSections,
  type OrganizationSettings,
  type SettingsSection,
} from "@/config/admin-settings";
import { cn } from "@/lib/cn";

const fieldClassName = "mt-2 block w-full rounded-lg border border-scesi-grey-light-active/50 bg-white px-3 py-3 text-sm text-scesi-grey-normal/75 outline-none focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20";

export function AdminSettingsView() {
  const [section, setSection] = useState<SettingsSection>("general");
  const [form, setForm] = useState<OrganizationSettings>(defaultOrganizationSettings);
  const [saved, setSaved] = useState<OrganizationSettings>(defaultOrganizationSettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const sectionLabel = settingsSections.find((item) => item.id === section)?.label;
  const hasChanges = (Object.keys(form) as (keyof OrganizationSettings)[]).some((key) => form[key] !== saved[key]);

  function update(field: keyof OrganizationSettings, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setMessage("");
    setError("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned: OrganizationSettings = {
      name: form.name.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
    };
    if (Object.values(cleaned).some((value) => !value)) {
      setError("Completa todos los campos con información válida.");
      setMessage("");
      return;
    }
    setForm(cleaned);
    setSaved(cleaned);
    setError("");
    setMessage("Cambios guardados en esta sesión.");
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-scesi-red-normal">Plataforma</p>
      <h1 className="mt-3 text-title text-scesi-grey-normal md:text-display">Configuración</h1>
      <p className="mt-2 text-body text-scesi-grey-normal/65">Configura la información institucional y las preferencias del sistema.</p>

      <div className="mt-8 grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Secciones de configuración" className="rounded-xl border border-scesi-grey-light-active/50 bg-white p-3">
          <div className="flex flex-wrap gap-1 lg:flex-col">
            {settingsSections.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={section === id}
                aria-controls="admin-settings-panel"
                onClick={() => setSection(id)}
                className={cn(
                  "rounded-lg px-3 py-4 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal",
                  section === id ? "bg-scesi-red-light font-medium text-scesi-red-normal" : "text-scesi-grey-normal/60 hover:bg-scesi-grey-light",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <section id="admin-settings-panel" aria-labelledby="admin-settings-heading" className="min-w-0 rounded-xl border border-scesi-grey-light-active/50 bg-white p-5 sm:p-7">
          <h2 id="admin-settings-heading" className="text-2xl font-medium tracking-tight text-scesi-grey-normal">{sectionLabel}</h2>
          {section === "general" ? (
            <>
              <p className="mt-2 text-xs text-scesi-grey-normal/60">Estos datos identifican a SCESI dentro de la plataforma.</p>
              <form onSubmit={save} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="organization-name" className="text-xs font-medium text-scesi-grey-normal/80">Nombre de la organización</label>
                  <input id="organization-name" name="organizationName" required value={form.name} onChange={(event) => update("name", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="organization-email" className="text-xs font-medium text-scesi-grey-normal/80">Correo institucional</label>
                  <input id="organization-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => update("email", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="organization-location" className="text-xs font-medium text-scesi-grey-normal/80">Ubicación</label>
                  <input id="organization-location" name="location" required value={form.location} onChange={(event) => update("location", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="organization-description" className="text-xs font-medium text-scesi-grey-normal/80">Descripción</label>
                  <textarea id="organization-description" name="description" required rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} className={cn(fieldClassName, "resize-y")} />
                </div>
                <div>
                  {error && <p role="alert" className="mb-3 text-sm text-scesi-red-normal">{error}</p>}
                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" className="rounded-lg bg-scesi-red-normal px-5 py-3 text-xs font-medium text-white hover:bg-scesi-red-normal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal">Guardar cambios</button>
                    {hasChanges && <span className="text-xs text-scesi-grey-normal/60">Cambios sin guardar</span>}
                  </div>
                  <p role="status" className="mt-3 text-xs text-scesi-green-normal">{message}</p>
                  <p className="mt-2 text-xs text-scesi-grey-normal/50">Vista demo: los cambios se conservan mientras esta vista permanezca abierta.</p>
                </div>
              </form>
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-scesi-grey-light-active/50 px-5 py-10 text-center">
              <p className="text-sm text-scesi-grey-normal/65">La configuración de {sectionLabel?.toLowerCase()} estará disponible próximamente.</p>
              <button type="button" onClick={() => setSection("general")} className="mt-4 rounded-sm text-sm text-scesi-red-normal underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-scesi-red-normal">Volver a Información general</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
