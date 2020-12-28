import Zoomer from "../zoomer";

/**
 * Observes mouse wheel events
 */
export default class ZoomObserver {
  private timelineElement: HTMLElement;
  private zoomer: Zoomer;
  private constructor() {
    this.zoomer = Zoomer.Instance;

    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.timelineElement.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });
  }

  private changeZoom(e: WheelEvent) {
    if (e.deltaY < 0) {
      this.zoomer.zoom(1.1, e.pageX + this.timelineElement.scrollLeft);
    } else if (e.deltaY > 0) {
      this.zoomer.zoom(0.92, e.pageX + this.timelineElement.scrollLeft);
    }
  }

  private static instance: ZoomObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
