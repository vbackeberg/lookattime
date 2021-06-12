import store from "@/store/store";
import Zoomer from "./zoomer";

/**
 * Observes mouse wheel events and calls zoomer with zoom factor according to wheel spin direction.
 */
export default class ZoomObserver {
  private timelineElement: HTMLElement;
  private zoomer: Zoomer;
  private numberOfWheelEvents = 0;
  private ticking = false;
  private constructor() {
    this.zoomer = Zoomer.Instance;
    this.timelineElement = store.state.timelineElement;
    this.timelineElement.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      e.preventDefault();

      if (store.state.timeEvents.length === 0) {
        return;
      }

      console.log("wheel event: " + this.numberOfWheelEvents);
      this.numberOfWheelEvents += 1;
      this.requestTick(e);
    });
  }

  private requestTick(e: WheelEvent) {
    if (!this.ticking) {
      requestAnimationFrame(() => this.update(e));
    }
    this.ticking = true;
  }

  private update(e: WheelEvent) {
    console.log("update");
    this.changeZoom(e);
    this.numberOfWheelEvents = 0;
    this.ticking = false;
  }

  private changeZoom(e: WheelEvent) {
    if (e.deltaY < 0) {
      this.zoomer.zoom(
        1.1 ** this.numberOfWheelEvents,
        e.pageX + this.timelineElement.scrollLeft
      );
    } else if (e.deltaY > 0) {
      this.zoomer.zoom(
        0.92 ** this.numberOfWheelEvents,
        e.pageX + this.timelineElement.scrollLeft
      );
    }
  }

  private static instance: ZoomObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
