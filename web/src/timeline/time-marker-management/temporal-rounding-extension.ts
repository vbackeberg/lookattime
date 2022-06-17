import { Temporal } from "@js-temporal/polyfill";

export default class TemporalRoundingExtension {
    

}

export type DateRoundingUnit = Temporal.DateTimeUnit

interface ZonedDateTime {

    round(
        roundTo: Temporal.RoundTo<'year' | 'month' | 'day' | 'hour' | 'half-hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond'>
      ): Temporal.ZonedDateTime;
}