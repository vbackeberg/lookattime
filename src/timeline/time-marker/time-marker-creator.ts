import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";
import { round } from "mathjs";
export default class TimeMarkerCreator {
  public createTimeMarkers() {
    const relativeLeftEdge = PositionTranslator.toRelativePosition(
      Math.min(store.getters.spacerLeft.positionLeft, 0) // TODO: Instead of 0, compare with scroll left.
    );

    const relativeRightEdge = PositionTranslator.toRelativePosition(
      Math.max(
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width,
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
      )
    );

    const timeMarkers = [] as TimeMarkerModel[];

    const firstMarker = this.createFirstMarker(
      relativeRightEdge,
      relativeLeftEdge,
      -this.countDecimals(relativeRightEdge)
    );
    timeMarkers.push(firstMarker);

    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      relativeLeftEdge,
      relativeRightEdge,
      firstMarker.depth
    );
    timeMarkers.push(secondMarker);

    timeMarkers.unshift(
      ...this.createMarkersLeft(
        secondMarker.date < firstMarker.date ? secondMarker : firstMarker,
        relativeLeftEdge,
        secondMarker.depth
      )
    );

    timeMarkers.push(
      ...this.createMarkersRight(
        secondMarker.date > firstMarker.date ? secondMarker : firstMarker,
        relativeRightEdge,
        secondMarker.depth
      )
    );

    store.commit("setTimeMarkers", timeMarkers);
    store.commit("setTimeMarkerDepth", secondMarker.depth);
  }

  private createFirstMarker(
    relativeRightEdge: number,
    relativeLeftEdge: number,
    exponent: number
  ): TimeMarkerModel {
    // Additional rounding fixes Chrome bug: https://stackoverflow.com/questions/55958535
    const depth = round(
      Constants.MARKER_BASE ** (exponent + 1),
      Math.abs(exponent + 1)
    );

    if (Math.floor(relativeRightEdge / depth) * depth > relativeLeftEdge) {
      return this.createFirstMarker(
        relativeRightEdge,
        relativeLeftEdge,
        exponent + 1
      );
    }

    const highestPossibleDepth = Constants.MARKER_BASE ** exponent;
    const date =
      Math.floor(relativeRightEdge / highestPossibleDepth) *
      highestPossibleDepth;

    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(date),
      uuid(),
      date,
      highestPossibleDepth
    );
  }

  private createSecondMarker(
    firstMarkerDate: number,
    relativeLeftEdge: number,
    relativeRightEdge: number,
    power: number
  ): TimeMarkerModel {
    let secondMarkerDate = firstMarkerDate - power; // 1. 1900 - 100 / 10^0 = 1800    | 2. 1900 - 100 / 10^1 = 1890
    if (secondMarkerDate < relativeLeftEdge) {
      // 1. 1800 < 1899   | 2. 1890 < 1899
      secondMarkerDate = firstMarkerDate + power; // 1. 1900 + 100 / 10^0= 2000   | 2. 1900 + 100 / 10^1 = 1910
      if (secondMarkerDate > relativeRightEdge) {
        // 1. 2000 > 1950   | 2. 1910 !> 1950
        return this.createSecondMarker(
          firstMarkerDate,
          relativeLeftEdge,
          relativeRightEdge,
          power / Constants.MARKER_BASE
        );
      }
    }
    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(secondMarkerDate),
      uuid(),
      secondMarkerDate,
      power
    ); // 2. return 1910
  }

  public createMarkersLeft(
    //TODO: Refactor: fillSpaceWithMarkers to the left. Reduce parameters accordingly.
    leftmostMarker: TimeMarkerModel,
    relativeLeftEdge: number,
    depth: number
  ): TimeMarkerModel[] {
    // first marker, 1899, 10
    const distanceToEdge = leftmostMarker.date - relativeLeftEdge; // 1900 - 1899 = 1
    const numberOfMarkers = Math.floor(distanceToEdge / depth); // floor (1 / 10) = 0
    const absoluteMarkerDistance = depth * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          leftmostMarker.positionCenter - absoluteMarkerDistance * i,
          uuid(),
          leftmostMarker.date - depth * i,
          depth // relative marker distance = depth = power
        )
      );
    }

    return markers;
  }

  public createMarkersRight(
    rightmostMarker: TimeMarkerModel,
    relativeRightEdge: number,
    depth: number
  ): TimeMarkerModel[] {
    // second marker, 1950, 10
    const distanceToEdge = relativeRightEdge - rightmostMarker.date; // 1950 - 1910 = 40
    const numberOfMarkers = Math.floor(distanceToEdge / depth); // floor (40 / 10) = 4
    const absoluteMarkerDistance = depth * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          rightmostMarker.positionCenter + absoluteMarkerDistance * i,
          uuid(),
          rightmostMarker.date + depth * i,
          depth // relative marker distance = depth = power
        )
      );
    }
    return markers;
  }

  private countDecimals(number: number) {
    if (!isFinite(number)) return 0;

    let factor = 1;
    let numberOfDecimals = 0;
    while (Math.round(number * factor) / factor !== number) {
      factor *= 10;
      numberOfDecimals++;
    }
    return numberOfDecimals;
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
