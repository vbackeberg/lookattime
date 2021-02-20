import "@vue/cli-plugin-unit-jest";
import TimeMarkerCreator from "../../src/timeline/time-marker-management/time-marker-creator";

describe("TimeMarkerCreator", () => {
  const timeMarkerCreator = TimeMarkerCreator.Instance;
  describe("createFirstMarker", () => {
    it("find correct date when both positive", () => {
      const expectedMarkerDate = 1000;

      const actualMarkerDate = timeMarkerCreator.createFirstMarker(600, 1200).date;

      expect(actualMarkerDate).toEqual(expectedMarkerDate);
    });
    
    it("find correct date when negative and positive", () => {
      const expectedMarkerDate = 0;

      const actualMarkerDate = timeMarkerCreator.createFirstMarker(-10, 1200).date;

      expect(actualMarkerDate).toEqual(expectedMarkerDate);
    });
    
    it("find correct date when both negative", () => {
      const expectedMarkerDate = -10000;

      const actualMarkerDate = timeMarkerCreator.createFirstMarker(-12000, -120).date;

      expect(actualMarkerDate).toEqual(expectedMarkerDate);
    });
  });
});
