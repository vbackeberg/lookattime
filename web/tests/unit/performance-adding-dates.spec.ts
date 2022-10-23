/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Temporal } from "@js-temporal/polyfill";
import "@vue/cli-plugin-unit-jest";

// @ts-ignore
describe("Temporal Performance test", () => {
  [10, 100, 1000, 10000, 100000].forEach(numberOfInstantsToCreate => {
    // @ts-ignore
    it(`how fast is adding ${numberOfInstantsToCreate} instants?`, () => {
      let currentInstant = Temporal.Now.instant();
      let i = 0;
      const instants: Array<Temporal.Instant> = [];

      console.time("It took");
      while (i < numberOfInstantsToCreate) {
        instants.push(currentInstant);
        currentInstant = currentInstant.add({ seconds: 100 });
        i++;
      }

      console.timeEnd("It took");
      console.log(`Created ${numberOfInstantsToCreate} instants.`);
    });
  });

  [10, 100, 1000, 10000, 100000].forEach(numberOfInstantsToCreate => {
    // @ts-ignore
    it(`how fast is adding ${numberOfInstantsToCreate} instants using number only?`, () => {
      const SECONDS_IN_NANOSECONDS = 1000000000n;
      let currentSeconds = Temporal.Now.instant().epochSeconds;
      let i = 0;
      const instants: Array<Temporal.Instant> = [];

      console.time("It took");
      while (i < numberOfInstantsToCreate) {
        instants.push(Temporal.Instant.fromEpochSeconds(currentSeconds));
        currentSeconds += 100;
        i++;
      }

      console.timeEnd("It took");
      console.log(`Created ${numberOfInstantsToCreate} instants.`);
    });
  });

  // TODO zoned date time test
});
