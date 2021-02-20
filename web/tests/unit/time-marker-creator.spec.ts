import "@vue/cli-plugin-unit-jest";
import TimeMarkerCreator from "../../src/timeline/time-marker-management/time-marker-creator";

describe("TimeMarkerCreator", () => {
  const timeMarkerCreator = TimeMarkerCreator.Instance;
  describe("createFirstMarker", () => {
    it("find correct date", () => {
      const expectedMarkerDate = 1000;

      const actualMarkerDate = timeMarkerCreator.createFirstMarker(600, 1200).date;

      expect(actualMarkerDate).toEqual(expectedMarkerDate);
    });
  });
});
