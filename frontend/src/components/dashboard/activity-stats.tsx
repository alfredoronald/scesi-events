import { activityStats } from "@/config/dashboard";

export function ActivityStats() {
  return (
    <section
      aria-labelledby="activity-title"
      className="rounded-xl border border-scesi-grey-light-active bg-white p-6 shadow-sm"
    >
      <p className="text-xs font-medium tracking-[0.18em] text-scesi-grey-normal/60 uppercase">
        Mi actividad
      </p>
      <h2
        id="activity-title"
        className="mt-1 text-lg font-semibold text-scesi-grey-normal sm:text-xl"
      >
        Este año
      </h2>

      <dl className="mt-4 divide-y divide-scesi-grey-light-active">
        {activityStats.map(({ id, label, value, icon: Icon }) => (
          <div key={id} className="flex items-center gap-3 py-4">
            <Icon className="h-5 w-5 shrink-0 text-scesi-grey-normal/70" aria-hidden="true" />
            <dt className="min-w-0 flex-1 text-sm text-scesi-grey-normal/70">
              {label}
            </dt>
            <dd className="text-2xl font-semibold text-scesi-grey-normal">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
