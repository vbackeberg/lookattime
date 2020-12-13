import store from "@/store";

/**
 * Observes scroll events to hide all time markers outside of the viewport.
 */
export default class ScrollObserver {
  private timelineElement: HTMLElement;
  private viewportLeftEdge = 0;
  private viewportRightEdge = 0;
  private firstWithinBounds = 0;
  private lastWithinBounds = 0;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.timelineElement.addEventListener("scroll", (e: Event) => {
      console.log("------------------------------------------------------");
      this.determineEdges();
      this.determineBoundingMarkers();
      this.changeVisibility();
    });
  }

  private determineEdges() {
    this.viewportLeftEdge = this.timelineElement.scrollLeft;
    this.viewportRightEdge = this.viewportLeftEdge + this.timelineElement.clientWidth;
    console.log("viewport from " + this.viewportLeftEdge + " to " + this.viewportRightEdge);
  }

  private determineBoundingMarkers() {
    this.firstWithinBounds = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > this.viewportLeftEdge
    );

    const firstOutsideBounds = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > this.viewportRightEdge
    );
    firstOutsideBounds > -1
      ? (this.lastWithinBounds = firstOutsideBounds - 1)
      : (this.lastWithinBounds = store.state.timeMarkers.length - 1);

    console.log("index first marker within bounds " + this.firstWithinBounds);
    console.log("index last marker within bounds " + this.lastWithinBounds);
  }

  private changeVisibility() {
    for (let i = 0; i < this.firstWithinBounds; i++) {
      store.state.timeMarkers[i].show = false;
    }

    for (let i = this.firstWithinBounds; i <= this.lastWithinBounds; i++) {
      store.state.timeMarkers[i].show = true;
    }

    for (
      let i = this.lastWithinBounds + 1, n = store.state.timeMarkers.length;
      i < n;
      i++
    ) {
      store.state.timeMarkers[i].show = false;
    }
  }

  private static instance: ScrollObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
