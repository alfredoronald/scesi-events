"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ReportDataset } from "@/config/admin-reports";

export function ReportDownloadButton({ report, compact = false }: { report: ReportDataset; compact?: boolean }) {
  const [downloaded, setDownloaded] = useState(false);

  function download() {
    const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [report.headers, ...report.rows].map((row) => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = report.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  return (
    <div className={compact ? "shrink-0" : "mt-auto pt-8"}>
      <button
        type="button"
        onClick={download}
        aria-label={`${compact ? "Descargar CSV" : "Generar reporte"}: ${report.filename}`}
        className={compact
          ? "rounded-lg border border-scesi-grey-light-active/50 px-3 py-2 text-xs text-scesi-grey-normal/65 hover:bg-scesi-grey-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal"
          : "inline-flex items-center gap-4 rounded-sm border-b border-scesi-grey-light-active/50 pb-1 text-xs text-scesi-grey-normal hover:text-scesi-red-normal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-scesi-red-normal"}
      >
        {compact ? "Descargar CSV" : "Generar reporte"}
        {!compact && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
      </button>
      <span role="status" className="sr-only">{downloaded ? `Descarga iniciada: ${report.filename}` : ""}</span>
    </div>
  );
}
