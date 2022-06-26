import { Temporal } from "@js-temporal/polyfill";
import "@vue/cli-plugin-unit-jest";
import TemporalRoundingExtension from "../../src/timeline/time-marker-management/temporal-rounding-extension";

// @ts-ignore
describe("TemporalRoundingExtension round", () => {
  type TestCase = {
    depth: string;
    roundingMode: "trunc" | "ceil";
    expectedDate: Temporal.ZonedDateTime;
  };

  const givenDate = Temporal.ZonedDateTime.from(
    Temporal.ZonedDateTime.from({
      year: 2022,
      month: 11,
      day: 12,
      hour: 15,
      minute: 14,
      second: 13,
      millisecond: 126,
      microsecond: 135,
      nanosecond: 104,
      timeZone: "UTC"
    })
  );

  const testCases: TestCase[] = [
    // round to bottom (leftmost date)
    {
      depth: "year",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 1,
        day: 1,
        timeZone: "UTC"
      })
    },
    {
      depth: "month",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 1,
        timeZone: "UTC"
      })
    },
    {
      depth: "day",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "hour",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 15,
        minute: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "minute",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 15,
        minute: 14,
        second: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "second",
      roundingMode: "trunc",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 15,
        minute: 14,
        second: 13,
        millisecond: 0,
        timeZone: "UTC"
      })
    },

    // round to top (rightmost date)
    {
      depth: "year",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2023,
        month: 1,
        day: 1,
        timeZone: "UTC"
      })
    },
    {
      depth: "month",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 12,
        day: 1,
        timeZone: "UTC"
      })
    },
    {
      depth: "day",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 13,
        hour: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "hour",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 16,
        minute: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "minute",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 15,
        minute: 15,
        second: 0,
        timeZone: "UTC"
      })
    },
    {
      depth: "second",
      roundingMode: "ceil",
      expectedDate: Temporal.ZonedDateTime.from({
        year: 2022,
        month: 11,
        day: 12,
        hour: 15,
        minute: 14,
        second: 14,
        millisecond: 0,
        timeZone: "UTC"
      })
    }
  ];

  testCases.forEach(testCase => {
    // @ts-ignore
    it(`should return ${testCase.expectedDate} for depth ${testCase.depth} and roundingMode ${testCase.roundingMode}`, () => {
      const result = TemporalRoundingExtension.round(
        givenDate,
        testCase.depth,
        testCase.roundingMode
      );

      console.log(
        `\n result:   ${result} \n expected: ${testCase.expectedDate}`
      );

      // @ts-ignore
      expect(result.equals(testCase.expectedDate)).toBe(true);
    });
  });
});
