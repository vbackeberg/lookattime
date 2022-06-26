import { Temporal } from "@js-temporal/polyfill";
import "@vue/cli-plugin-unit-jest";
import TemporalRoundingExtension from "../../src/timeline/time-marker-management/temporal-rounding-extension";

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
      nanosecond: 1034,
      timeZone: "UTC"
    })
  );

  const testCases: TestCase[] = [
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
    }
  ];

  testCases.forEach(testCase => {
    it(`should return ${testCase.expectedDate} for depth ${testCase.depth} and roundingMode ${testCase.roundingMode}`, () => {
      const result = TemporalRoundingExtension.round(
        givenDate,
        testCase.depth,
        testCase.roundingMode
      );

      console.log(`\n result:   ${result} \n expected: ${testCase.expectedDate}`);

      expect(result.equals(testCase.expectedDate)).toBe(true);
    });
  });
});
