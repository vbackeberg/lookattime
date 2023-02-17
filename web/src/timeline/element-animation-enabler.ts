import store from "@/store/store";
import Vue from "vue";
import { TimeMarkerCreator } from "./time-marker-management/time-marker-creator";

export default class ElementAnimationEnabler {
  private timelineElement: HTMLElement;
  private intersectionObserver: IntersectionObserver;

  private constructor() {
    this.timelineElement = store.state.timelineElement;

    this.intersectionObserver = new IntersectionObserver(
      this.setZoomAnimations,
      {
        root: this.timelineElement,
        rootMargin: "200px"
      }
    );

    this.observeTimeEvents();
    this.observeTimeMarkers();
  }

  private observeTimeEvents() {
    store.subscribe(async mutation => {
      if (
        mutation.type === "setTimeEvents" ||
        mutation.type === "addTimeEvent"
      ) {
        await Vue.nextTick();

        store.state.timeEvents.forEach(timeEvent => {
          if (timeEvent.zoomContainerHtmlElement) {
            this.intersectionObserver.observe(
              timeEvent.zoomContainerHtmlElement
            );
          } else {
            console.log("timeevent no html element " + timeEvent.id);
          }
        });
      }
    });
  }

  private observeTimeMarkers() {
    TimeMarkerCreator.eventTarget.addEventListener(
      "time-marker-creation-end",
      () => {
        store.state.timeMarkers.forEach(timeMarker => {
          this.intersectionObserver.observe(timeMarker.htmlElement);
        });
      }
    );
  }

  private setZoomAnimations: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[]
  ) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.addZoomAnimation(entry.target);
      } else {
        this.removeZoomAnimation(entry.target);
      }
    });
  };

  private removeZoomAnimation(element: Element) {
    element.classList.remove("zoom-transition");
  }

  private addZoomAnimation(element: Element) {
    element.classList.add("zoom-transition");
  }

  private static instance: ElementAnimationEnabler;
  public static get Instance(): ElementAnimationEnabler {
    return this.instance || (this.instance = new this());
  }
}
