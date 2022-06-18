import { Temporal } from "@js-temporal/polyfill";

export default class TemporalRoundingExtension {
  
  private static granularityForRounding = [
    'hour' , 'minute' , 'second' , 'millisecond' , 'microsecond' , 'nanosecond'
  ]
  
  private static granularityForHalfRounding = [
    "half-hour"
  ]

  public static round(date: Temporal.ZonedDateTime, zoomLevel: number) {
   
    
    if (this.granularityForRounding.includes(granularity)) {
      return date.round({ smallestUnit: granularity as Temporal.SmallestUnit<Temporal.TimeUnit>, roundingMode: "trunc" });
      
    }

   
  }  



}

export type DateRoundingUnit = Temporal.DateTimeUnit

// interface ZonedDateTime {

//     round(
//         roundTo: Temporal.RoundTo<'year' | 'month' | 'day' | 'hour' | 'half-hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond'>
//       ): Temporal.ZonedDateTime;
// }


