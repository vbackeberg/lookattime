import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import VisibilityObserver from "../visibility-management/visibility-observer";
import { Constants } from "./constants";

/**
 * Provides the functionality for adding time markers.
 */
export default class TimeMarkerCreator {
  private timeMarkerAreaElement: HTMLElement;
  private timelineElement: HTMLElement;

  constructor() {
    this.timeMarkerAreaElement = document.getElementById(
      "time-marker-area"
    ) as HTMLElement;
    this.timelineElement = store.state.timelineElement;
  }

  /**
   * Initiates the time marker array. Adds a marker at date 0 and expands markers to both sides.
   *
   */
  public initiateTimeMarkers() {
    const lowestDate = PositionTranslator.toRelativePosition(0);
    const highestDate = PositionTranslator.toRelativePosition(
      this.timelineElement.scrollWidth
    );

    const firstMarker = this.createFirstMarker(lowestDate, highestDate);
    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      lowestDate,
      highestDate,
      firstMarker.depth
    );

    store.state.timeMarkers = [firstMarker, secondMarker].sort(
      (a, b) => a.date - b.date
    );

    store.commit("setTimeMarkerDepth", secondMarker.depth);

    this.addMarkersLeft();
    this.addMarkersRight();

    VisibilityObserver.Instance.notify();
  }

  /**
   * Creates one time marker at the coarsest date within the timeline, e.g. the year 1000
   * if the timeline ranges from 912 to 1845.
   *
   * 0 is defined as the coarsest date. If the timeline spans across 0, the marker will
   * consequently be placed at 0.
   *
   * @param lowestDate The lowest date within the timeline
   * @param highestDate The highest date within the timeline
   */
  private createFirstMarker(
    lowestDate: number,
    highestDate: number
  ): TimeMarkerModel {
    let depth = 1;
    const id = uuid();
    const element = this.createHTMLElement(id);
    this.addHTMLElements(element);

    if (lowestDate <= 0 && highestDate >= 0) {
      return new TimeMarkerModel(
        store.state.timelineZero,
        id,
        0,
        Number.MAX_SAFE_INTEGER,
        element
      );
    } else if (lowestDate > 0) {
      while (Math.trunc(highestDate / depth) * depth > lowestDate) {
        depth *= Constants.DEPTH_BASE;
      }
      depth /= Constants.DEPTH_BASE;

      const date = Math.trunc(highestDate / depth) * depth;

      return new TimeMarkerModel(
        PositionTranslator.toAbsolutePosition(date),
        id,
        date,
        depth,
        element
      );
    } else {
      while (Math.trunc(lowestDate / depth) * depth < highestDate) {
        depth *= Constants.DEPTH_BASE;
      }
      depth /= Constants.DEPTH_BASE;

      const date = Math.trunc(lowestDate / depth) * depth;

      return new TimeMarkerModel(
        PositionTranslator.toAbsolutePosition(date),
        id,
        date,
        depth,
        element
      );
    }
  }

  /**
   * Creates one time marker at the second-coarsest date within the timeline, e.g. the year 1100
   * if the timeline ranges from 912 to 1845 and the first marker was placed at the year 1000.
   *
   * @param firstMarkerDate The first marker's date
   * @param lowestDate The lowest date within the timeline
   * @param highestDate The highest date within the timeline
   * @param depth The current "marker depth" (..., 0.1, 1, 10, ...)
   */
  private createSecondMarker(
    firstMarkerDate: number,
    lowestDate: number,
    highestDate: number,
    depth: number
  ): TimeMarkerModel {
    const id = uuid();
    const element = this.createHTMLElement(id);

    let secondMarkerDate = firstMarkerDate - depth;
    if (secondMarkerDate < lowestDate) {
      secondMarkerDate = firstMarkerDate + depth;
      if (secondMarkerDate > highestDate) {
        return this.createSecondMarker(
          firstMarkerDate,
          lowestDate,
          highestDate,
          depth / Constants.DEPTH_BASE
        );
      }
    }

    this.addHTMLElements(element);

    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(secondMarkerDate),
      id,
      secondMarkerDate,
      depth,
      element
    );
  }

  /**
   * Places new time markers between the lowest existing time marker and the
   * lowest date of the timeline.
   */
  public addMarkersLeft() {
    const lowestMarker = store.state.timeMarkers[0];
    const distanceToEdge = lowestMarker.positionCenter - 0;
    const numberOfMarkers = Math.floor(
      distanceToEdge / store.getters.timeMarkerDistance
    );

    if (numberOfMarkers > 0) {
      const markers = [] as TimeMarkerModel[];
      const elements: HTMLElement[] = [];

      for (let i = numberOfMarkers; i > 0; i--) {
        const date = lowestMarker.date - store.state.timeMarkerDepth * i;
        const id = uuid();
        const element = this.createHTMLElement(id);
        elements.push(element);

        markers.push(
          new TimeMarkerModel(
            lowestMarker.positionCenter - store.getters.timeMarkerDistance * i,
            id,
            date,
            this.depthOf(date),
            element
          )
        );
      }

      this.addHTMLElements(...elements);
      store.state.timeMarkers.unshift(...markers);
    }
  }

  /**
   * Places new time markers between the highest existing time marker and the
   * highest date of the timeline.
   */
  public addMarkersRight() {
    const highestMarker =
      store.state.timeMarkers[store.state.timeMarkers.length - 1];

    const distanceToEdge =
      this.timelineElement.scrollWidth - highestMarker.positionCenter;
    highestMarker.positionCenter;
    const numberOfMarkers = Math.floor(
      distanceToEdge / store.getters.timeMarkerDistance
    );

    if (numberOfMarkers > 0) {
      const markers = [] as TimeMarkerModel[];
      const elements: HTMLElement[] = [];

      for (let i = 1; i <= numberOfMarkers; i++) {
        const date = highestMarker.date + store.state.timeMarkerDepth * i;
        const id = uuid();
        const element = this.createHTMLElement(id);
        elements.push(element);

        markers.push(
          new TimeMarkerModel(
            highestMarker.positionCenter + store.getters.timeMarkerDistance * i,
            id,
            date,
            this.depthOf(date),
            element
          )
        );
      }

      this.addHTMLElements(...elements);
      store.state.timeMarkers.push(...markers);
    }
  }

  /**
   * Places new time markers at a depth level which is one level lower
   * than the current depth level. That means between every pair of
   * time markers 9 new equidistant markers will be created.
   */
  public addMarkersBetween() {
    store.commit(
      "setTimeMarkerDepth",
      store.state.timeMarkerDepth / Constants.DEPTH_BASE
    );

    const markers = [] as TimeMarkerModel[];
    const elements: HTMLElement[] = [];

    for (let i = 0, n = store.state.timeMarkers.length; i < n - 1; i++) {
      markers[i * 10] = store.state.timeMarkers[i];
      for (let m = 1; m < 10; m++) {
        const id = uuid();
        const element = this.createHTMLElement(id);
        elements.push(element);

        markers[i * 10 + m] = new TimeMarkerModel(
          store.state.timeMarkers[i].positionCenter +
            (store.getters.timeMarkerDistance / 10) * m,
          id,
          store.state.timeMarkers[i].date + store.state.timeMarkerDepth * m,
          store.state.timeMarkerDepth,
          element
        );
      }
    }
    markers[markers.length] =
      store.state.timeMarkers[store.state.timeMarkers.length - 1];

    this.addHTMLElements(...elements);
    store.state.timeMarkers = markers;
  }

  /**
   * Places one new time markers left to the lowest marker.
   */
  public addSingleMarkerLeft() {
    const id = uuid();
    const element = this.createHTMLElement(id);

    this.addHTMLElements(element);
    store.state.timeMarkers.unshift(
      new TimeMarkerModel(
        PositionTranslator.toAbsolutePosition(
          store.state.timeMarkers[0].date - store.state.timeMarkerDepth
        ),
        id,
        store.state.timeMarkers[0].date - store.state.timeMarkerDepth,
        store.state.timeMarkerDepth,
        element
      )
    );
  }

  /**
   * Calculates the depth of a date.
   */
  private depthOf(date: number) {
    if (date === 0) {
      return Number.MAX_SAFE_INTEGER;
    }

    let depth = store.state.timeMarkerDepth;
    while (date % depth === 0) {
      depth *= Constants.DEPTH_BASE;
    }

    return (depth /= Constants.DEPTH_BASE);
  }

  private createHTMLElement(id: string): HTMLElement {
    const element = document.createElement("svg");
    element.id = id;
    element.setAttribute("class", "time-marker zoom-transition zoomable");

    return element;
  }

  private addHTMLElements(...elements: HTMLElement[]) {
    let documentFragment = document.createDocumentFragment();

    for (let i = 0; i < elements.length; i++) {
      documentFragment.appendChild(elements[i]);
    }

    this.timeMarkerAreaElement.appendChild(documentFragment);
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
