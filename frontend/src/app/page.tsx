import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { getEvents, type PublicEvent } from "@/lib/events";
import styles from "./page.module.css";

// Esta portada depende de la API en cada solicitud; no se prerenderiza en build.
export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/La_Paz" });
const monthFormatter = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric", timeZone: "America/La_Paz" });
const timeFormatter = new Intl.DateTimeFormat("es-BO", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/La_Paz" });

function kindLabel(kind: PublicEvent["participationKind"]) {
  return kind === "invited" ? "Comunidad invitada" : kind === "staff" ? "Apoyo SCESI" : "Organizado por SCESI";
}

function EventPhoto({ event, className }: { event: PublicEvent; className: string }) {
  const image = event.coverImageUrl?.startsWith("/") ? event.coverImageUrl : null;
  return <div className={className}>{image && <Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 60vw" className={styles.eventImage} unoptimized />}</div>;
}

function EventCards({ events }: { events: PublicEvent[] }) {
  if (events.length === 0) return <p className={styles.emptyState}>No hay próximos eventos publicados.</p>;
  const [featured, ...others] = events;
  return (
    <div className={styles.cards}>
      <article className={styles.featured}>
        <div className={styles.featuredPhoto}>
          <EventPhoto event={featured} className={styles.photoFill} />
          <div className={styles.date}><strong>{dateFormatter.format(new Date(featured.startsAt)).split(" ")[0]}</strong><small>{monthFormatter.format(new Date(featured.startsAt))}</small></div>
        </div>
        <div className={styles.featuredBody}>
          <div className={styles.eyebrowLine}><span className={featured.participationKind === "invited" ? styles.invited : styles.organized}>{kindLabel(featured.participationKind)}</span><small>Próximo</small></div>
          <h3>{featured.title}</h3>
          <p>{featured.summary}</p>
          <div className={styles.facts}>
            <span><MapPin aria-hidden="true" /> {featured.location}</span>
            <span><Clock3 aria-hidden="true" /> {timeFormatter.format(new Date(featured.startsAt))} — {timeFormatter.format(new Date(featured.endsAt))}</span>
          </div>
          <Link href="/dashboard/explorar" className={styles.featuredLink}>Conocer la participación <ArrowRight aria-hidden="true" /></Link>
        </div>
      </article>
      <div className={styles.smallCards}>
        {others.slice(0, 2).map((event) => (
          <article className={styles.smallCard} key={event.id}>
            <div className={styles.smallPhoto}>
              <EventPhoto event={event} className={styles.photoFill} /><small>Próximo</small>
            </div>
            <div className={styles.smallBody}>
              <span className={event.participationKind === "invited" ? styles.invited : styles.organized}>{kindLabel(event.participationKind)}</span>
              <h3>{event.title}</h3>
              <p>{event.summary}</p>
              <Link href="/dashboard/explorar" aria-label={`Explorar ${event.title}`}><ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PastRows({ events }: { events: PublicEvent[] }) {
  return events.map((event, index) => (
    <Link href="/dashboard/explorar" className={styles.pastRow} key={event.id}>
      <small>{String(index + 1).padStart(2, "0")}</small>
      <span className={event.participationKind === "invited" ? styles.invited : styles.organized}>{kindLabel(event.participationKind)}</span>
      <strong>{event.title}</strong>
      <span className={styles.pastDescription}>{event.summary}</span>
      <small className={styles.pastDate}>{dateFormatter.format(new Date(event.startsAt))}</small>
      <ArrowRight aria-hidden="true" />
    </Link>
  ));
}

export default async function Home() {
  const results = await Promise.allSettled([getEvents("upcoming"), getEvents("past")]);
  const upcoming = results[0].status === "fulfilled" ? results[0].value : [];
  const past = results[1].status === "fulfilled" ? results[1].value : [];
  const apiUnavailable = results.some((result) => result.status === "rejected");
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/" aria-label="SCESI, inicio"><Image src="/logo.svg" width={47} height={32} alt="SCESI UMSS" priority /></Link>
          <div className={styles.navLinks}>
            <a href="#eventos">Eventos</a><Link href="/dashboard/entradas">Tus Tickets</Link><a href="#proyectos">Proyectos</a>
            <span className={styles.login} aria-disabled="true" title="El inicio de sesión aún no está disponible">Iniciar sesión</span>
          </div>
        </nav>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <h1 id="hero-title"><span>scesi</span><small>UMSS</small></h1>
            <p>Sociedad Científica de Estudiantes<br />de Sistemas e Informática</p>
            <a href="#eventos" className={styles.primaryButton}>Explorar eventos <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className={styles.heroPhoto}><Image src="/hero-mascot.png" alt="Figura de Tux en un evento de SCESI" fill priority sizes="(max-width: 800px) 100vw, 50vw" className={styles.eventImage} unoptimized /></div>
        </section>

        <section id="eventos" className={styles.section} aria-labelledby="upcoming-title">
          <div className={styles.sectionHeading}>
            <h2 id="upcoming-title">Próximos eventos</h2>
            <p>Encuéntranos organizando, colaborando o<br />sumándonos como comunidad.</p>
          </div>
          {apiUnavailable && <p className={styles.apiNotice}>No se pudo conectar con la API. Inicia el backend y PostgreSQL para cargar los eventos de demostración.</p>}
          <EventCards events={upcoming} />
        </section>

        <section className={`${styles.section} ${styles.pastSection}`} aria-labelledby="past-title">
          <h2 id="past-title">Eventos pasados</h2>
          <div className={styles.pastList}>
            <PastRows events={past} />
            {past.length === 0 && <p className={styles.emptyState}>No hay eventos pasados publicados.</p>}
            <Link href="/dashboard/explorar" className={styles.moreEvents}>Ver todos los eventos <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>

        <section className={styles.reserve} aria-labelledby="reserve-title">
          <span>¿Encontraste un evento para ti?</span>
          <h2 id="reserve-title">Reserva tu lugar.</h2>
          <span className={styles.reserveButton} aria-disabled="true" title="El registro de cuentas aún no está disponible">Crear mi cuenta <ArrowRight aria-hidden="true" /></span>
        </section>

        <section id="proyectos" className={`${styles.section} ${styles.projects}`} aria-labelledby="projects-title">
          <h2 id="projects-title">Conoce nuestros proyectos</h2>
          <EventCards events={upcoming} />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image src="/logo.svg" width={47} height={32} alt="SCESI UMSS" />
          <p>Sociedad Científica de Estudiantes de<br />Sistemas e Informática</p>
          <span>Síguenos en:</span>
        </div>
      </footer>
    </div>
  );
}
