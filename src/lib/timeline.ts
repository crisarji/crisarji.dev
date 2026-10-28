/* Axis maths for every career figure on the site.
 *
 * Roles carry month precision ("2018-06"); technologies carry only a year.
 * Both land on one axis measured in months since its origin, so a role that
 * started mid-year sits where it belongs instead of snapping to January.
 *
 * Phase 4's interactive /experience is built on this, which is why it lives
 * here rather than inside a component. */

export interface Axis {
  start: number;
  end: number;
  /** Total months on the axis, inclusive of the final year. */
  span: number;
}

export function makeAxis(start: number, end: number): Axis {
  return { start, end, span: (end + 1 - start) * 12 };
}

/** Months from the axis origin for a "YYYY-MM" date. Null means "still open",
 *  which runs to the end of the axis. */
export function fromIso(iso: string | null, axis: Axis): number {
  if (!iso) return axis.span;
  const [y, m] = iso.split("-").map(Number);
  return (y - axis.start) * 12 + ((m ?? 1) - 1);
}

/** Months from the axis origin for a bare year. `edge` decides whether the
 *  year is entered at its start or left at its end — a technology used "to
 *  2018" was in play through December 2018, not up to January. */
export function fromYear(
  year: number | null,
  axis: Axis,
  edge: "start" | "end",
): number {
  if (year === null) return axis.span;
  const offset = edge === "end" ? 12 : 0;
  return (year - axis.start) * 12 + offset;
}

export const pct = (months: number, axis: Axis) =>
  `${((months / axis.span) * 100).toFixed(2)}%`;

/** Colour encodes position in time: one ramp spans the whole axis, from
 *  accent-2 at the origin to the brand accent at the present, and each bar
 *  takes the slice it occupies. Expressed as "how far toward accent-2",
 *  which is the form color-mix() wants. */
export const ramp = (months: number, axis: Axis) =>
  `${(100 - (months / axis.span) * 100).toFixed(1)}%`;

export interface Bar {
  left: string;
  width: string;
  cFrom: string;
  cTo: string;
  /** True while the entry has no end date. */
  current: boolean;
}

export function bar(startMonths: number, endMonths: number, axis: Axis): Bar {
  return {
    left: pct(startMonths, axis),
    width: pct(endMonths - startMonths, axis),
    cFrom: ramp(startMonths, axis),
    cTo: ramp(endMonths, axis),
    current: endMonths >= axis.span,
  };
}

/** Gridline years, every `step` years, always including both ends. */
export function ticks(axis: Axis, step = 4): number[] {
  const out: number[] = [];
  for (let y = axis.start; y <= axis.end; y += step) out.push(y);
  if (out[out.length - 1] !== axis.end) out.push(axis.end);
  return out;
}
