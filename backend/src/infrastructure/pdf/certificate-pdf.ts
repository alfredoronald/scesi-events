import PDFDocument from "pdfkit";

export type CertificatePdfData = {
  nombreParticipante: string;
  eventoTitulo: string;
  eventoTipo: string;
  fecha: string;
  horas?: string;
  codigoVerificacion: string;
  organizacion: string;
};

export interface CertificatePdfGenerator {
  generate(data: CertificatePdfData): Promise<Buffer>;
}


export class PdfKitCertificateGenerator implements CertificatePdfGenerator {
  async generate(data: CertificatePdfData): Promise<Buffer> {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 60 });
    const chunks: Buffer[] = [];
    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    const { width } = doc.page;

    // Marco
    doc.rect(30, 30, width - 60, doc.page.height - 60).lineWidth(3).strokeColor("#b91c1c").stroke();
    doc.rect(38, 38, width - 76, doc.page.height - 76).lineWidth(1).strokeColor("#b91c1c").stroke();

    doc.moveDown(4);
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#b91c1c").text(data.organizacion, { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica").fontSize(11).fillColor("#111827").text("CERTIFICA QUE", { align: "center" });
    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(30).fillColor("#111827").text(data.nombreParticipante, { align: "center" });
    doc.moveDown(0.8);
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#111827")
      .text(`participó en ${data.eventoTipo} del evento`, { align: "center" })
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(`“${data.eventoTitulo}”`, { align: "center" })
      .font("Helvetica")
      .fontSize(11)
      .text(`realizado el ${data.fecha}${data.horas ? ` · ${data.horas}` : ""}`, { align: "center" });

    doc.moveDown(2);
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(
      `Código de verificación: ${data.codigoVerificacion} · Verifica su autenticidad en ${data.organizacion.toLowerCase()} → /verificar`,
      { align: "center" },
    );

    doc.moveDown(3);
    doc.font("Helvetica").fontSize(10).fillColor("#111827").text("_____________________", { align: "center" });
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("Dirección — SCESI", { align: "center" });

    doc.end();
    return done;
  }
}
