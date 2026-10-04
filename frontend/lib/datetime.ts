export const DEFAULT_TZ = "Asia/Manila";

/** Converts a local wall-clock date and time in `tz` to a UTC ISO string. */
export function zonedToIso(date: string, time: string, tz: string = DEFAULT_TZ): string {
  const guess = new Date(`${date}T${time}:00Z`);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(guess)
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return new Date(guess.getTime() - (asUtc - guess.getTime())).toISOString();
}

/** YYYY-MM-DD of an instant as seen in `tz`. */
export function dateKey(iso: string | Date, tz: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof iso === "string" ? new Date(iso) : iso);
}

export function todayKey(tz: string = DEFAULT_TZ): string {
  return dateKey(new Date(), tz);
}

export function addDays(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `key`. */
export function weekStart(key: string): string {
  const d = new Date(`${key}T00:00:00Z`);
  return addDays(key, -((d.getUTCDay() + 6) % 7));
}

export function labelFromKey(key: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

export function formatTime(iso: string, tz: string = DEFAULT_TZ): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string, tz: string = DEFAULT_TZ): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function hourIn(iso: string, tz: string = DEFAULT_TZ): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(
      new Date(iso)
    )
  );
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/** Adds minutes to a local HH:MM string, clamped to the same day. */
export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
