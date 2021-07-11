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

      this.numberOfWheelEvents += 1;
      this.requestZoom(e);
    });
  }

  /**
   * Calls change zoom with the current number of wheel events and resets the number of wheel events
   * before the computation-heavy zoom operation is triggered.
   *
   * @param e wheel event containing the current cursor position and wheel direction
   */
  private requestZoom(e: WheelEvent) {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        const numberOfWheelEvents = this.numberOfWheelEvents;
        this.numberOfWheelEvents = 0;
        this.changeZoom(e, numberOfWheelEvents);
        // TODO: Here we should check whether there are wheel events left and call change zoom.
        // Otherwise, if there is no new wheel event coming in, there will be unprocessed wheel events left.
        // This will lead to
        // 1. ...less zoom being applied than expected by the user
        // 2. ...unexpectedly high zoom being applied the next time the user starts to zoom.
        // In order to know what zoom to apply, we should store the last wheel event. 
        this.ticking = false;
      });
    }
  }

  /**
   * Calls the zoomer with the current cursor position.
   *
   * @param e wheel event containing the current cursor position and wheel direction
   */
  private changeZoom(e: WheelEvent, numberOfWheelEvents: number) {
    if (e.deltaY < 0) {
      this.zoomer.zoom(
        1.1 ** numberOfWheelEvents,
        e.pageX + this.timelineElement.scrollLeft
      );
    } else if (e.deltaY > 0) {
      this.zoomer.zoom(
        0.92 ** numberOfWheelEvents,
        e.pageX + this.timelineElement.scrollLeft
      );
    }
  }

  private static instance: ZoomObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
