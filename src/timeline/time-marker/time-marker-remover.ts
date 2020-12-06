import store from "@/store";

export default class TimeMarkerRemover {
  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.leftEdge
    );

    console.log("Remove markers below index: " + index);

    if (index > 0) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    console.log("Remove markers above index: " + index);

    if (index > -1) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
    }
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
