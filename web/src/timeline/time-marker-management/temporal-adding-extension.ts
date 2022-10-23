// import { Temporal } from "@js-temporal/polyfill";

// export default class TemporalAddingExtension {
//   // private static stepSize = new Map<string, Temporal.DurationLike>([
//   //   ["year", { years: 1 }],
//   //   ["month", { months: 1 }],
//   //   ["day", { days: 1 }],
//   //   ["half-day", { hours: 12 }],
//   //   ["hour", { hours: 1 }],
//   //   ["half-hour", { minutes: 30 }],
//   //   ["minute", { minutes: 1 }]
//   // ]);

//   public static add(
//     date: Temporal.ZonedDateTime,
//     depth: Temporal.DurationLike
//   ): Temporal.ZonedDateTime {
//     // May be undefined if not found. (The list is not complete, yet.)

//     return date.add(depth);
//   }
// }

// export class StepSize {
//   constructor(depth: string) {
//     this.depth = depth;
//     this.t = { years: 1 };
//   }
//   public readonly depth: string;
//   public readonly t: Temporal.DurationLike;
// }
