import { Temporal } from "@js-temporal/polyfill";
import { Constants } from "./zooming/constants";

export default class DateTimeFormatOptions {
  public static CALENDAR = new Temporal.ZonedDateTime(0n, Constants.TIME_ZONE)
    .calendar;
  public static TIME_ZONE: "UTC";
}
