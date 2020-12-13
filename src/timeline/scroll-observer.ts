import store from "@/store";

export default class ScrollObserver {
  private timelineElement: HTMLElement;
  private leftEdge = 0;
  private rightEdge = 0;
  private firstWithinBounds = 0;
  private lastWithinBounds = 0;

  constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.timelineElement.addEventListener("scroll", (e: Event) => {
      console.log("------------------------------------------------------");
      this.determineEdges();
      this.determineBoundingMarkers();
      this.changeVisibility();
    });
  }

  private determineEdges() {
    this.leftEdge = this.timelineElement.scrollLeft;
    this.rightEdge = this.leftEdge + this.timelineElement.clientWidth;
    console.log("viewport from " + this.leftEdge + " to " + this.rightEdge);
  }

  private determineBoundingMarkers() {
    this.firstWithinBounds = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > this.leftEdge
    );

    this.lastWithinBounds = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > this.rightEdge - 1
    );

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

    if (this.lastWithinBounds > -1) {
      for (
        let i = this.lastWithinBounds + 1, n = store.state.timeMarkers.length;
        i < n;
        i++
      ) {
        store.state.timeMarkers[i].show = false;
      }
    }
  }

  private static instance: ScrollObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
