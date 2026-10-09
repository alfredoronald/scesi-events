-- Solo para desarrollo/presentación: fechas y eventos ficticios inspirados en el diseño.
-- Los dos ejemplos genéricos del seed anterior se conservan como borradores.
UPDATE events SET status = 'draft'
WHERE (slug = 'demo-proximo' AND title = 'Evento de prueba (próximo)')
   OR (slug = 'demo-pasado' AND title = 'Evento de prueba (pasado)');

INSERT INTO events (slug, title, summary, starts_at, ends_at, location, cover_image_url, participation_kind, status)
VALUES
  ('demo-feria-libro', 'Feria Internacional del Libro', 'Tendremos un stand abierto para conversar sobre tecnología, comunidad y lo que construimos desde SCESI.', now() + interval '7 days', now() + interval '7 days 11 hours', 'FEXCO, Cochabamba', '/feria-internacional-libro.jpg', 'invited', 'published'),
  ('demo-scesi-noel', 'Scesi Noel', 'Una iniciativa solidaria donde unimos tecnología, educación y empatía.', now() + interval '20 days', now() + interval '20 days 4 hours', 'SCESI UMSS', '/scesi-noel.jpg', 'organized', 'published'),
  ('demo-semana-tecnologica', 'Semana tecnológica', 'Cinco días de aprendizaje, innovación y actividades para la comunidad.', now() + interval '25 days', now() + interval '29 days', 'UMSS, Cochabamba', '/semana-tecnologica.jpg', 'organized', 'published'),
  ('demo-flisol', 'Flisol', 'Software libre y comunidad en una jornada compartida.', now() - interval '30 days', now() - interval '30 days' + interval '5 hours', 'Cochabamba', '/hero-mascot.png', 'organized', 'published'),
  ('demo-aws-community-day', 'AWS Community Day', 'Charlas y experiencias sobre el ecosistema tecnológico.', now() - interval '80 days', now() - interval '80 days' + interval '5 hours', 'Cochabamba', '/semana-tecnologica.jpg', 'invited', 'published')
ON CONFLICT (slug) DO NOTHING;
